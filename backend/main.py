import os
import uuid
import time
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from pydantic import BaseModel

from backend.config import (
    BASE_DIR, UPLOADS_DIR, SAMPLE_DATA_DIR,
    DEFAULT_LLM_BASE_URL, DEFAULT_API_KEY,
    DEFAULT_CHAT_MODEL, DEFAULT_EMBEDDING_MODEL,
    DEFAULT_CHUNK_SIZE, DEFAULT_CHUNK_OVERLAP,
    DEFAULT_TOP_K, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS
)
from backend.document_parser import DocumentParser
from backend.chunker import RecursiveChunker
from backend.embeddings import EmbeddingEngine
from backend.vector_store import VectorStore
from backend.llm_service import LLMService

app = FastAPI(
    title="ContextOS API",
    description="Local-first 3D RAG Operating System powered by Bionic / LM Studio",
    version="1.0.0"
)

# Enable CORS for local cross-origin development if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Instances
vector_store = VectorStore()
embedding_engine = EmbeddingEngine(base_url=DEFAULT_LLM_BASE_URL, model=DEFAULT_EMBEDDING_MODEL)
llm_service = LLMService(base_url=DEFAULT_LLM_BASE_URL, model=DEFAULT_CHAT_MODEL)
chunker = RecursiveChunker(chunk_size=DEFAULT_CHUNK_SIZE, chunk_overlap=DEFAULT_CHUNK_OVERLAP)

# In-memory session settings
current_settings = {
    "llm_base_url": DEFAULT_LLM_BASE_URL,
    "chat_model": DEFAULT_CHAT_MODEL,
    "embedding_model": DEFAULT_EMBEDDING_MODEL,
    "chunk_size": DEFAULT_CHUNK_SIZE,
    "chunk_overlap": DEFAULT_CHUNK_OVERLAP,
    "top_k": DEFAULT_TOP_K,
    "temperature": DEFAULT_TEMPERATURE,
    "max_tokens": DEFAULT_MAX_TOKENS
}

# --- Pydantic Schemas ---
class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = None
    temperature: Optional[float] = None
    chat_model: Optional[str] = None

class SettingsUpdateRequest(BaseModel):
    llm_base_url: Optional[str] = None
    chat_model: Optional[str] = None
    embedding_model: Optional[str] = None
    top_k: Optional[int] = None
    temperature: Optional[float] = None
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None

# --- API Routes ---

@app.get("/api/status")
async def get_system_status():
    """Returns connectivity to Bionic / LM Studio and vector store statistics."""
    bionic_status = llm_service.check_connection()
    store_stats = vector_store.get_stats()
    
    return {
        "status": "online",
        "bionic": bionic_status,
        "store": store_stats,
        "settings": current_settings
    }

@app.get("/api/models")
async def get_available_models():
    """Fetches list of available models from LM Studio / Bionic."""
    conn = llm_service.check_connection()
    return {
        "online": conn.get("online", False),
        "models": conn.get("models", []),
        "active_model": current_settings["chat_model"],
        "active_embedding": current_settings["embedding_model"]
    }

@app.get("/api/documents")
async def list_documents():
    """Returns list of indexed documents."""
    return {
        "documents": vector_store.get_documents(),
        "total": len(vector_store.documents)
    }

