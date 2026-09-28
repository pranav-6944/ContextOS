# ContextOS - AI Notes & Project Knowledge Base

## Project Overview
- **Name**: ContextOS (Next-Gen 3D Animated RAG Operating System)
- **Repository**: `https://github.com/pranav-6944/ContextOS`
- **Objective**: Build a cutting-edge Retrieval-Augmented Generation (RAG) platform powered by local LLMs via LM Studio / Bionic (`http://localhost:1234/v1`), featuring an immersive 3D interactive animated UI (inspired by 21st.dev and ui-ux-pro-max guidelines), leaving traditional Streamlit apps far behind.
- **Author**: Pranav (`pranav-6944`)

---

## Technical Stack & Ports
- **Backend**: Python 3.13 + FastAPI + Uvicorn + Pydantic + PyPDF / python-docx + NumPy / Scikit-learn
- **Local LLM Endpoint**: `http://localhost:1234/v1` (LM Studio / Bionic)
  - Embedding Model: `text-embedding-nomic-embed-text-v1.5` (768 dimensions verified)
  - Chat Models Available: `qwen3.6-12b-iq`, `qwen/qwen3.5-9b`, `google/gemma-4-e2b`, `gemma-4-e4b-uncensored-hauhaucs-aggressive`
- **Frontend Architecture**:
  - WebGL / Three.js 3D Neural Constellation & RAG Pipeline Visualizer
  - 21st.dev inspired components: Glowing Bento Grid, Glassmorphic HUD, Shimmer Badges, Sci-Fi Terminal Telemetry
  - Zero-friction unified app: FastAPI serves production-grade static UI + API routes on `http://localhost:8000`
- **Git Remote**: `https://github.com/pranav-6944/ContextOS.git` (branch: `main`)

---

## Key Modules, File Index & Important Line References

### 1. `backend/config.py`
- Line 1-28: Configuration constants, paths (`DATA_DIR`, `UPLOADS_DIR`, `VECTOR_STORE_FILE`, `SAMPLE_DATA_DIR`).
- Line 14: `DEFAULT_LLM_BASE_URL = "http://localhost:1234/v1"`
- Line 18-19: Default models (`qwen/qwen3.5-9b`, `text-embedding-nomic-embed-text-v1.5`).
- Line 22-26: RAG hyperparameters (chunk size: 600, overlap: 120, top-k: 4, temperature: 0.7).

### 2. `backend/document_parser.py`
- Line 8: `DocumentParser` class.
- Line 15-28: `parse_file()` router by file extension (`.pdf`, `.docx`, `.csv`, `.json`, `.txt`, `.md`).
- Line 30-48: `_parse_pdf()` with `pypdf.PdfReader` extracting per-page text & section metadata.
- Line 50-67: `_parse_docx()` with `docx.Document`.
- Line 69-90: `_parse_csv()` extracting tabular data rows.
- Line 92-108: `_parse_json()` formatting JSON structure.

### 3. `backend/chunker.py`
- Line 4: `RecursiveChunker` class with separators `["\n\n", "\n", ". ", "? ", "! ", "; ", " ", ""]`.
- Line 14: `chunk_document_pages()` creates chunks with `chunk_id`, `page`, `section`, `word_count`, `char_count`.
- Line 50-95: Recursive split and merge algorithms maintaining strict chunk size and overlap boundaries.

### 4. `backend/embeddings.py`
- Line 9: `EmbeddingEngine` class.
- Line 20-33: `check_bionic_embeddings()` tests connectivity to `http://localhost:1234/v1/embeddings`.
- Line 35-65: `embed_texts()` batch embedding via OpenAI SDK client with fallback.
- Line 74-100: `_fallback_embed()` deterministic subword & n-gram TF-IDF hashing with L2-normalization.
- Line 102-149: `project_to_3d()` PCA / SVD projection to compute 3D Euclidean `(x, y, z)` coordinates for Three.js rendering.

### 5. `backend/vector_store.py`
- Line 10: `VectorStore` class with in-memory NumPy matrix and disk JSON persistence (`data/vector_store.json`).
- Line 20-56: `add_document()` stores chunks, attaches 3D coordinates, updates matrix.
- Line 58-67: `delete_document()` removes document and rebuilds matrix.
- Line 69-98: `search()` fast dot-product cosine similarity retrieval returning top-K chunks with match percentage.
- Line 100-116: `get_all_chunks_3d()` returns lightweight chunk payloads for Three.js rendering.

