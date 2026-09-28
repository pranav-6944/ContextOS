import os
import json
import time
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from backend.config import VECTOR_STORE_FILE
from backend.embeddings import EmbeddingEngine

class VectorStore:
    """
    In-memory vector store with JSON disk persistence, millisecond cosine similarity,
    and 3D coordinates for Three.js knowledge visualization.
    """
    def __init__(self, persistence_file: Path = VECTOR_STORE_FILE):
        self.persistence_file = persistence_file
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.chunks: List[Dict[str, Any]] = []
        self.embeddings_matrix: Optional[np.ndarray] = None # shape: (num_chunks, dim)
        self.load()

    def add_document(self, doc_id: str, doc_name: str, file_size: int, chunks: List[Dict[str, Any]], embeddings: List[np.ndarray]):
        """Adds a new document with chunks and vector representations."""
        # Calculate 3D coordinates
        coords = EmbeddingEngine.project_to_3d(embeddings)

        new_chunks = []
        for i, chunk in enumerate(chunks):
            x, y, z = coords[i] if i < len(coords) else (0.0, 0.0, 0.0)
            chunk_record = {
                "chunk_id": chunk["chunk_id"],
                "doc_id": doc_id,
                "doc_name": doc_name,
                "page": chunk.get("page", 1),
                "section": chunk.get("section", ""),
                "chunk_index": chunk.get("chunk_index", i),
                "text": chunk["text"],
                "word_count": chunk.get("word_count", len(chunk["text"].split())),
                "char_count": chunk.get("char_count", len(chunk["text"])),
                "x": x,
                "y": y,
                "z": z,
                "embedding": embeddings[i].tolist() # Stored for disk persistence
            }
            new_chunks.append(chunk_record)

        self.documents[doc_id] = {
            "doc_id": doc_id,
            "doc_name": doc_name,
            "file_size": file_size,
            "chunk_count": len(new_chunks),
            "uploaded_at": time.time(),
            "status": "indexed"
        }

        # Remove previous chunks if overwriting
        self.chunks = [c for c in self.chunks if c["doc_id"] != doc_id]
        self.chunks.extend(new_chunks)

        self._rebuild_matrix()
        self.save()

    def delete_document(self, doc_id: str) -> bool:
        """Deletes a document and all associated chunks."""
        if doc_id in self.documents:
            del self.documents[doc_id]
            self.chunks = [c for c in self.chunks if c["doc_id"] != doc_id]
            self._rebuild_matrix()
            self.save()
            return True
        return False

    def search(self, query_vector: np.ndarray, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Executes semantic cosine similarity search across all stored chunks.
        Returns top-K matching chunks sorted by relevance score.
        """
        if not self.chunks or self.embeddings_matrix is None or len(self.chunks) == 0:
            return []

        # Cosine similarity: query_vector @ matrix.T (since all vectors are L2-normalized)
        q_norm = np.linalg.norm(query_vector)
        if q_norm > 0:
            q_normed = query_vector / q_norm
        else:
            q_normed = query_vector

        scores = np.dot(self.embeddings_matrix, q_normed) # (num_chunks,)
        top_k = min(top_k, len(self.chunks))
        
        # Get top indices
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            chunk = self.chunks[idx].copy()
            # Remove raw embedding array before returning to API
            chunk.pop("embedding", None)
            chunk["score"] = float(round(scores[idx], 4))
            chunk["match_percent"] = max(0.0, min(100.0, round(float(scores[idx]) * 100, 1)))
            results.append(chunk)

        return results

    def get_all_chunks_3d(self) -> List[Dict[str, Any]]:
        """Returns lightweight chunk representation for Three.js rendering."""
        data = []
        for c in self.chunks:
            data.append({
                "chunk_id": c["chunk_id"],
                "doc_id": c["doc_id"],
                "doc_name": c["doc_name"],
                "page": c["page"],
                "section": c["section"],
                "snippet": c["text"][:140] + ("..." if len(c["text"]) > 140 else ""),
                "word_count": c.get("word_count", 0),
                "x": c.get("x", 0.0),
                "y": c.get("y", 0.0),
                "z": c.get("z", 0.0)
            })
        return data

    def get_documents(self) -> List[Dict[str, Any]]:
        """Returns list of documents sorted by most recent."""
        docs = list(self.documents.values())
        docs.sort(key=lambda d: d.get("uploaded_at", 0), reverse=True)
        return docs

    def get_stats(self) -> Dict[str, Any]:
        """Returns statistics for telemetry and HUD display."""
        total_words = sum(c.get("word_count", 0) for c in self.chunks)
        dim = self.embeddings_matrix.shape[1] if self.embeddings_matrix is not None else 0
        return {
            "total_documents": len(self.documents),
            "total_chunks": len(self.chunks),
            "total_words": total_words,
            "vector_dimension": dim,
            "index_status": "ready" if len(self.chunks) > 0 else "empty"
        }

    def _rebuild_matrix(self):
        """Reconstructs in-memory NumPy matrix from chunks."""
        if not self.chunks:
            self.embeddings_matrix = None
            return

        vectors = []
        for c in self.chunks:
            v = np.array(c.get("embedding", []), dtype=np.float32)
            norm = np.linalg.norm(v)
            if norm > 0:
                v = v / norm
            vectors.append(v)
        
        self.embeddings_matrix = np.array(vectors)

    def save(self):
        """Saves documents and chunks to JSON file."""
        try:
            data = {
                "documents": self.documents,
                "chunks": self.chunks
            }
            with open(self.persistence_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[VectorStore] Error saving: {e}")

    def load(self):
        """Loads vector store from JSON file if available."""
        if self.persistence_file.exists():
            try:
                with open(self.persistence_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.documents = data.get("documents", {})
                    self.chunks = data.get("chunks", [])
                    self._rebuild_matrix()
            except Exception as e:
                print(f"[VectorStore] Error loading: {e}")
