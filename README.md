# ContextOS 🌌
### Full-Stack 3D Animated RAG Operating System

[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000.svg?style=flat&logo=three.js)](https://threejs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![LM Studio / Bionic](https://img.shields.io/badge/Bionic_LLM-Local_GPU-00F0FF.svg?style=flat)](http://localhost:1234/v1)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> A modern, full-stack, local-first Retrieval-Augmented Generation (RAG) platform featuring interactive 3D WebGL neural topology, multi-section landing pages, a comprehensive control dashboard, and zero-cloud private LLM inference via Bionic & LM Studio.

---

## 🌟 ContextOS vs. Standard Streamlit RAG Projects

| Feature | Standard Streamlit App | **ContextOS Full-Stack** |
| :--- | :--- | :--- |
| **Frontend Architecture** | Python script with static reruns | **React 19 + Vite + Tailwind v4 Single-Page Application** |
| **Landing Pages** | None (Immediate plain chat box) | **Multi-Section Landing Page** (Hero with 3D Canvas, 21st.dev Bento Grid, 5-Stage Interactive Pipeline, Benchmarks, FAQ) |
| **Dashboard** | Basic widgets | **Modular Workspace** (RAG Studio, Document Vault, 3D Neural Galaxy, Bento Matrix, Engine Settings) |
| **3D Vector Visualization** | None | **Interactive WebGL Three.js Constellation** with OrbitControls & laser retrieval pulses |
| **Hardware Privacy** | Often requires cloud OpenAI keys | **100% Air-Gapped Local Inference** via Bionic / LM Studio (`http://localhost:1234/v1`) |
| **Model Offline Resilience** | Crashes on connection errors | **Adaptive Standby Synthesizer** (Instant semantic retrieval while GPU models initialize) |

---

## 🏗️ 5-Stage RAG Pipeline Architecture

```
[ Documents: PDF / DOCX / TXT / MD / CSV / JSON ]
                        │
                        ▼  Stage 1: Multi-Format Parsing
[ Clean Text Segments with Page & Section Metadata ]
                        │
                        ▼  Stage 2: Recursive Character Chunking
[ 600-Char Windows with 120-Char Overlap ]
                        │
                        ▼  Stage 3: 768-D Vector Embeddings
[ Nomic Embed v1.5 / Normalized Matrix ] ───► [ 3D PCA Projection & WebGL Render ]
                        │
                        ▼  Stage 4: Cosine Nearest-Neighbor Search
[ Top-K Ranked Context Chunks with Match Scores ]
                        │
                        ▼  Stage 5: Augmented Generation & SSE Streaming
[ Bionic / LM Studio Local GPU (http://localhost:1234/v1) ]
                        │
                        ▼
[ Real-Time Typewriter Output with Interactive Citations ]
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- [LM Studio / Bionic](https://lmstudio.ai/) running locally on port `1234` with an embedding model (`text-embedding-nomic-embed-text-v1.5`) and chat model (e.g. `qwen/qwen3.5-9b` or `google/gemma-4-e2b`).

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/pranav-6944/ContextOS.git
cd ContextOS

# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies and build SPA
cd frontend
npm install
npm run build
cd ..
```

### 3. Launch ContextOS
```bash
python run.py
```
Open your browser to:
👉 **[http://localhost:8000](http://localhost:8000)**

*(For active frontend development with hot-reloading: run `npm run dev` inside `frontend/` and navigate to `http://localhost:5173`)*.

---

## 🖥️ Platform Tour

### 1. Multi-Section Landing Page
- **Hero Section**: Display headline, 3D interactive neural nucleus widget with mouse parallax, quick telemetry metrics, and primary CTA buttons.
- **Bento Grid Showcase**: 21st.dev inspired cards highlighting 3D Neural Constellation, 100% Air-Gapped Privacy, Multi-Format Vault, and Standby Engine.
- **Interactive 3D Pipeline**: Visual 5-stage pipeline flow with clickable stage payloads and mathematical descriptions.
- **Benchmarks & Compatibility**: Matrix comparing tested models (Qwen 3.5, Gemma 2B/4B, Qwen 12B) and architecture advantages.
- **Interactive FAQ**: Expandable accordions answering technical, hardware, and architectural queries.

### 2. Full Control Dashboard
- **RAG Studio (Chat)**: Real-time SSE streaming typewriter chat with quick-prompt chips, interactive citation pills, and telemetry badges.
- **Document Vault**: Multi-document drag-and-drop uploader supporting PDF, DOCX, TXT, MD, CSV, JSON, document table with deletion, and one-click sample knowledge preloader.
- **3D Neural Galaxy**: Fullscreen interactive WebGL vector space with manual orbit drag controls, document color coding, and laser targeting pulses on query retrieval.
- **Bento Vector Matrix**: High-density grid displaying all chunks, coordinate tags, word counts, and snippets.
- **Engine Settings**: Configurable local LLM endpoint URL, model selector, top-k slider, and temperature controls.

---

## 📁 Repository Structure

```
ContextOS/
├── backend/
│   ├── main.py              # FastAPI server, static mounting, SSE streaming
│   ├── config.py            # Environment settings and paths
│   ├── document_parser.py   # Multi-format parser (PDF, DOCX, TXT, MD, CSV, JSON)
│   ├── chunker.py           # Recursive chunker with overlap and metadata
│   ├── embeddings.py        # 768-D Bionic embeddings + PCA 3D projection
│   ├── vector_store.py      # Cosine similarity index & JSON persistence
│   └── llm_service.py       # OpenAI-compatible streaming client + Standby engine
├── frontend/                # Full React + Vite + Tailwind v4 Application
│   ├── src/
│   │   ├── components/      # Navbar, Footer, Hero3DCanvas, Galaxy3DCanvas, InspectorDrawer
│   │   ├── pages/           # LandingPage.jsx, Dashboard.jsx
│   │   ├── services/        # api.js client
│   │   ├── App.jsx          # Root view routing & status polling
│   │   └── index.css        # Tailwind v4 imports and 21st.dev design tokens
│   ├── package.json
│   └── vite.config.js       # Vite configuration with proxy to FastAPI (:8000)
├── sample_data/             # Preloaded whitepapers & knowledge bases
├── requirements.txt         # Backend Python dependencies
├── run.py                   # Single-command unified launcher script
├── AI_NOTES.md              # Project knowledge base & index
└── README.md                # Project documentation
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.

**Author**: [Pranav](https://github.com/pranav-6944)
