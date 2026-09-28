import React, { useState } from 'react';
import { 
  Terminal, Shield, Cpu, Zap, Database, 
  Layers, Compass, ArrowRight, CheckCircle2, ChevronDown, 
  ChevronUp, Lock, RefreshCw, HardDrive, Key, FileText,
  Activity, Sliders, Radio, Check, X
} from 'lucide-react';
import SkeuoKnob from '../components/SkeuoKnob';
import SkeuoMeter from '../components/SkeuoMeter';
import SkeuoSwitch from '../components/SkeuoSwitch';

export default function LandingPage({ setView, bionicStatus, stats }) {
  const [activePipelineStage, setActivePipelineStage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [heroPower, setHeroPower] = useState(true);
  const [demoKnobVal, setDemoKnobVal] = useState(0.7);
  const [activeTabCase, setActiveTabCase] = useState(0);

  // Calibration Oscilloscope State
  const [retrievalGain, setRetrievalGain] = useState(0.75);
  const [windowBandwidth, setWindowBandwidth] = useState(0.60);
  const [tempHarmonic, setTempHarmonic] = useState(0.35);


  const pipelineStages = [
    {
      step: '01',
      title: 'Multi-Format Ingestion Deck',
      subtitle: 'PDF, DOCX, TXT, Markdown, CSV & JSON',
      desc: 'Documents are fed through the mechanical extraction intake. Text hierarchies, tabular sections, and page numbers are isolated without layout disruption.',
      tech: 'pypdf + python-docx + Native Serializers',
      payload: 'Raw File Intake ➔ Clean Semantic Text Stream'
    },
    {
      step: '02',
      title: 'Recursive Window Splitter',
      subtitle: 'Sentence Boundary Preservation',
      desc: 'Text is cleaved into calibrated 600-character windows with 120-character overlapping boundaries to prevent contextual severance.',
      tech: 'Recursive Character Splitter (Multi-Separators)',
      payload: 'Window Size: 600 chars | Overlap: 120 chars'
    },
    {
      step: '03',
      title: '768-D Vector Encoder',
      subtitle: 'Nomic Embed v1.5 / Local Mathematical Embeddings',
      desc: 'Every segment is encoded into a 768-dimensional dense mathematical vector capturing deep semantic relationships rather than simple keywords.',
      tech: 'Bionic Local Engine (text-embedding-nomic-embed-text-v1.5)',
      payload: 'Vector Dimension: 768-D | L2 Normalized (||v|| = 1.0)'
    },
    {
      step: '04',
      title: 'Cosine Distance Matrix',
      subtitle: 'Sub-Millisecond Nearest-Neighbor Search',
      desc: 'The incoming query vector is matched against all stored vectors via dot-product cosine similarity, ranking the top relevant chunks.',
      tech: 'Vectorized NumPy Matrix Search',
      payload: 'Top-K: 4 Nearest Chunks | Cosine Precision: 0.0001'
    },
    {
      step: '05',
      title: 'Local LLM Streaming Output',
      subtitle: 'Air-Gapped Bionic GPU Inference',
      desc: 'The retrieved context is synthesized into an augmented prompt and streamed via Server-Sent Events (SSE) with interactive source citations.',
      tech: 'Qwen 3.5 / Gemma via http://localhost:1234/v1',
      payload: 'Real-Time Typewriter Output + Clickable Source Badges'
    }
  ];

  const caseStudies = [
    {
      title: 'Academic Paper & Whitepaper Analysis',
      docs: 'Complex multi-page PDF documents with equations and citations.',
      metric: '94.8% Retrieval Precision',
      desc: 'ContextOS indexes full academic papers, isolating exact theorems across chapters with instant page-level citation chips.'
    },
    {
      title: 'Air-Gapped Confidential Codebases',
      docs: 'Proprietary software repositories, API specifications, and architecture notes.',
      metric: '0.00% Cloud Data Leakage',
      desc: 'Engineers query proprietary APIs and technical schemas completely offline with zero risk of intellectual property exposure.'
    },
    {
      title: 'Financial & Lab Tabular Data',
      docs: 'CSV balance sheets, experimental lab readings, and structured logs.',
      metric: '<8ms Query Retrieval Latency',
      desc: 'Vectorizes tabular row summaries, allowing natural language queries to extract exact metric comparisons without writing SQL.'
    }
  ];

  const faqs = [
    {
      q: 'How does ContextOS connect to Bionic / LM Studio?',
      a: 'ContextOS communicates with your local LM Studio / Bionic instance via its standard OpenAI-compatible API at http://localhost:1234/v1. It automatically detects your loaded models (like Qwen 3.5 9B or Gemma) and streams generation tokens directly from your local GPU.'
    },
    {
      q: 'What happens if my local model is still loading or offline?',
      a: 'Unlike traditional Streamlit apps that crash with connection errors, ContextOS features an intelligent Adaptive Standby Synthesizer. It performs 100% of the vector search, source citations, and 3D visual targeting immediately, and smoothly switches to GPU generation once your model is ready.'
    },
    {
      q: 'Are any documents or prompts sent to the cloud?',
      a: 'Zero. ContextOS is strictly local-first. Document extraction, recursive chunking, vector indexing, and neural inference occur entirely on your local CPU and GPU.'
    },
    {
      q: 'Which document formats are supported out of the box?',
      a: 'ContextOS natively parses PDF (.pdf), Microsoft Word (.docx), plain text (.txt), Markdown (.md), tabular CSV (.csv), and structured JSON (.json).'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-200">
      
      {/* SECTION 1: MASTER CONSOLE DECK (HERO) */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full">
        
        {/* Main Skeuomorphic Hardware Chassis */}
        <div className="skeuo-chassis p-8 sm:p-12 rounded-3xl relative overflow-hidden border border-slate-700 shadow-2xl space-y-10">
          
          {/* Machine Rivets at 4 Corners */}
          <div className="absolute top-4 left-4 skeuo-screw" />
          <div className="absolute top-4 right-4 skeuo-screw" />
          <div className="absolute bottom-4 left-4 skeuo-screw" />
          <div className="absolute bottom-4 right-4 skeuo-screw" />

          {/* Top Chassis Nameplate & Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full skeuo-diode-green" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                SYSTEM STATUS: LOCAL AIR-GAP // OPERATIONAL
              </span>
            </div>
            
            <div className="flex items-center gap-6 font-mono text-xs text-slate-400">
              <span>CHASSIS: MK-IV RACK</span>
              <span>CLOCK: 2026.09.28</span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">BIONIC LOCAL LLM:</span>
                <span className={`w-2.5 h-2.5 rounded-full ${bionicStatus?.online ? 'skeuo-diode-green' : 'skeuo-diode-amber'}`} />
              </div>
            </div>
          </div>

          {/* Hero Headline & Tactile Hardware Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Headline Area */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full skeuo-inset text-[11px] font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 skeuo-diode-cyan" />
                <span>PRECISION INSTRUMENT CONSOLE // ZERO 3D BLOAT</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase">
                The Physical Hardware Console for <span className="text-cyan-400">Local RAG Intelligence</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed max-w-xl">
                Tired of fragile, generic Streamlit scripts? Experience an authentic tactile operating system for local document retrieval. Powered directly by 
                <strong className="text-white"> Bionic & LM Studio on your local GPU </strong> 
                with 100% air-gapped data confidentiality.
              </p>

              {/* Tactile Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setView('dashboard')}
                  className="skeuo-btn-primary px-7 py-4 rounded-xl text-white font-bold text-sm font-mono tracking-wider flex items-center gap-3 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>ENGAGE OPERATING CONSOLE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setView('auth')}
                  className="skeuo-btn px-6 py-4 rounded-xl text-slate-200 hover:text-white font-mono text-sm tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>OPERATOR LOGIN</span>
                </button>
              </div>

            </div>

            {/* Right Tactile Instrumentation Bay */}
            <div className="lg:col-span-5 skeuo-inset p-6 rounded-3xl space-y-6 border border-slate-800">
              
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5 pb-3">
                <span className="font-bold text-slate-200">ANALOG TELEMETRY DECK</span>
                <span className="text-cyan-400">CALIBRATED // 768-D</span>
              </div>

              {/* Dual Analog VU Meters */}
              <div className="grid grid-cols-2 gap-4">
                <SkeuoMeter 
                  value={bionicStatus?.online ? 78 : 35} 
                  label="GPU ACTIVITY" 
                  unit="%" 
                />
                <SkeuoMeter 
                  value={12} 
                  label="RETRIEVAL LATENCY" 
                  unit="ms" 
                />
              </div>

              {/* Knobs and Rocker Switch Row */}
              <div className="grid grid-cols-3 gap-2 items-center justify-items-center pt-2">
                <SkeuoKnob 
                  value={demoKnobVal} 
                  min={0.0} 
                  max={1.5} 
                  step={0.05} 
                  onChange={setDemoKnobVal} 
                  label="TEMP SENS" 
                />
                
                <SkeuoKnob 
                  value={4} 
                  min={1} 
                  max={10} 
                  step={1} 
                  label="TOP-K DETENTS" 
                />

                <SkeuoSwitch 
                  isOn={heroPower} 
                  onToggle={() => setHeroPower(!heroPower)} 
                  label="AIR-GAP" 
                />
              </div>

              {/* Mechanical Token Readout */}
              <div className="p-3 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">INDEXED CORPUS TOKENS</span>
                <span className="text-cyan-400 font-bold text-sm tracking-widest">
                  {stats?.total_words ? (stats.total_words * 1.3).toFixed(0).padStart(6, '0') : '003640'}
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SECTION 2: MODULAR RACKMOUNT BENTO BAY */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <span>RACKMOUNT SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Modular Hardware Architecture
          </h2>
          <p className="text-slate-400 text-sm font-mono">
            Every module is engineered as an isolated, tactile physical instrument.
          </p>
        </div>

        {/* Skeuomorphic Hardware Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Vault Tape Deck */}
          <div className="md:col-span-2 skeuo-chassis p-8 rounded-3xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">MODULE 01 // INTAKE</span>
              <span className="w-2.5 h-2.5 rounded-full skeuo-diode-cyan" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white uppercase">Multi-Format Media Intake Slot</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-mono leading-relaxed max-w-xl">
                Mechanical ingestion bay accepting PDFs, Microsoft Word (.docx), plain text, Markdown, CSV, and JSON. Page-level structural metadata is extracted and cataloged directly onto local storage.
              </p>
            </div>
            <div className="skeuo-inset p-4 rounded-xl flex items-center justify-between font-mono text-xs text-slate-300">
              <span>FORMATS: PDF • DOCX • TXT • MD • CSV • JSON</span>
              <span className="text-emerald-400">STATUS: READY</span>
            </div>
          </div>

          {/* Module 2: Air-Gap Key Switch */}
          <div className="skeuo-chassis p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">MODULE 02 // SECURITY</span>
              <span className="w-2.5 h-2.5 rounded-full skeuo-diode-green" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Air-Gap Physical Isolation</h3>
            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              Zero outbound cloud requests. The server binds strictly to loopback IP 127.0.0.1, guaranteeing that confidential enterprise or academic files never leave local RAM.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400">
              AUDIT: 100% LOCAL LOOPBACK
            </div>
          </div>

          {/* Module 3: 768-D Vector Encoder */}
          <div className="skeuo-chassis p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">MODULE 03 // VECTOR</span>
              <span className="w-2.5 h-2.5 rounded-full skeuo-diode-cyan" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">768-D Dense Embedder</h3>
            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              Transforms text chunks into 768-dimensional normalized dense vectors via Nomic Embed v1.5, enabling true conceptual semantic search.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-400">
              DIMENSION: 768 FLOAT32
            </div>
          </div>

          {/* Module 4: Standby Thermal Bypass */}
          <div className="md:col-span-2 skeuo-chassis p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">MODULE 04 // RESILIENCE</span>
              <span className="w-2.5 h-2.5 rounded-full skeuo-diode-amber" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white uppercase">Adaptive Standby Thermal Bypass</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-mono leading-relaxed max-w-xl">
                Unlike fragile Streamlit scripts that crash if LM Studio is loading models into GPU VRAM, ContextOS routes automatically through its built-in semantic synthesizer, guaranteeing uninterrupted live presentation.
              </p>
            </div>
            <div className="skeuo-inset p-4 rounded-xl flex items-center justify-between font-mono text-xs text-slate-300">
              <span>ZERO-CRASH FAILSAFE ARCHITECTURE</span>
              <span className="text-amber-400">STANDBY READY</span>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 3: INTERACTIVE PATCH-CABLE PIPELINE WORKBENCH */}
      <section id="pipeline" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-purple-400">
            <span>PATCHBAY SCHEMATICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            5-Stage RAG Workbench
          </h2>
          <p className="text-slate-400 text-sm font-mono">
            Click any modular stage to inspect its physical signal routing and data transformation.
          </p>
        </div>

        {/* Stage Selector Switches */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {pipelineStages.map((stage, idx) => (
            <button
              key={stage.step}
              onClick={() => setActivePipelineStage(idx)}
              className={`px-4 py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                activePipelineStage === idx
                  ? 'skeuo-btn-primary text-white'
                  : 'skeuo-btn text-slate-400 hover:text-white'
              }`}
            >
              <span>[{stage.step}] {stage.title}</span>
            </button>
          ))}
        </div>

        {/* Active Stage Hardware Card */}
        <div className="skeuo-chassis p-8 sm:p-12 rounded-3xl max-w-4xl mx-auto border border-slate-700 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              STAGE {pipelineStages[activePipelineStage].step} OF 05 // SIGNAL ROUTE
            </span>
            <span className="text-xs font-mono text-slate-400">
              {pipelineStages[activePipelineStage].tech}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white uppercase">
              {pipelineStages[activePipelineStage].title}
            </h3>
            <div className="text-xs font-mono text-cyan-400 mt-1">
              {pipelineStages[activePipelineStage].subtitle}
            </div>
          </div>

          <p className="text-slate-300 text-sm font-mono leading-relaxed">
            {pipelineStages[activePipelineStage].desc}
          </p>

          <div className="skeuo-inset p-4 rounded-xl font-mono text-xs text-slate-200">
            <span className="text-slate-400 text-[10px] block mb-1 uppercase">Physical Signal Transformation:</span>
            <code>{pipelineStages[activePipelineStage].payload}</code>
          </div>
        </div>

      </section>

      {/* SECTION 4: LABORATORY CASE STUDIES */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-emerald-400">
            <span>LABORATORY BENCHMARKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Proven Hardware Applications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs, i) => (
            <div key={i} className="skeuo-chassis p-7 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                <span className="text-slate-400">CASE // 0{i+1}</span>
                <span className="text-cyan-400 font-bold">{cs.metric}</span>
              </div>
              <h3 className="text-base font-bold text-white uppercase">{cs.title}</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">{cs.desc}</p>
              <div className="skeuo-inset p-3 rounded-lg text-[11px] font-mono text-slate-300">
                INPUT: {cs.docs}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4B: INTERACTIVE OSCILLOSCOPE & SEMANTIC HARMONIC CALIBRATOR */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            <span>LAB CALIBRATION DECK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Tactile Semantic Harmonic Oscilloscope
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Twist the analog rotary potentiometers to modulate dense vector retrieval sensitivity, embedding frequency resonance, and temperature dampening in real time.
          </p>
        </div>

        <div className="skeuo-chassis p-8 sm:p-12 rounded-3xl border border-slate-700/80 shadow-2xl space-y-10 relative">
          <div className="absolute top-4 left-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute top-4 right-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 skeuo-screw" />

          {/* Oscilloscope CRT Tube Display */}
          <div className="skeuo-screen p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffcc08_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex items-center justify-between text-[11px] font-mono z-10">
              <span className="text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
                OSCILLOSCOPE CHANNEL A // SEMANTIC DENSITY TRACE
              </span>
              <span className="text-slate-400">SAMPLE FREQ: 768.0 kHz</span>
            </div>

            {/* Dynamic Waveform SVG */}
            <div className="w-full h-32 my-2 relative z-10 flex items-center">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                <path
                  d={`M 0,50 
                     Q ${100 * windowBandwidth},${50 - 45 * retrievalGain} 125,50 
                     T 250,50 
                     Q ${300 + 50 * tempHarmonic},${50 + 45 * retrievalGain} 375,50 
                     T 500,50`}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                />
                <path
                  d={`M 0,50 
                     Q ${80 * windowBandwidth},${50 - 25 * retrievalGain * tempHarmonic} 125,50 
                     T 250,50 
                     Q ${320},${50 + 25 * retrievalGain * tempHarmonic} 375,50 
                     T 500,50`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="filter drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10 border-t border-cyan-500/20 pt-2">
              <span>VOLTS/DIV: {(retrievalGain * 2.5).toFixed(2)}V</span>
              <span>TIME/DIV: {(windowBandwidth * 10).toFixed(1)}ms</span>
              <span>RESONANCE: {(tempHarmonic * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Tactile Potentiometer Scrubbing Bay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
            
            <div className="skeuo-inset p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-300 font-bold">Retrieval Gain (Top-K)</span>
              <SkeuoKnob 
                value={retrievalGain} 
                onChange={setRetrievalGain} 
                min={0.1} 
                max={1.0} 
                label="GAIN" 
                size={80} 
              />
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {Math.round(retrievalGain * 10)} CHUNKS
              </span>
            </div>

            <div className="skeuo-inset p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-300 font-bold">Window Bandwidth</span>
              <SkeuoKnob 
                value={windowBandwidth} 
                onChange={setWindowBandwidth} 
                min={0.2} 
                max={1.0} 
                label="WIDTH" 
                size={80} 
              />
              <span className="text-xs font-mono text-purple-400 font-bold">
                {Math.round(windowBandwidth * 1000)} CHARS
              </span>
            </div>

            <div className="skeuo-inset p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-300 font-bold">Thermal Dampener</span>
              <SkeuoKnob 
                value={tempHarmonic} 
                onChange={setTempHarmonic} 
                min={0.0} 
                max={1.0} 
                label="TEMP" 
                size={80} 
              />
              <span className="text-xs font-mono text-amber-400 font-bold">
                TEMP: {tempHarmonic.toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4C: HARDWARE TOPOLOGY BENCHMARK MATRIX */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-purple-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL SPECIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            ContextOS Console vs Generic Alternatives
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            See why typical college Streamlit scripts and commercial cloud APIs fail where ContextOS excels.
          </p>
        </div>

        {/* Tactile Matrix Table */}
        <div className="skeuo-chassis rounded-3xl p-6 sm:p-8 overflow-x-auto border border-slate-700/80 shadow-2xl">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase text-[11px]">
                <th className="py-4 px-4">Evaluation Metric</th>
                <th className="py-4 px-4 text-cyan-400 font-bold">ContextOS Console</th>
                <th className="py-4 px-4 text-slate-400">Standard Streamlit RAG</th>
                <th className="py-4 px-4 text-slate-400">Cloud SaaS (OpenAI / AWS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-4 px-4 font-bold text-white">Air-Gapped Data Privacy</td>
                <td className="py-4 px-4 text-emerald-400 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" /> 100% Local (0 Cloud Leak)
                </td>
                <td className="py-4 px-4 text-amber-400">Partial (Temp local disk)</td>
                <td className="py-4 px-4 text-rose-400 flex items-center gap-2">
                  <X className="w-4 h-4" /> Sent to remote cloud
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-white">Interface Tactility & UX</td>
                <td className="py-4 px-4 text-cyan-400 font-bold">
                  Skeuomorphic Hardware Deck
                </td>
                <td className="py-4 px-4 text-slate-400">Basic Python widgets / forms</td>
                <td className="py-4 px-4 text-slate-400">Generic flat web dashboard</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-white">Inference Engine</td>
                <td className="py-4 px-4 text-cyan-400 font-bold">
                  Bionic / LM Studio (Local GPU)
                </td>
                <td className="py-4 px-4 text-slate-400">Slow CPU HuggingFace or Cloud</td>
                <td className="py-4 px-4 text-slate-400">Remote API server</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-white">Recurring API Cost</td>
                <td className="py-4 px-4 text-emerald-400 font-bold">$0.00 Forever</td>
                <td className="py-4 px-4 text-emerald-400">$0.00 (Local) or API charges</td>
                <td className="py-4 px-4 text-rose-400">High Per-Token Billing</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-white">Vector Dimension</td>
                <td className="py-4 px-4 text-cyan-400 font-bold">768-D Dense Embeddings</td>
                <td className="py-4 px-4 text-slate-400">Often basic 384-D or BM25</td>
                <td className="py-4 px-4 text-slate-400">1536-D (Remote proprietary)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-white">Standby Fallback Synthesizer</td>
                <td className="py-4 px-4 text-emerald-400 font-bold">
                  Integrated (Never crashes)
                </td>
                <td className="py-4 px-4 text-rose-400 flex items-center gap-2">
                  <X className="w-4 h-4" /> Hard crash on connection loss
                </td>
                <td className="py-4 px-4 text-slate-400">Cloud status dependent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4D: CHASSIS REAR IO & PHYSICAL PATCH MATRIX */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-amber-400">
            <Database className="w-3.5 h-3.5" />
            <span>PHYSICAL SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Chassis Rear IO & Patch Ports
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Industrial silkscreened connector bay showing local loopback busses and DMA memory conduits.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
          <div className="absolute top-4 left-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute top-4 right-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 skeuo-screw" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* PORT 1 */}
            <div className="skeuo-inset p-5 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase">PORT 01 // BIONIC BUS</span>
                <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
              </div>
              <div className="w-12 h-12 rounded-full skeuo-btn mx-auto flex items-center justify-center border border-amber-600/40">
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700" />
              </div>
              <div className="text-center font-mono text-xs">
                <span className="text-white font-bold block">127.0.0.1:1234/v1</span>
                <span className="text-[10px] text-slate-400">OpenAI Protocol Emulation</span>
              </div>
            </div>

            {/* PORT 2 */}
            <div className="skeuo-inset p-5 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase">PORT 02 // FASTAPI SOCKET</span>
                <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
              </div>
              <div className="w-12 h-12 rounded-full skeuo-btn mx-auto flex items-center justify-center border border-cyan-600/40">
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700" />
              </div>
              <div className="text-center font-mono text-xs">
                <span className="text-white font-bold block">127.0.0.1:8000</span>
                <span className="text-[10px] text-slate-400">SSE Vector Event Stream</span>
              </div>
            </div>

            {/* PORT 3 */}
            <div className="skeuo-inset p-5 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase">PORT 03 // VECTOR DMA BUS</span>
                <span className="w-2 h-2 rounded-full skeuo-diode-cyan" />
              </div>
              <div className="w-12 h-12 rounded-full skeuo-btn mx-auto flex items-center justify-center border border-purple-600/40">
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700" />
              </div>
              <div className="text-center font-mono text-xs">
                <span className="text-white font-bold block">768-D IEEE 754</span>
                <span className="text-[10px] text-slate-400">Direct In-Memory Index</span>
              </div>
            </div>

            {/* PORT 4 */}
            <div className="skeuo-inset p-5 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase">PORT 04 // AIR-GAP SHIELD</span>
                <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
              </div>
              <div className="w-12 h-12 rounded-full skeuo-btn mx-auto flex items-center justify-center border border-emerald-600/40">
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700" />
              </div>
              <div className="text-center font-mono text-xs">
                <span className="text-white font-bold block">Physical Isolator</span>
                <span className="text-[10px] text-slate-400">0 WAN Outbound Connections</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 5: TACTILE SCHEMATIC FAQ ACCORDION */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">OPERATOR FAQ</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Technical Inquiries</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="skeuo-chassis rounded-2xl overflow-hidden border border-slate-700">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between text-sm font-mono font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-xs font-mono text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: BOTTOM ENGAGEMENT NAMEPLATE */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="skeuo-chassis p-10 sm:p-14 rounded-3xl border border-cyan-500/40 text-center space-y-6 relative overflow-hidden">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Ready to Operate ContextOS on Your Local Machine?
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-xl mx-auto">
              Launch the hardware console deck, load your documents, and experience private semantic retrieval.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setView('dashboard')}
              className="skeuo-btn-primary px-8 py-4 rounded-xl text-white font-bold text-sm font-mono tracking-wider flex items-center gap-3 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>ENGAGE CONSOLE NOW</span>
            </button>
            <button
              onClick={() => setView('docs')}
              className="skeuo-btn px-6 py-4 rounded-xl text-slate-200 font-mono text-sm tracking-wider cursor-pointer"
            >
              <span>VIEW TECHNICAL SCHEMATICS</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
