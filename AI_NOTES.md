# ContextOS - AI Notes & Project Knowledge Base

## Project Overview
- **Name**: ContextOS (Next-Gen 3D Animated RAG Operating System)
- **Repository**: `https://github.com/pranav-6944/ContextOS`
- **Objective**: Full-stack multi-page platform with rich landing pages and comprehensive interactive dashboard, powered by local LLMs via LM Studio / Bionic (`http://localhost:1234/v1`), featuring an immersive 3D interactive WebGL interface (React + Vite + Tailwind CSS v4 + Three.js + Lucide Icons).
- **Author**: Pranav (`pranav-6944`)

---

## Technical Stack & Ports
- **Frontend Framework**: React 19 + Vite 6 + Tailwind CSS v4 + Lucide React + Three.js WebGL
- **Backend Framework**: Python 3.13 + FastAPI + Uvicorn + Pydantic + PyPDF + python-docx + NumPy / Scikit-learn
- **Local LLM Endpoint**: `http://localhost:1234/v1` (LM Studio / Bionic)
  - Embedding Model: `text-embedding-nomic-embed-text-v1.5` (768 dimensions)
  - Chat Models: `qwen/qwen3.5-9b`, `google/gemma-4-e2b`, `qwen3.6-12b-iq`
- **Ports & Dev URLs**:
  - Unified App: `http://localhost:8000` (FastAPI serves production-grade React build from `frontend/dist` + API routes)
  - Frontend Dev Server: `http://localhost:5173` (Vite dev server with `/api` proxy to `:8000`)
- **Git Remote**: `https://github.com/pranav-6944/ContextOS.git` (branch: `main`)

---

## Architecture & File Index

### Frontend Modules (`frontend/src/`)
- `App.jsx`: Root router managing view state (`landing` vs `dashboard`), polling system status every 8s.
- `components/Navbar.jsx`: Sticky glassmorphic navbar with view switcher, Bionic status pill, and GitHub link.
- `components/Footer.jsx`: Multi-column footer with platform links, tech stack badges, and college project attribution.
- `components/Hero3DCanvas.jsx`: Interactive Three.js 3D Neural Nucleus with mouse parallax, 600 particles, and glowing orbital rings.
- `components/Galaxy3DCanvas.jsx`: Interactive 3D vector space with manual orbit drag controls, node clustering by document, and laser targeting pulses on query retrieval.
- `components/InspectorDrawer.jsx`: Slide-out panel displaying source document name, match percentage, 3D PCA coordinates, word metrics, and raw text payload.
- `pages/LandingPage.jsx`:
  - Section 1: Hero with display typography, 3D canvas widget, and stats counters.
  - Section 2: 21st.dev Bento Grid showcasing 3D Neural Constellation, 100% Air-Gapped Privacy, Multi-Format Vault, and Standby Engine.
  - Section 3: Interactive 5-stage RAG execution pipeline with clickable stage payloads.
  - Section 4: Benchmarks & compatibility matrix (ContextOS vs Streamlit vs Cloud SaaS).
  - Section 5: Interactive FAQ accordion.
  - Section 6: Bottom Call-To-Action banner.
- `pages/Dashboard.jsx`:
  - Tab 1: **RAG Studio (Chat)** with suggestion chips, SSE typewriter streaming, citation badges, and telemetry tags.
  - Tab 2: **Document Vault** with drag-and-drop dropzone, sample preloader, document management table, and delete actions.
  - Tab 3: **3D Neural Galaxy** fullscreen vector visualizer.
  - Tab 4: **Bento Vector Matrix** showcasing all stored chunks with coordinate tags.
  - Tab 5: **Engine Settings** with model selector, Top-K slider, temperature slider, and persistent configuration.
- `services/api.js`: Centralized REST & SSE client for FastAPI endpoints.

### Backend Modules (`backend/`)
- `main.py`: FastAPI server with CORS, SSE streaming, static mounting for `frontend/dist`.
- `config.py`: Configuration constants, directories (`data/`, `uploads/`, `sample_data/`).
- `document_parser.py`: Multi-format extractor for PDF, DOCX, TXT, MD, CSV, JSON.
- `chunker.py`: Recursive character chunker with overlap and metadata tracking.
- `embeddings.py`: 768-D Bionic embeddings + PCA 3D spatial projection.
- `vector_store.py`: In-memory NumPy cosine similarity index with JSON disk persistence.
- `llm_service.py`: OpenAI-compatible streaming client for Bionic with adaptive standby synthesis.

---

## Verification & Deployment
- Tested `npm run build` in `frontend/`: Compiled cleanly in 780ms (`dist/index.html`, `dist/assets/`).
- FastAPI mounts `frontend/dist` and serves both the React SPA and API on `http://127.0.0.1:8000`.
- Verified live status endpoint: 3 documents indexed, 44 chunks, 768-D vectors.
- Git remote: `https://github.com/pranav-6944/ContextOS.git` on branch `main`.