### 6. `backend/llm_service.py`
- Line 9: `LLMService` class.
- Line 19-40: `check_connection()` checks if Bionic / LM Studio is online and lists loaded models.
- Line 42-120: `stream_rag_response()` Server-Sent Events (SSE) generator emitting tokens, citations, telemetry tags.
- Line 122-156: `_synthesize_standby_response()` intelligent contextual synthesis when local LLM is still loading in VRAM.

### 7. `backend/main.py`
- Line 23: FastAPI application initialization with CORS.
- Line 66-77: `GET /api/status` - Bionic status and vector store stats.
- Line 79-88: `GET /api/models` - live models list from Bionic.
- Line 90-108: `GET /api/documents` and `DELETE /api/documents/{doc_id}`.
- Line 110-117: `GET /api/chunks` - 3D coordinates and metadata.
- Line 119-158: `POST /api/upload` - multi-file ingestion pipeline.
- Line 160-193: `POST /api/preload-samples` - preloads whitepaper & guide into knowledge vault.
- Line 195-224: `POST /api/query` - SSE streaming RAG query.
- Line 226-258: `POST /api/settings` - updates hyperparameter settings.
- Line 260-264: Mounts `frontend/` static directory at `/`.

### 8. `frontend/index.html`
- Line 1-28: Header, Google Fonts (`Inter`, `Space Grotesk`, `JetBrains Mono`), Three.js & OrbitControls scripts.
- Line 30-33: `<canvas id="webgl-canvas"></canvas>` background 3D canvas.
- Line 36-118: Header HUD with brand logo, 4 view tabs (Chat, 3D Galaxy, Pipeline, Bento Matrix), status pills, settings modal trigger.
- Line 120-165: Left sidebar Document Vault (drag & drop dropzone, sample loader, file list).
- Line 168-308: Center stage view panels:
  - `view-chat`: Suggestion pills, message scroller, glowing input bar.
  - `view-galaxy`: 3D HUD telemetry counters (total chunks, latency, TPS) and camera controls.
  - `view-pipeline`: 5-stage interactive RAG pipeline flow cards.
  - `view-matrix`: Bento grid matrix of stored chunks.
- Line 310-340: Right inspector drawer for detailed chunk inspection.
- Line 342-390: Settings modal with model selector, Top-K, and temperature sliders.

### 9. `frontend/js/three_scene.js`
- Line 6: `GalaxyVisualizer` class.
- Line 35-102: Three.js Scene, PerspectiveCamera, WebGLRenderer, OrbitControls, lights, starfield particle system.
- Line 104-135: `createStarfield()` 1500 particles with cosmic cyan & purple tint.
- Line 137-200: `updateChunks()` creates 3D glowing sphere nodes for each chunk colored by document palette.
- Line 202-236: `createSynapseLines()` draws translucent synaptic connecting lines between related chunks.
- Line 238-285: `animateQueryRetrieval()` shoots glowing laser conduits from central query core to retrieved chunks.
- Line 320-358: Raycaster hover & click events with holographic tooltips.
- Line 378-430: `SoundFX` Web Audio API sci-fi synthesizer (click, frequency beam).

### 10. `frontend/js/app.js`
- Line 5-25: Client state management (`activeTab`, `documents`, `chunks`, `settings`, `telemetry`).
- Line 50-78: `refreshSystemStatus()` updates Bionic connection status indicator and model dropdown.
- Line 80-112: `refreshDocumentsAndChunks()` loads documents and syncs 3D visualizer and Bento matrix.
- Line 160-205: `uploadFiles()` handles multi-document drag-and-drop upload.
- Line 207-330: `executeRagQuery()` streaming SSE fetch with typewriter effect, citation chips, and 3D pulse trigger.
- Line 360-400: Navigation tab switcher and Bento grid renderer.
- Line 410-450: Inspector drawer for chunk and citation drilldown.

---

## Verification & Testing
- Tested FastAPI server startup: `python run.py` (serves clean on `http://127.0.0.1:8000`).
- Preloaded sample knowledge documents: `contextos_whitepaper.txt` and `generative_ai_guide.txt`.
- Tested semantic retrieval: Vector search correctly identifies chunks and ranks cosine scores.
- Connected to git remote: `https://github.com/pranav-6944/ContextOS.git` on branch `main`.
