# ContextOS - AI Notes & Project Knowledge Base

## Project Overview
- **Name**: ContextOS (Tactile Skeuomorphic Console for Air-Gapped Document Intelligence)
- **Repository**: `https://github.com/pranav-6944/ContextOS`
- **Design Philosophy**: High-End Tactile Skeuomorphism (Strictly NO 3D WebGL / Particle bloat). Inspired by Braun audio equipment, NeXT workstations, Apple HIG golden-era tactile interfaces, analog precision laboratory consoles, and modular rackmount hardware.
- **Author**: Pranav (`pranav-6944`)

---

## Skeuomorphic Design System Principles (UI-UX-PRO-MAX Guidelines)
1. **Light & Directional Shadows**:
   - Primary virtual light source at consistent 135° (top-left).
   - Top-edge highlights: `inset 0 1px 0 rgba(255, 255, 255, 0.25)` and `border-t: 1px solid rgba(255, 255, 255, 0.2)`.
   - Bottom-edge deep shadows: `box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.9)`.
   - Inset debossed wells / recesses: `box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(0, 0, 0, 0.9), 0 1px 0 rgba(255, 255, 255, 0.08)`.
2. **Materials & Finishes**:
   - Anodized Dark Titanium & Gunmetal Slate (`#0b0e14`, `#12161f`, `#1b2230`).
   - Brushed Aluminum horizontal micro-gradients.
   - Glass-covered displays with subtle specular glares (`linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)`).
   - Illuminated jewel LEDs (`skeuo-diode-emerald`, `skeuo-diode-amber`, `skeuo-diode-ruby`, `skeuo-diode-cyan`).
   - Engraved brass & stainless steel screw rivets (`skeuo-screw`).
3. **Tactile Micro-Interactions**:
   - Mechanical push buttons: Physical 3D extrusion (`translate-y-0`) transitioning to pressed inset depth on `:active` (`translate-y-[2px]` with recessed shadow swap).
   - Rotary potentiometer knobs (`SkeuoKnob.jsx`) with tactile radial tick marks and angle scrubbing.
   - Rocker & toggle switches (`SkeuoSwitch.jsx`) with physical metallic toggle levers and dual-state illumination.
   - Analog needle VU meters (`SkeuoMeter.jsx`) with animated spring damping for Cosine Similarity and Signal Density dB.

---

## File Structure & Line Number References

### 1. Dedicated Pages (`frontend/src/pages/`)
- **`LandingPage.jsx`** (`frontend/src/pages/LandingPage.jsx`):
  - **Lines 1-60**: Pipeline stage definitions, case studies, and FAQ state.
  - **Lines 14-25**: Interactive Oscilloscope Calibrator state (`retrievalGain`, `windowBandwidth`, `tempHarmonic`).
  - **Lines 100-240**: SECTION 1 - Master Console Deck with dual VU meters, rotary dials, and rocker switches.
  - **Lines 245-320**: SECTION 2 - Modular Rackmount Bento Bay (6 hardware modules).
  - **Lines 325-390**: SECTION 3 - Patchbay Pipeline Workbench (interactive 5-stage transformation).
  - **Lines 395-425**: SECTION 4 - Laboratory Case Studies & Benchmarks.
  - **Lines 430-520**: SECTION 4B - Interactive Oscilloscope & Semantic Harmonic Calibrator with live SVG waveform.
  - **Lines 525-595**: SECTION 4C - Hardware Topology Benchmark Matrix (ContextOS Console vs Streamlit vs Cloud SaaS).
  - **Lines 600-665**: SECTION 4D - Chassis Rear IO & Physical Patch Matrix (Port 01-04 loopback topology).
  - **Lines 670-710**: SECTION 5 - Tactile Schematic FAQ Accordion.
  - **Lines 715-745**: SECTION 6 - Heavy Titanium Engagement Nameplate CTA.

- **`Dashboard.jsx`** (`frontend/src/pages/Dashboard.jsx`):
  - **Lines 1-25**: Skeuomorphic component imports (`SkeuoMeter`, `SkeuoKnob`, `SkeuoSwitch`).
  - **Lines 140-165**: SSE citations listener updating live `vuCosineLevel` and `vuDecibelLevel` to twitch analog needles.
  - **Lines 280-305**: Sidebar selector buttons for RAG Studio, Document Vault, VU Spectrum Analyzer, Vector Matrix, Settings.
  - **Lines 525-660**: TAB 3 - Vector VU Spectrum & Signal Analyzer: Dual Galvanometer VU bridge, CRT vector radar projection scope with active target crosshairs, and calibration knobs.

