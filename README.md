# ContextOS 🎛️
### The Tactile Skeuomorphic Operating Console for Air-Gapped Local RAG

[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Bionic LLM](https://img.shields.io/badge/Bionic_LLM-Local_GPU-00F0FF.svg?style=flat)](http://localhost:1234/v1)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> ContextOS is an analog precision, skeuomorphic document intelligence console powered by strictly local LLMs via Bionic & LM Studio. Designed with tactile hardware chassis aesthetics—anodized titanium, rotary potentiometers, galvanometer VU meters, rocker switches, and CRT vector radars. Zero cloud dependencies, 100% private.

---

## 🌟 Architectural Differentiation

| Evaluation Metric | Standard College Streamlit App | **ContextOS Skeuomorphic Console** | Cloud SaaS (OpenAI / AWS) |
| :--- | :--- | :--- | :--- |
| **Interface Design** | Basic flat Python forms | **Skeuomorphic Hardware Deck** (Braun / Dieter Rams aesthetic, 135° directional lighting, debossed insets, jewel LEDs) | Generic flat web SaaS |
| **Tactile Components** | Plain sliders & dropdowns | **Physical Rotary Potentiometers, Rocker Switches & Analog VU Meters** | Standard HTML inputs |
| **Dedicated Pages** | 1 single linear page | **7 Dedicated Hardware Pages** (Console Deck, Mainframe Dashboard, Operator Clearance, Terms Plate, Storage Manifest, Privacy Guarantee, Technical Manual) | Complex multi-tenant portal |
| **Vector Inspection** | Hidden or basic tables | **CRT 2D Vector Projection Radar & VU Spectrum Analyzer** | Black-box embedding API |
| **Data Privacy** | Often temp files or cloud keys | **100% Air-Gapped Local Inference** (0 Outbound WAN packets) | Documents sent to remote servers |
| **Offline Resilience** | Crashes on connection loss | **Adaptive Standby Synthesizer** (Never crashes; instant semantic retrieval) | Fails on internet interruption |
| **Recurring Cost** | $0.00 or API charges | **$0.00 Forever** (Runs on local GPU / CPU) | High per-token billing |

---

## 🎛️ Dedicated Hardware Pages

ContextOS provides 7 dedicated pages accessible from the machined console header and chassis backplate:

1. **Console Deck (`/` - Landing)**:
   - **Hero Master Console**: Dual animated Galvanometer VU meters, rotary dial potentiometers, physical rocker switches, and real-time Bionic link diode.
   - **Modular Bento Rackmount Bay**: 6 hardware modules with status indicators.
   - **Patchbay Pipeline Workbench**: Interactive 5-stage physical signal transformation.
   - **Oscilloscope & Semantic Harmonic Calibrator**: Real-time twistable knobs modulating an animated SVG semantic waveform.
   - **Hardware Topology Benchmark Matrix**: Side-by-side technical evaluation against Streamlit and Cloud SaaS.
   - **Chassis Rear IO & Patch Matrix**: Visualizing ports 01-04 (Bionic Bus, FastAPI Socket, Vector DMA Bus, Air-Gap Isolator).
   - **Tactile Operator FAQ Accordion**: Expandable hardware inquiries.
   - **Heavy Titanium Engagement Nameplate**: Direct launch CTA.

2. **Hardware Console (`/dashboard`)**:
   - **RAG Studio Terminal**: CRT phosphor screen, streaming typewriter output, and interactive citation badges.
   - **Document Vault**: Multi-document ingestion bin with deletion, chunk count, and preloaded sample laboratory notes.
   - **Vector VU Spectrum & Signal Analyzer**: Dual analog galvanometer meters (Cosine Coherence & Signal Density dB) and 2D CRT radar projection scope with active target crosshairs.
   - **Dense Vector Matrix**: Bento card grid displaying all 768-D chunks with coordinates and word count.
   - **Engine Settings**: Mechanical knobs and sliders for top-k, temperature, and local model selection.

3. **Operator Clearance Terminal (`/auth`)**:
   - Stamped clearance station featuring biometric fingerprint touch scanner, 12-key numeric PIN pad, and security clearance badge.

4. **Industrial Specifications & Terms (`/terms`)**:
   - Stamped industrial specification plate covering air-gapped local compute terms, zero cloud liability, and MIT licensing.

5. **Storage & Cookie Manifest (`/cookies`)**:
   - Complete storage manifest demonstrating 0 third-party tracking cookies, LocalStorage allocation breakdown, and hardware cache purge button.

6. **Air-Gap Privacy Guarantee (`/privacy`)**:
   - Stamped air-gap security certificate detailing 0 telemetry network isolation and local ephemeral memory policies.

7. **Technical Manual & Schematics (`/docs`)**:
   - System schematics, local Bionic / LM Studio connection guide, and complete REST API endpoint matrix.

---

## 🏗️ 5-Stage RAG Pipeline Architecture

```
[ Ingestion Intake: PDF / DOCX / TXT / MD / CSV / JSON ]
                         │
                         ▼  Stage 1: Multi-Format Parser
[ Clean Text Streams with Page & Section Metadata ]
                         │
                         ▼  Stage 2: Recursive Window Splitter
[ 600-Char Windows with 120-Char Overlap ]
                         │
                         ▼  Stage 3: 768-D Vector Encoder
[ Nomic Embed v1.5 / Normalized Matrix ] ───► [ 2D Radar Projection & VU Meters ]
                         │
                         ▼  Stage 4: Cosine Distance Search
[ Nearest-Neighbor Dot-Product Ranking ]
                         │
                         ▼  Stage 5: Local GPU Inference & SSE Stream
[ Bionic / LM Studio Local Engine (http://localhost:1234/v1) ]
                         │
                         ▼
[ Real-Time Phosphor CRT Output + Clickable Source Citations ]
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

# Install frontend dependencies and compile production build
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

---

## 📜 License
Released under the [MIT License](LICENSE). Architected by Pranav for the AGAI Lab Project Showcase.
