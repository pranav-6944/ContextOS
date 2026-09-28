import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
VECTOR_STORE_FILE = DATA_DIR / "vector_store.json"
SAMPLE_DATA_DIR = BASE_DIR / "sample_data"

# Create required directories
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Local LLM & Bionic / LM Studio Settings
DEFAULT_LLM_BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:1234/v1")
DEFAULT_API_KEY = os.getenv("LLM_API_KEY", "lm-studio")

# Default Models
DEFAULT_CHAT_MODEL = os.getenv("CHAT_MODEL", "qwen/qwen3.5-9b")
DEFAULT_EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-nomic-embed-text-v1.5")

# RAG Hyperparameters
DEFAULT_CHUNK_SIZE = 600
DEFAULT_CHUNK_OVERLAP = 120
DEFAULT_TOP_K = 4
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 1024

# Server Configuration
SERVER_HOST = "127.0.0.1"
SERVER_PORT = 8000