- **`AuthPage.jsx`** (`frontend/src/pages/AuthPage.jsx`):
  - **Lines 1-190**: Operator Clearance Terminal, biometric fingerprint touch plate, tactile 12-key numeric PIN pad, and security clearance badge.

- **`TermsPage.jsx`** (`frontend/src/pages/TermsPage.jsx`):
  - **Lines 1-140**: Stamped Industrial Specification & Terms Plate, air-gapped local compute clause, zero-cloud liability, MIT license.

- **`CookiesPage.jsx`** (`frontend/src/pages/CookiesPage.jsx`):
  - **Lines 1-135**: Storage & Cookie Manifest, zero 3rd-party tracking guarantee, LocalStorage allocation table, "PURGE STORAGE" hardware button.

- **`PrivacyPage.jsx`** (`frontend/src/pages/PrivacyPage.jsx`):
  - **Lines 1-150**: Air-Gap Security Certificate, 0 telemetry outbound network isolation, local ephemeral indexing.

- **`DocsPage.jsx`** (`frontend/src/pages/DocsPage.jsx`):
  - **Lines 1-180**: Technical Manual, Bionic LM Studio setup walkthrough, and full REST API endpoint matrix.

### 2. Skeuomorphic Hardware Component Library (`frontend/src/components/`)
- **`SkeuoKnob.jsx`** (`frontend/src/components/SkeuoKnob.jsx`):
  - Interactive rotary potentiometer dial with drag/scrubbing support, knurled metallic rim, and angular notch indicator.
- **`SkeuoMeter.jsx`** (`frontend/src/components/SkeuoMeter.jsx`):
  - Analog needle galvanometer VU meter with brushed aluminum faceplate, curved arc scale, specular glass reflection, and smooth transition physics.
- **`SkeuoSwitch.jsx`** (`frontend/src/components/SkeuoSwitch.jsx`):
  - Tactile rocker toggle switch with debossed bezel, metallic toggle lever, and colored jewel LED indicator diode.
- **`Navbar.jsx`** (`frontend/src/components/Navbar.jsx`):
  - Machined titanium header with `/logo.svg`, selector switches for Deck, Console, Schematics, Clearance, and Bionic jewel diode.
- **`Footer.jsx`** (`frontend/src/components/Footer.jsx`):
  - Machined console backplate with 4 corner screw rivets, categorized links (Architecture, Governance, Local Infrastructure, GitHub repo).

### 3. Application State & Entry (`frontend/src/App.jsx`)
- **`App.jsx`** (`frontend/src/App.jsx`):
  - State `currentView`: `'landing'` | `'dashboard'` | `'auth'` | `'terms'` | `'cookies'` | `'privacy'` | `'docs'`.
  - Automatic `window.scrollTo({ top: 0, behavior: 'smooth' })` on page transition.
  - Automatic 8-second polling of `/api/status` for Bionic GPU and document store statistics.

### 4. Backend Engine (`backend/`)
- **`backend/main.py`**:
  - FastAPI server serving API endpoints and mounting `frontend/dist` as static files for single-command deployment.
- **`backend/store.py`**:
  - In-memory dense vector storage with 768-D vectors, cosine similarity ranking, and 3D coordinate projection.
- **`backend/bionic_client.py`**:
  - SSE streaming connection to local LM Studio / Bionic (`http://localhost:1234/v1`) with Adaptive Standby Synthesizer fallback.
- **`run.py`**:
  - Unified launch script starting Uvicorn server on `http://127.0.0.1:8000`.

---

## Important Keywords & Concepts
- `skeuo-chassis`: Machined dark titanium/slate panel with 135° directional lighting and bevel.
- `skeuo-inset`: Debossed recessed tray with inset dark shadows and bottom edge highlight.
- `skeuo-screen`: CRT phosphor monitor finish with subtle scanlines and inner glass glow.
- `skeuo-btn` & `skeuo-btn-primary`: Tactile mechanical push buttons with realistic physical depth on active press.
- `skeuo-screw`: Precision screw rivet with slotted head.
- `skeuo-diode-*`: Realistic illuminated jewel diode with glow bloom.
- `768-D Vector Bus`: IEEE 754 dense vector embeddings normalized to unit length (||v|| = 1.0).
- `Air-Gap Security`: 100% offline compute guarantee with 0 outbound cloud telemetry.
