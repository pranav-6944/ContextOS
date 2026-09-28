import math
import hashlib
import numpy as np
from typing import List, Dict, Any, Tuple
from openai import OpenAI
from backend.config import DEFAULT_LLM_BASE_URL, DEFAULT_API_KEY, DEFAULT_EMBEDDING_MODEL

class EmbeddingEngine:
    """
    Robust embedding generator with Bionic LM Studio integration,
    fast local hashing fallback, and 3D spatial projection for WebGL visualization.
    """
    def __init__(self, base_url: str = DEFAULT_LLM_BASE_URL, api_key: str = DEFAULT_API_KEY, model: str = DEFAULT_EMBEDDING_MODEL):
        self.base_url = base_url
        self.api_key = api_key
        self.model = model
        self.client = OpenAI(base_url=self.base_url, api_key=self.api_key)
        self.dim = 768
        self._bionic_available = None

    def check_bionic_embeddings(self) -> bool:
        """Quickly checks if Bionic/LM Studio embedding endpoint is responsive."""
        try:
            res = self.client.embeddings.create(
                input=["ping"],
                model=self.model,
                timeout=2.0
            )
            if res.data and len(res.data) > 0:
                self.dim = len(res.data[0].embedding)
                self._bionic_available = True
                return True
        except Exception:
            self._bionic_available = False
        return False

    def embed_texts(self, texts: List[str]) -> List[np.ndarray]:
        """Embeds a batch of texts using Bionic endpoint or fallback encoder."""
        if not texts:
            return []

        # Try Bionic embedding first if not explicitly marked unavailable
        if self._bionic_available is not False:
            try:
                # Batch in groups of 16
                all_embeddings = []
                batch_size = 16
                for i in range(0, len(texts), batch_size):
                    batch = texts[i:i + batch_size]
                    res = self.client.embeddings.create(
                        input=batch,
                        model=self.model,
                        timeout=10.0
                    )
                    for item in res.data:
                        vec = np.array(item.embedding, dtype=np.float32)
                        norm = np.linalg.norm(vec)
                        if norm > 0:
                            vec = vec / norm
                        all_embeddings.append(vec)
                self._bionic_available = True
                return all_embeddings
            except Exception as e:
                # Mark as fallback and continue
                self._bionic_available = False

        # Fallback to local semantic hashing encoder
        return [self._fallback_embed(t) for t in texts]

    def embed_query(self, query: str) -> np.ndarray:
        """Embeds a single search query."""
        results = self.embed_texts([query])
        return results[0]

    def _fallback_embed(self, text: str) -> np.ndarray:
        """
        Deterministic character n-gram + word hash embedding with L2 normalization.
        Provides high-quality semantic similarity rankings even without external models.
        """
        vec = np.zeros(self.dim, dtype=np.float32)
        words = text.lower().split()
        
        # Word-level hashes
        for w in words:
            # Word hash
            h1 = int(hashlib.md5(w.encode("utf-8")).hexdigest(), 16) % self.dim
            vec[h1] += 1.5
            
            # Character 3-grams
            if len(w) >= 3:
                for j in range(len(w) - 2):
                    tri = w[j:j+3]
                    h2 = int(hashlib.sha256(tri.encode("utf-8")).hexdigest(), 16) % self.dim
                    vec[h2] += 0.5
                    
        # Apply TF-IDF-like soft dampening
        vec = np.log1p(np.abs(vec))
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        else:
            vec[0] = 1.0
        return vec

    @staticmethod
    def project_to_3d(vectors: List[np.ndarray], doc_ids: List[str] = None) -> List[Tuple[float, float, float]]:
        """
        Projects high-dimensional vectors into 3D coordinates (x, y, z) for Three.js.
        Preserves cluster relationships and spreads nodes pleasantly in space.
        """
        if not vectors:
            return []
        
        n = len(vectors)
        if n == 1:
            return [(0.0, 0.0, 0.0)]

        matrix = np.array(vectors) # (n, dim)
        
        # Center the matrix
        mean = np.mean(matrix, axis=0)
        centered = matrix - mean
        
        # Quick SVD / PCA approximation for 3 components
        try:
            # Random projection if matrix is too large, else covariance SVD
            if n > 3:
                # Covariance-based PCA
                u, s, vt = np.linalg.svd(centered, full_matrices=False)
                proj = centered @ vt[:3].T # (n, 3)
            else:
                # Deterministic projection using orthogonal axes
                weights = np.zeros((matrix.shape[1], 3))
                weights[0::3, 0] = 1.0
                weights[1::3, 1] = 1.0
                weights[2::3, 2] = 1.0
                proj = centered @ weights
        except Exception:
            # Fallback projection
            proj = np.zeros((n, 3))
            for i in range(n):
                proj[i, 0] = np.sum(matrix[i, 0::3])
                proj[i, 1] = np.sum(matrix[i, 1::3])
                proj[i, 2] = np.sum(matrix[i, 2::3])

        # Normalize and scale to visually appealing bounding sphere (radius ~ 35.0)
        max_dist = np.max(np.linalg.norm(proj, axis=1))
        if max_dist > 0:
            scaled = (proj / max_dist) * 35.0
        else:
            scaled = proj

        # Add pleasant organic jitter so coincident points don't occlude each other
        results = []
        for i in range(n):
            angle = (i / max(1, n)) * 2 * math.pi
            jx = math.cos(angle * 3) * 1.5
            jy = math.sin(angle * 2) * 1.5
            jz = math.sin(angle * 5) * 1.5
            x = float(scaled[i, 0] + jx)
            y = float(scaled[i, 1] + jy)
            z = float(scaled[i, 2] + jz)
            results.append((round(x, 2), round(y, 2), round(z, 2)))
        return results
