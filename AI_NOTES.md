# ContextOS - AI Notes & Project Knowledge Base

## Project Overview
- **Name**: ContextOS (The Physical Machine for Exploring & Reasoning Over Knowledge)
- **Repository**: `https://github.com/pranav-6944/ContextOS`
- **Design Philosophy**: Modern Digital Skeuomorphism & Laboratory Workstation Metaphor.
  - "Modern AI laboratory × futuristic workstation × digital skeuomorphism × 3D data visualization"
  - Physical document folders, realistic paper cards with depth & folded corners, file cabinet drawer interaction, mechanical keyboard interactions, control-panel knobs & dials, 3D spatial knowledge maps, magnetic context stacking, and subtle Web Audio synthesized mechanical UI sounds.
- **Author**: Pranav (`pranav-6944`)

---

## 17 Landing Page Sections Architecture (`frontend/src/pages/LandingPage.jsx`)
1. **Hero — Local Intelligence, Your Context**:
   - Workstation desktop viewport, central glowing "Context Core" apparatus with concentric rotating magnetic containment rings (`core-spin-slow`, `core-spin-reverse`).
   - Pinned sticky notes with pushpin shadows.
   - Mechanical keyboard command chips (`mechanical-key` with 3D profile & active travel).
   - Audio sound-effects toggle (🔊 Mechanical sound FX via Web Audio API).
2. **Live RAG Pipeline**:
   - 5-stage physical signal conveyor / patchbay (Intake ➔ Cleaver ➔ 768-D Encoder ➔ Cosine Matcher ➔ Synthesis).
3. **How ContextOS Works**:
   - Layered desktop workstation windows with macOS/NeXT-style rivet buttons demonstrating modular internal pipelines.
4. **Knowledge Ingestion**:
   - 3 physical pull-out cabinet drawers (`Academic`, `Security`, `Financial`).
   - Paper-like document cards (`paper-card`) with realistic drop shadows, fiber warmth, and folded corners.
5. **Semantic Retrieval**:
   - Magnifying-glass vector inspector focusing on individual chunk cards with real-time cosine proximity gauges.
6. **Context Assembly**:
   - Stacked physical context layers with magnetic snapping interaction and visual token budget fill gauge.
7. **Local LLM Generation**:
   - Phosphor CRT terminal screen with real-time typewriter token streaming, rotary temperature dial, and token rate meter.
8. **Interactive 3D Knowledge Space**:
   - Embedded Three.js 3D spatial knowledge map (`Interactive3DKnowledgeMap.jsx`) with raycasting, hover HUD, orbit speed and spatial spread controls.
9. **Source & Citation Explorer**:
   - Manila folder tabs (`folder-tab`) with pinned sticky notes, exact source excerpt clips, and grounded confidence badges.
10. **RAG Performance / Evaluation**:
    - Tactile laboratory instrument bench with dual analog needle meters (`SkeuoMeter`), latency chronometers, and hit-rate indicators.
11. **Privacy & Local-First AI**:
    - Physical air-gap isolation knife-switch / breaker toggle (`SkeuoSwitch`), blinking disk storage LEDs, zero-cloud security seal.
12. **Supported Documents & Models**:
    - Physical cartridge slots for PDF, DOCX, TXT, CSV, JSON; and hot-swappable local models (Qwen 3.5, Gemma 2B/4B, Llama 3).
13. **Technical Architecture**:
    - Dark grid blueprint schematic detailing the 127.0.0.1:1234 Bionic loopback bus and FastAPI socket.
14. **Interactive Demo**:
    - Live hands-on mini workbench right on the landing page! Query selector buttons, live needle deflection, and typewriter answer streaming.
15. **Developer / Open Source**:
    - Mechanical terminal code card with physical copy button and CLI installation keys.
16. **Final CTA — Build With Your Context**:
    - Workstation console ignition switch with primary "ENGAGE CONSOLE NOW" action.
17. **Footer**:
    - Laboratory workstation backplate with corner screws, status diodes, page routing links, and serial stamp.

---

## Hardware Component Library (`frontend/src/`)
- **`frontend/src/utils/soundEffects.js`**:
  - Web Audio API synthesized mechanical sound generator (zero external assets). Crisp mechanical keyclicks, heavy switch thunks, rotary ratchet ticks, and paper rustle noise.
- **`frontend/src/components/Interactive3DKnowledgeMap.jsx`**:
  - Three.js 3D spatial knowledge map with raycasting, interactive node targeting, polar grid rings, and HUD telemetry.
- **`frontend/src/components/SkeuoMeter.jsx`**:
  - Analog needle galvanometer VU meter with spring damping for Cosine Similarity and Signal Density dB.
- **`frontend/src/components/SkeuoKnob.jsx`**:
  - Rotary potentiometer dial with angular notch indicator and drag scrubbing.
- **`frontend/src/components/SkeuoSwitch.jsx`**:
  - Rocker toggle switch with mechanical lever and diode illumination.
- **`frontend/src/components/Navbar.jsx`**:
  - Titanium workstation header console with vector logo, route selector keys, and link diodes.
- **`frontend/src/components/Footer.jsx`**:
  - Machined console chassis backplate with compliance, legal, architecture, and GitHub links.

---

## Dedicated Pages
- **`AuthPage.jsx`**: Biometric thumbprint scanner plate, 12-key numeric PIN keypad, security clearance terminal.
- **`TermsPage.jsx`**: Stamped industrial terms, air-gapped compute license, MIT open source agreement.
- **`CookiesPage.jsx`**: Zero 3rd-party cookie manifest, storage allocation table, tactile storage purge.
- **`PrivacyPage.jsx`**: Stamped Air-Gap Security Certificate with 0 outbound network policy.
- **`DocsPage.jsx`**: Hardware technical manual, Bionic LM Studio connection guide, REST API matrix.
- **`Dashboard.jsx`**: Full workstation mainframe instrument panel with CRT RAG terminal, Document Vault, VU Spectrum Analyzer, and Dense Vector Matrix.