@app.delete("/api/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Deletes an indexed document and removes its vector chunks."""
    success = vector_store.delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully", "doc_id": doc_id}

@app.get("/api/chunks")
async def get_3d_chunks():
    """Returns all stored chunks with 3D coordinates for Three.js visualization."""
    return {
        "chunks": vector_store.get_all_chunks_3d(),
        "total": len(vector_store.chunks),
        "documents": vector_store.get_documents()
    }

@app.post("/api/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    """Uploads, parses, chunks, embeds, and indexes one or more documents."""
    results = []
    
    for file in files:
        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        filename = file.filename or f"doc_{doc_id}"
        save_path = UPLOADS_DIR / f"{doc_id}_{filename}"
        
        # Save file to disk
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = save_path.stat().st_size

        # 1. Parse Document
        pages = DocumentParser.parse_file(save_path)
        
        # 2. Chunk Document
        chunks = chunker.chunk_document_pages(doc_id=doc_id, doc_name=filename, pages=pages)
        if not chunks:
            continue
            
        # 3. Generate Embeddings
        texts_to_embed = [c["text"] for c in chunks]
        embeddings = embedding_engine.embed_texts(texts_to_embed)
        
        # 4. Add to Vector Store
        vector_store.add_document(
            doc_id=doc_id,
            doc_name=filename,
            file_size=file_size,
            chunks=chunks,
            embeddings=embeddings
        )

        results.append({
            "doc_id": doc_id,
            "filename": filename,
            "chunks_count": len(chunks),
            "size_bytes": file_size
        })

    return {
        "message": f"Successfully indexed {len(results)} document(s)",
        "documents": results,
        "store_stats": vector_store.get_stats()
    }

@app.post("/api/preload-samples")
async def preload_sample_documents():
    """Preloads the default sample knowledge docs into the vector store."""
    loaded = []
    if SAMPLE_DATA_DIR.exists():
        for sample_file in SAMPLE_DATA_DIR.glob("*.*"):
            doc_id = f"sample_{sample_file.stem}"
            filename = sample_file.name
            
            # Check if already indexed
            if doc_id in vector_store.documents:
                continue

            file_size = sample_file.stat().st_size
            pages = DocumentParser.parse_file(sample_file)
            chunks = chunker.chunk_document_pages(doc_id=doc_id, doc_name=filename, pages=pages)
            
            if chunks:
                texts = [c["text"] for c in chunks]
                embeddings = embedding_engine.embed_texts(texts)
                vector_store.add_document(
                    doc_id=doc_id,
                    doc_name=filename,
                    file_size=file_size,
                    chunks=chunks,
                    embeddings=embeddings
                )
                loaded.append(filename)

    return {
        "message": f"Preloaded {len(loaded)} sample document(s)",
        "preloaded": loaded,
        "store_stats": vector_store.get_stats()
    }

@app.post("/api/query")
@app.post("/api/rag/query")
async def query_rag(req: QueryRequest):
    """
    Performs vector similarity search and streams the augmented RAG response via SSE.
    """
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    top_k = req.top_k or current_settings["top_k"]
    temperature = req.temperature or current_settings["temperature"]
    
    # 1. Embed query
    query_vector = embedding_engine.embed_query(query)

    # 2. Retrieve top-K chunks
    retrieved_chunks = vector_store.search(query_vector, top_k=top_k)

    # 3. Update LLM model if specified
    if req.chat_model and req.chat_model != llm_service.model:
        llm_service.model = req.chat_model

    # 4. Stream response
    return StreamingResponse(
        llm_service.stream_rag_response(
            query=query,
            retrieved_chunks=retrieved_chunks,
            temperature=temperature,
            max_tokens=current_settings["max_tokens"]
        ),
        media_type="text/event-stream"
    )

@app.post("/api/settings")
async def update_settings(req: SettingsUpdateRequest):
    """Updates runtime configuration settings."""
    if req.llm_base_url:
        current_settings["llm_base_url"] = req.llm_base_url
        llm_service.base_url = req.llm_base_url
        embedding_engine.base_url = req.llm_base_url
        llm_service.client.base_url = req.llm_base_url
        embedding_engine.client.base_url = req.llm_base_url

    if req.chat_model:
        current_settings["chat_model"] = req.chat_model
        llm_service.model = req.chat_model

    if req.embedding_model:
        current_settings["embedding_model"] = req.embedding_model
        embedding_engine.model = req.embedding_model

    if req.top_k:
        current_settings["top_k"] = req.top_k

    if req.temperature:
        current_settings["temperature"] = req.temperature

    if req.chunk_size:
        current_settings["chunk_size"] = req.chunk_size
        chunker.chunk_size = req.chunk_size

    if req.chunk_overlap:
        current_settings["chunk_overlap"] = req.chunk_overlap
        chunker.chunk_overlap = req.chunk_overlap

    return {"message": "Settings updated", "settings": current_settings}

# Mount Frontend static files (Check dist first for built React SPA)
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
FRONTEND_DIR = BASE_DIR / "frontend"

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
elif FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
