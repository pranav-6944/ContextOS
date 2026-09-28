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

## Official Brand Assets & Favicons
- **`Horizontal_stack_logo.png`**:
  - Primary horizontal brand emblem & typography.
  - Used in: `Navbar.jsx` (brand header), `Footer.jsx` (backplate brand), `Dashboard.jsx` (sidebar header), `LandingPage.jsx` (workstation console bar), and `DocsPage.jsx` (manual header).
- **`Vertical_stack_logo.png`**:
  - Stamped vertical emblem badge.
  - Used in: `AuthPage.jsx` (security gate clearance badge), `LandingPage.jsx` (Section 16 Final CTA ignition station).
- **`favicon_io/` Assets (Copied to `frontend/public/` & Linked in `frontend/index.html`)**:
  - `favicon.ico` (multi-resolution master favicon)
  - `favicon-32x32.png`, `favicon-16x16.png` (standard browser tabs)
  - `apple-touch-icon.png` (iOS / macOS touch icon)
  - `android-chrome-192x192.png`, `android-chrome-512x512.png` (PWA chrome launcher icons)
  - `site.webmanifest` (PWA web app manifest)

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
- **`AuthPage.jsx`**: Biometric thumbprint scanner plate, 12-key numeric PIN keypad, security clearance terminal with local validation, sound effects, and persistent clearance state (`contextos_authenticated`).
- **`TermsPage.jsx`**: Stamped industrial terms, air-gapped compute license, MIT open source agreement.
- **`CookiesPage.jsx`**: Zero 3rd-party cookie manifest, storage allocation table, tactile storage purge.
- **`PrivacyPage.jsx`**: Stamped Air-Gap Security Certificate with 0 outbound network policy.
- **`DocsPage.jsx`**: Hardware technical manual, Bionic LM Studio connection guide, REST API matrix.
- **`Dashboard.jsx`**: Full workstation mainframe instrument panel with:
  - **Skeuomorphic Workstation Chassis**: Machined metal finish (`.skeuo-chassis`), recessed bezels (`.skeuo-inset`), screw rivets, tactile button keycaps with glowing status diodes.
  - **Authentication Interlock Gating**:
    - Only logged-in operators can query the local RAG inference bus or transmit prompts.
    - If unauthenticated, displays heavy steel security interlock gate plate with clear access restricted warning, locked query input bar (`[LOCKED]`), and direct action to authenticate.
    - If authenticated (`LVL-4 ACTIVE`), unlocks full RAG Studio, real-time SSE token streaming, and document ingestion.
  - **Live VU Meter Bridge**: Embedded Dual Galvanometer VU Meters directly on the RAG Studio chat deck displaying real-time needle deflection for Cosine Proximity and Signal Density dB.
  - **VU Spectrum Analyzer & 2D CRT Radar**:
    - Resolved missing icon imports (`Sliders`, `SlidersHorizontal`, `Volume2`, `BarChart2`).
    - Fixed document filter attribute mapping (`d.doc_name` & `d.chunk_count`).
    - Added 10 pre-computed fallback 768-D semantic vector nodes so the radar displays rich interactive nodes and never renders blank even prior to file uploads.
    - 10-Band Graphic Spectrum Equalizer displaying real-time frequency distribution (`32Hz` to `16kHz`) with dancing LED bars.
    - 2D CRT vector projection radar with rotating sweep beam, range rings, and hover inspection cards.
    - Tactile rotary potentiometers (`SkeuoKnob`) for Zoom Magnification (0.5x to 2.5x) and Proximity Threshold.
  - **Document Vault**: Physical file cabinet motif with realistic paper document cards (`paper-card`), fiber warmth, folded corners, and drop-down ingestion hopper.
  - **Bento Vector Matrix**: Memory cartridge grid displaying dense 768-D vector coordinates and word counts.
  - **Engine Settings**: Industrial rack-mount control panel with rotary dials and toggle switches.

---

## Key File Locations & Line References
- **`README.md` (Lines 1-3)**: Official Vertical Stack Logo (`Vertical_stack_logo.png`) embedded at the top of the README.
- **`frontend/src/App.jsx` (Lines 18-35)**: Persistent authentication state (`contextos_authenticated`, `contextos_operator`) and logout/login dispatcher passed to Navbar, AuthPage, and Dashboard.
- **`frontend/src/components/Navbar.jsx` (Lines 60-128)**: Clearance status badge (`[CLEARANCE: LVL-4 // ACTIVE]` / `[CLEARANCE: LOCKED]`) and one-click Terminal Lock button.
- **`frontend/src/pages/AuthPage.jsx` (Lines 1-250)**: Mechanical PIN pad, optical biometric thumbprint scanner with sound effects, and persistent credential validation.
- **`frontend/src/pages/Dashboard.jsx` (Lines 1-720)**: Complete skeuomorphic workstation console, security lockout gate plate, dual galvanometer VU meter bridge, 10-band graphic equalizer, and 2D CRT vector radar.
- **`frontend/src/components/InspectorDrawer.jsx` (Lines 1-110)**: Grounding inspection drawer with `.skeuo-chassis`, `.skeuo-inset`, and `.skeuo-screen` styling.
- **`frontend/src/utils/soundEffects.js` (Lines 145-149)**: Web Audio synthesized acoustic sound manager exported as both `sounds` and `soundManager`.
