# ContextOS 🌌
### Next-Generation 3D Animated RAG Operating System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg?style=flat&logo=three.js)](https://threejs.org)
[![LM Studio / Bionic](https://img.shields.io/badge/Bionic_LLM-Local_GPU-00F0FF.svg?style=flat)](http://localhost:1234/v1)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> A local-first Retrieval-Augmented Generation (RAG) platform that lets users chat with their documents using a locally hosted LLM, with semantic retrieval, source citations, and an interactive 3D WebGL visualization of the RAG pipeline.

---

## 🌟 Why ContextOS?

While most college and enterprise RAG projects rely on basic, static Streamlit widgets, **ContextOS** re-imagines the document intelligence workflow as an immersive, sci-fi **3D Operating System**:

- 🪐 **Interactive 3D Neural Galaxy**: Vector chunks are projected into a 3D coordinate space using PCA. Rotate, zoom, and explore your document clusters in real-time WebGL.
- ⚡ **Laser-Pulse Semantic Retrieval**: Watch energy lasers connect your query node to retrieved context chunks across 768-dimensional space.
- 🔬 **Interactive 3D Pipeline Inspector**: Step-by-step visual execution flow from document ingestion to token generation.
- 🛡️ **100% Private Local Inference**: Zero data leaves your computer. Powered by **LM Studio / Bionic** at `http://localhost:1234/v1`.
- 🗃️ **Multi-Format Document Vault**: Drag-and-drop parsing for **PDF, DOCX, Markdown, Text, CSV, and JSON**.
- 📊 **Real-Time Telemetry HUD**: Live tokens/sec, retrieval latency (ms), cosine similarity match meters, and audio feedback.

---

## 🏗️ 5-Stage RAG Pipeline Architecture

```
[ Documents: PDF / DOCX / TXT ]
               │
               ▼  Stage 1: Multi-Format Structural Parsing
[ Clean Sections & Page Numbers ]
               │
               ▼  Stage 2: Recursive Semantic Chunking (600 chars, 120 overlap)
[ Chunk Index with Metadata ]
               │
               ▼  Stage 3: 768-D Vector Embeddings (Nomic Embed v1.5 / Local)
[ Normalized Vector Matrix ] ───► [ 3D PCA Projection & WebGL Render ]
               │
               ▼  Stage 4: Cosine Similarity Nearest-Neighbor Search
[ Top-K Ranked Context Chunks ]
               │
               ▼  Stage 5: Context-Augmented Prompting & SSE Streaming
[ Bionic / LM Studio Local GPU (http://localhost:1234/v1) ]
               │
               ▼
[ Real-Time Typewriter Stream with Interactive Citations ]
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- (Optional) [LM Studio / Bionic](https://lmstudio.ai/) running on port `1234` with an embedding model (e.g. `text-embedding-nomic-embed-text-v1.5`) and a chat model (e.g. `qwen/qwen3.5-9b` or `google/gemma-4-e2b`).
  > *Note: If Bionic is still loading or offline, ContextOS automatically activates its intelligent Standby Engine so you can present the 3D pipeline and semantic retrieval without interruption!*

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/pranav-6944/ContextOS.git
cd ContextOS

# Install dependencies
pip install -r requirements.txt
```

### 3. Launch ContextOS
```bash
python run.py
```
Open your browser to:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🖥️ User Interface Views

| View | Description |
|------|-------------|
| **Terminal Chat** | Interactive typewriter chat with clickable citation pills, telemetry tags, and quick-prompt chips. |
| **3D Galaxy** | OrbitControls 3D vector space displaying documents as colored orbital clusters and synaptic links. |
| **3D Pipeline** | Interactive 5-stage architecture breakdown showing intermediate data payloads. |
| **Bento Matrix** | High-density grid displaying chunk snippets, word counts, and vector coordinates. |

---

## ⚙️ Configuration & Settings

Access the Settings Modal in the top-right header to configure:
- **Local LLM Endpoint**: Default `http://localhost:1234/v1`
- **Model Selector**: Auto-detects models loaded in LM Studio / Bionic
- **Retrieval Top-K**: Adjust between 1 and 10 nearest chunks
- **Temperature**: Control randomness from 0.0 (deterministic) to 1.5 (creative)
- **Audio Feedback**: Toggle synthesizer click & beam audio

---

## 📁 Repository Structure

```
ContextOS/
├── backend/
│   ├── main.py              # FastAPI server, SSE streaming, static mounting
│   ├── config.py            # Environment settings and paths
│   ├── document_parser.py   # Multi-format parser (PDF, DOCX, TXT, MD, CSV, JSON)
│   ├── chunker.py           # Recursive chunker with overlap and metadata
│   ├── embeddings.py        # 768-D Bionic embeddings + fallback + 3D projection
│   ├── vector_store.py      # Cosine similarity index & JSON persistence
│   └── llm_service.py       # OpenAI-compatible streaming client + Standby engine
├── frontend/
│   ├── index.html           # Main HUD interface with 21st.dev aesthetics
│   ├── css/
│   │   └── style.css        # OLED glassmorphic CSS, animations, responsive HUD
│   └── js/
│       ├── app.js           # Client controller, SSE stream, vault manager
│       └── three_scene.js   # Three.js 3D Neural Galaxy & WebGL visualizer
├── sample_data/             # Preloaded whitepapers & knowledge bases
├── requirements.txt         # Project dependencies
├── run.py                   # Single-command launcher script
├── AI_NOTES.md              # Project notes & references
└── README.md                # Project documentation
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

**Author**: [Pranav](https://github.com/pranav-6944)
