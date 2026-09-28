import React, { useState, useEffect } from 'react';
import { 
  Terminal, Shield, Cpu, Zap, Database, 
  Layers, Compass, ArrowRight, CheckCircle2, ChevronDown, 
  ChevronUp, Lock, RefreshCw, HardDrive, Key, FileText,
  Activity, Sliders, Radio, Check, X, Search, Paperclip,
  Folder, FolderOpen, Volume2, VolumeX, Sparkles, Copy,
  ExternalLink, MousePointer, Gauge
} from 'lucide-react';
import SkeuoKnob from '../components/SkeuoKnob';
import SkeuoMeter from '../components/SkeuoMeter';
import SkeuoSwitch from '../components/SkeuoSwitch';
import Interactive3DKnowledgeMap from '../components/Interactive3DKnowledgeMap';
import { sounds } from '../utils/soundEffects';

export default function LandingPage({ setView, bionicStatus, stats }) {
  // Global & Sound State
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Section 2: Live RAG Pipeline State
  const [activePipelineStage, setActivePipelineStage] = useState(0);

  // Section 4: File Cabinet State
  const [activeDrawer, setActiveDrawer] = useState('academic'); // 'academic' | 'security' | 'financial'

  // Section 5: Semantic Retrieval Magnifier State
  const [magnifierIndex, setMagnifierIndex] = useState(1);

  // Section 6: Context Assembly Stacking State
  const [stackedLayers, setStackedLayers] = useState([true, true, true]);

  // Section 7: Local LLM Generation State
  const [genTemp, setGenTemp] = useState(0.7);
  const [genText, setGenText] = useState('');
  const [isTypingGen, setIsTypingGen] = useState(false);

  // Section 9: Citation Explorer Tab
  const [activeCitationTab, setActiveCitationTab] = useState(0);

  // Section 10: Performance Gauges
  const [evalLatency, setEvalLatency] = useState(0.82);
  const [evalHitRate, setEvalHitRate] = useState(0.94);

  // Section 11: Privacy Air-Gap Toggle
  const [airGapActive, setAirGapActive] = useState(true);

  // Section 14: Interactive Demo Workbench State
  const [demoQuery, setDemoQuery] = useState('How does ContextOS guarantee 100% offline air-gap privacy?');
  const [demoOutput, setDemoOutput] = useState('');
  const [demoStreaming, setDemoStreaming] = useState(false);
  const [demoMeterVal, setDemoMeterVal] = useState(0.88);

  // Section 15: Developer Copied State
  const [copiedCode, setCopiedCode] = useState(false);

  // Section 16: Final CTA Switch
  const [ctaEngaged, setCtaEngaged] = useState(false);

  // Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Sound toggle helper
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setMuted(!next);
    if (next) sounds.playSwitch();
  };

  // Pipeline Stages Definition
  const pipelineStages = [
    {
      step: '01',
      title: 'Physical Ingestion Intake',
      subtitle: 'Multi-Format File Intake Slot',
      desc: 'Documents (PDF, DOCX, TXT, CSV, JSON) pass through mechanical parsers. Layout geometries, tabular boundaries, and page offsets are preserved.',
      station: 'STATION // INTAKE-01',
      rate: '14.2 MB/s'
    },
    {
      step: '02',
      title: 'Recursive Window Splitter',
      subtitle: 'Sentence Boundary Preservation',
      desc: 'Clean text is cleaved into calibrated 600-character windows with 120-character overlapping boundaries to prevent contextual severance.',
      station: 'STATION // CLEAVER-02',
      rate: '600 Chars / 120 Overlap'
    },
    {
      step: '03',
      title: '768-D Vector Encoder',
      subtitle: 'Dense Mathematical Embeddings',
      desc: 'Windows are encoded into 768-dimensional dense mathematical vectors using local Nomic Embed v1.5 with L2 unit normalization.',
      station: 'STATION // ENCODER-03',
      rate: '768 Float32 / Chunk'
    },
    {
      step: '04',
      title: 'Cosine Distance Matcher',
      subtitle: 'Dot-Product Proximity Search',
      desc: 'Query vector performs vectorized dot-product matrix multiplication against in-memory dense vector chunks in sub-millisecond cycles.',
      station: 'STATION // COSINE-04',
      rate: '<8ms Latency'
    },
    {
      step: '05',
      title: 'Air-Gapped Synthesis',
      subtitle: 'Local GPU Token Streamer',
      desc: 'Augmented context prompt is fed directly to the local Bionic / LM Studio GPU, streaming typewriter tokens with source citations.',
      station: 'STATION // SYNTH-05',
      rate: '45.8 tok/s'
    }
  ];

  // Drawer Folders
  const drawers = {
    academic: [
      { id: 'p1', title: 'Dense Retrieval Hierarchies.pdf', page: 'Page 3', stamp: 'CONFIDENTIAL', excerpt: 'Dense vectors resolve vocabulary mismatch by embedding semantic similarity into continuous vector space.' },
      { id: 'p2', title: 'Recursive Chunking Benchmarks.pdf', page: 'Page 8', stamp: 'PEER REVIEWED', excerpt: 'Boundary overlaps of 15-20% yield optimal needle retrieval across multi-page legal and medical documents.' }
    ],
    security: [
      { id: 's1', title: 'AirGap Architecture Protocol.docx', page: 'Page 1', stamp: 'RESTRICTED', excerpt: 'All model weights and vector stores remain pinned in local volatile RAM. No outbound sockets are initialized.' },
      { id: 's2', title: 'Hardware Loopback Bus.docx', page: 'Page 5', stamp: 'APPROVED', excerpt: 'Port 1234 communicates strictly via localhost 127.0.0.1 with physical packet isolation.' }
    ],
    financial: [
      { id: 'f1', title: 'Q3 Enterprise Cost Audit.csv', page: 'Row 44', stamp: 'AUDITED', excerpt: 'Cloud LLM API charges reduced to $0.00/month after migrating inference to on-premise local hardware.' },
      { id: 'f2', title: 'Hardware Latency Metrics.csv', page: 'Row 12', stamp: 'VERIFIED', excerpt: 'Local inference eliminates network transit jitter, achieving deterministic 18ms first-token latency.' }
    ]
  };

  // Demo Run Handler
  const handleRunDemo = () => {
    sounds.playSwitch();
    setDemoStreaming(true);
    setDemoOutput('');
    setDemoMeterVal(0.96);

    const fullResponse = "ContextOS guarantees 100% offline air-gap privacy through a strictly local loopback architecture. Documents are extracted, chunked, and embedded into 768-D dense vectors directly inside your machine's volatile memory. Inference is dispatched via http://127.0.0.1:1234 to Bionic / LM Studio on your local GPU. Zero packets ever leave your network interface.";
    
    let index = 0;
    const interval = setInterval(() => {
      index += 3;
      setDemoOutput(fullResponse.slice(0, index));
      sounds.playKeyClick();
      if (index >= fullResponse.length) {
        clearInterval(interval);
        setDemoStreaming(false);
      }
    }, 28);
  };

  return (
    <div className="flex flex-col w-full bg-[#0b0e14] text-slate-100 overflow-x-hidden">

      {/* ====================================================================
          SECTION 1: HERO — LOCAL INTELLIGENCE, YOUR CONTEXT
          ==================================================================== */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Workstation Outer Bezel */}
        <div className="skeuo-chassis p-6 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl relative">
          
          {/* Top Chassis Rivets */}
          <div className="absolute top-4 left-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute top-4 right-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 skeuo-screw" />
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 skeuo-screw" />

          {/* Workstation Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full skeuo-diode-emerald animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">
                WORKSTATION CONSOLE // CONTEXTOS-MK-IV
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                AIR-GAP ACTIVE
              </span>
            </div>

            {/* Signal & Sound Toggles */}
            <div className="flex items-center gap-4 font-mono text-xs">
              {/* Local LLM Signal Strength */}
              <div className="hidden sm:flex items-center gap-2 skeuo-inset px-3 py-1 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400">BIONIC SIGNAL:</span>
                <div className="flex items-end gap-1 h-3.5">
                  <div className="w-1 h-1.5 bg-emerald-400 rounded-sm" />
                  <div className="w-1 h-2.5 bg-emerald-400 rounded-sm" />
                  <div className="w-1 h-3 bg-emerald-400 rounded-sm" />
                  <div className="w-1 h-3.5 bg-emerald-400 rounded-sm" />
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">100%</span>
              </div>

              {/* Sound Effect Toggle Switch */}
              <button
                onClick={handleToggleSound}
                className="skeuo-btn px-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
                title="Toggle Mechanical Audio Feedback"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-[11px]">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
              </button>
            </div>
          </div>

          {/* Hero Main Grid: Left Copy & Controls, Right Physical Context Core */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-10 items-center">
            
            {/* Left Column: Headlines & Mechanical Keypad */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400 border border-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>LOCAL INTELLIGENCE // ZERO CLOUD DEPENDENCY</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-mono leading-none">
                Local Intelligence, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  Your Context.
                </span>
              </h1>

              <p className="text-sm sm:text-base font-mono text-slate-300 leading-relaxed max-w-xl">
                The physical machine for exploring and reasoning over knowledge. Built with dense 768-D mathematical embeddings, 
                analog telemetry gauges, and strictly air-gapped local LLMs via Bionic & LM Studio.
              </p>

              {/* Mechanical Keyboard Keycaps Quick Action */}
              <div className="skeuo-inset p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Workstation Quick Commands:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => { sounds.playKeyClick(); setView('dashboard'); }}
                    className="mechanical-key px-3.5 py-2 font-mono text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-[10px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-500/30 font-bold">CTRL+L</span>
                    <span>Launch Console</span>
                  </button>
                  <button
                    onClick={() => { sounds.playKeyClick(); setView('docs'); }}
                    className="mechanical-key px-3.5 py-2 font-mono text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-[10px] text-purple-400 bg-slate-900 px-1.5 py-0.5 rounded border border-purple-500/30 font-bold">CTRL+M</span>
                    <span>Schematics</span>
                  </button>
                  <button
                    onClick={() => { sounds.playKeyClick(); setView('auth'); }}
                    className="mechanical-key px-3.5 py-2 font-mono text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-[10px] text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">CTRL+K</span>
                    <span>Clearance</span>
                  </button>
                </div>
              </div>

              {/* Primary Call to Action Deck */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => { sounds.playSwitch(); setView('dashboard'); }}
                  className="skeuo-btn-primary px-8 py-4 rounded-xl text-white font-mono font-bold text-sm tracking-wider flex items-center gap-3 cursor-pointer shadow-xl"
                >
                  <Terminal className="w-4 h-4 text-cyan-200" />
                  <span>ENGAGE HARDWARE CONSOLE</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200" />
                </button>
                <button
                  onClick={() => { sounds.playSwitch(); setView('docs'); }}
                  className="skeuo-btn px-6 py-4 rounded-xl text-slate-200 font-mono text-xs font-bold tracking-wider cursor-pointer"
                >
                  <span>TECHNICAL MANUAL</span>
                </button>
              </div>

            </div>

            {/* Right Column: Physical Context Core Machine & Sticky Note */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              
              {/* Pinned Sticky Note */}
              <div className="absolute -top-6 -right-2 sm:right-4 z-20 sticky-note p-3.5 w-52 sm:w-60 transform rotate-2 pointer-events-none shadow-2xl">
                <div className="w-3 h-3 rounded-full bg-red-600 shadow-md mx-auto mb-1.5 border border-red-800" />
                <span className="text-[11px] font-mono font-bold block uppercase tracking-wide">
                  📌 LAB PROTOCOL
                </span>
                <p className="text-[10px] font-mono leading-tight mt-1">
                  100% on-premise execution. Zero cloud tokens. Qwen 3.5 9B & Nomic Embed pinned in local VRAM.
                </p>
              </div>

              {/* Physical Context Core Apparatus */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full skeuo-inset p-5 flex items-center justify-center relative shadow-inner border border-slate-800">
                {/* Outer Magnetic Ring */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-500/40 core-spin-slow pointer-events-none" />
                {/* Inner Counter-Rotating Ring */}
                <div className="absolute inset-10 rounded-full border border-purple-500/50 core-spin-reverse pointer-events-none" />
                
                {/* Center Glowing Reactor Filament */}
                <div className="w-32 h-32 rounded-full skeuo-chassis border border-cyan-400/60 flex flex-col items-center justify-center text-center p-4 relative shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <Cpu className="w-7 h-7 text-cyan-300 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase mt-1 tracking-wider">
                    CONTEXT CORE
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">
                    768-D SYNCED
                  </span>
                </div>

                {/* 4 Cardinal Sensor Diodes */}
                <div className="absolute top-2 w-2 h-2 rounded-full skeuo-diode-emerald" />
                <div className="absolute bottom-2 w-2 h-2 rounded-full skeuo-diode-emerald" />
                <div className="absolute left-2 w-2 h-2 rounded-full skeuo-diode-cyan" />
                <div className="absolute right-2 w-2 h-2 rounded-full skeuo-diode-cyan" />
              </div>

              {/* Core Telemetry Tag */}
              <div className="mt-4 flex items-center gap-3 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full disk-led-active bg-emerald-400" /> DISK DMA: ACTIVE</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">||v|| = 1.0</span>
              </div>

            </div>

          </div>

          {/* Bottom Dual Needle Preview Bridge */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
            <div className="skeuo-inset p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Retrieval Metric</span>
              <span className="text-cyan-400 text-sm font-bold">98.4% Cosine Proximity</span>
            </div>
            <div className="skeuo-inset p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Query Latency</span>
              <span className="text-emerald-400 text-sm font-bold">&lt;8.4ms In-Memory</span>
            </div>
            <div className="skeuo-inset p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Local Model Engine</span>
              <span className="text-purple-400 text-sm font-bold">Bionic (127.0.0.1:1234)</span>
            </div>
            <div className="skeuo-inset p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Hardware Privacy</span>
              <span className="text-amber-400 text-sm font-bold">0 Outbound Telemetry</span>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 2: LIVE RAG PIPELINE CONVEYOR
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            <span>SIGNAL PROCESSING CONVEYOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Live RAG Pipeline
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            A tactile hardware patchbay demonstrating continuous semantic signal transformation from raw document intake to streaming local GPU synthesis.
          </p>
        </div>

        {/* 5-Stage Physical Conveyor Deck */}
        <div className="skeuo-chassis p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8">
          
          {/* Station Stepper Keys */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {pipelineStages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActivePipelineStage(idx);
                  sounds.playKeyClick();
                }}
                className={`p-3.5 rounded-xl text-left font-mono transition-all cursor-pointer ${
                  activePipelineStage === idx
                    ? 'skeuo-btn border-cyan-400 text-white shadow-lg'
                    : 'skeuo-inset text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold text-cyan-400">{stage.step}</span>
                  <span className={`w-2 h-2 rounded-full ${activePipelineStage === idx ? 'skeuo-diode-emerald' : 'bg-slate-700'}`} />
                </div>
                <div className="text-xs font-bold truncate">{stage.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{stage.station}</div>
              </button>
            ))}
          </div>

          {/* Active Station Readout Display */}
          <div className="skeuo-screen p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-4 relative">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-cyan-300 border-b border-cyan-500/20 pb-3">
              <span className="font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full skeuo-diode-cyan" />
                {pipelineStages[activePipelineStage].station}
              </span>
              <span className="text-slate-400">PROCESSING RATE: {pipelineStages[activePipelineStage].rate}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
              {pipelineStages[activePipelineStage].title} — <span className="text-cyan-400">{pipelineStages[activePipelineStage].subtitle}</span>
            </h3>

            <p className="text-sm font-mono text-slate-300 leading-relaxed max-w-3xl">
              {pipelineStages[activePipelineStage].desc}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="skeuo-inset px-2.5 py-1 rounded text-emerald-400">TRANSFORMATION: DETERMINISTIC</span>
              <span className="skeuo-inset px-2.5 py-1 rounded text-purple-400">IEEE 754 PRECISION</span>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 3: HOW CONTEXTOS WORKS (LAYERED DESKTOP WINDOWS)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-purple-400">
            <Layers className="w-3.5 h-3.5" />
            <span>WORKSTATION OPERATING METAPHOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            How ContextOS Works
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Layered desktop windows mimicking a high-end AI research terminal with physical context gear trains.
          </p>
        </div>

        {/* 3 Layered Windows Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Window 1 */}
          <div className="skeuo-chassis rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl flex flex-col justify-between">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span>win_01_intake.sh</span>
            </div>
            <div className="p-6 space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase text-sm">1. Multi-Format Intake</h3>
              <p className="text-slate-400 leading-relaxed">
                Reads local files from disk. Strips formatting artifacts while isolating document sections, tables, and page metadata.
              </p>
              <div className="skeuo-inset p-2.5 rounded text-[11px] text-cyan-300">
                OUTPUT: Structured Plaintext Nodes
              </div>
            </div>
          </div>

          {/* Window 2 */}
          <div className="skeuo-chassis rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl flex flex-col justify-between">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span>win_02_vectorizer.py</span>
            </div>
            <div className="p-6 space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase text-sm">2. Dense Vector Indexing</h3>
              <p className="text-slate-400 leading-relaxed">
                Cleaves text into 600-char overlapping windows. Encodes each into a 768-D mathematical vector with in-memory dot-product indexing.
              </p>
              <div className="skeuo-inset p-2.5 rounded text-[11px] text-purple-300">
                OUTPUT: 768-D Normalized Space
              </div>
            </div>
          </div>

          {/* Window 3 */}
          <div className="skeuo-chassis rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl flex flex-col justify-between">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span>win_03_inference.bin</span>
            </div>
            <div className="p-6 space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase text-sm">3. Local Bionic Inference</h3>
              <p className="text-slate-400 leading-relaxed">
                Aligns top-K matched chunks into the augmented prompt. Streams typewriter generation tokens directly from your local GPU.
              </p>
              <div className="skeuo-inset p-2.5 rounded text-[11px] text-emerald-300">
                OUTPUT: Real-Time SSE Token Stream
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 4: KNOWLEDGE INGESTION (FILE CABINET & PAPER CARDS)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-amber-400">
            <Folder className="w-3.5 h-3.5" />
            <span>ARCHIVE CABINET METAPHOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Knowledge Ingestion
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Physical document folders and paper-like document cards with realistic fiber depth, corner folds, and drawer interactions.
          </p>
        </div>

        {/* File Cabinet Container */}
        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8">
          
          {/* 3 Physical Pull-Out Drawers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => { setActiveDrawer('academic'); sounds.playPaperRustle(); }}
              className={`p-4 rounded-xl text-left font-mono border transition-all cursor-pointer ${
                activeDrawer === 'academic'
                  ? 'skeuo-btn border-cyan-400 text-white'
                  : 'cabinet-drawer border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="drawer-handle h-3 w-16 mx-auto mb-3" />
              <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
                <FolderOpen className="w-4 h-4" />
                <span>Academic Research</span>
              </div>
              <span className="text-[10px] text-slate-400">2 PDF Files • 18 Chunks</span>
            </button>

            <button
              onClick={() => { setActiveDrawer('security'); sounds.playPaperRustle(); }}
              className={`p-4 rounded-xl text-left font-mono border transition-all cursor-pointer ${
                activeDrawer === 'security'
                  ? 'skeuo-btn border-emerald-400 text-white'
                  : 'cabinet-drawer border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="drawer-handle h-3 w-16 mx-auto mb-3" />
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                <FolderOpen className="w-4 h-4" />
                <span>Security Protocols</span>
              </div>
              <span className="text-[10px] text-slate-400">2 DOCX Files • 14 Chunks</span>
            </button>

            <button
              onClick={() => { setActiveDrawer('financial'); sounds.playPaperRustle(); }}
              className={`p-4 rounded-xl text-left font-mono border transition-all cursor-pointer ${
                activeDrawer === 'financial'
                  ? 'skeuo-btn border-amber-400 text-white'
                  : 'cabinet-drawer border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="drawer-handle h-3 w-16 mx-auto mb-3" />
              <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                <FolderOpen className="w-4 h-4" />
                <span>Financial & Lab Data</span>
              </div>
              <span className="text-[10px] text-slate-400">2 CSV Files • 12 Chunks</span>
            </button>
          </div>

          {/* Paper Cards Inside Active Drawer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {drawers[activeDrawer].map((doc) => (
              <div 
                key={doc.id}
                onClick={() => sounds.playPaperRustle()}
                className="paper-card p-6 rounded-lg cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-stone-300">
                  <span className="font-bold text-stone-900">{doc.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-300 text-stone-800 font-bold">
                    {doc.stamp}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-serif italic leading-relaxed">
                  "{doc.excerpt}"
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 pt-2">
                  <span>{doc.page}</span>
                  <span className="text-cyan-800 font-bold">768-D INDEXED</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 5: SEMANTIC RETRIEVAL (MAGNIFYING GLASS INSPECTOR)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <Search className="w-3.5 h-3.5" />
            <span>MICROSCOPIC VECTOR INSPECTOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Semantic Retrieval
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Slide the magnifying lens across stored memory cards to inspect dense vector dimensions and cosine similarity coefficients.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8">
          
          {/* Selector Selector Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
            <span className="text-slate-400 uppercase">POSITION MAGNIFYING LENS:</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => { setMagnifierIndex(idx); sounds.playKnobTick(); }}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    magnifierIndex === idx ? 'skeuo-btn text-cyan-300' : 'skeuo-inset text-slate-400'
                  }`}
                >
                  CARD // 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Tray with Magnifier Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 0, title: 'Chunk #012 - Neural Attention', score: 0.962, text: 'Self-attention calculates pairwise dot product similarity across token embeddings to prioritize salient context.' },
              { id: 1, title: 'Chunk #045 - Vector Normalization', score: 0.948, text: 'L2 Euclidean normalization forces all vectors onto the unit hypersphere, converting dot product directly to cosine.' },
              { id: 2, title: 'Chunk #078 - Air-Gap Boundary', score: 0.915, text: 'Socket connections outside of 127.0.0.1 are hard-dropped at the operating system packet filter level.' }
            ].map((card, i) => (
              <div 
                key={card.id}
                onClick={() => { setMagnifierIndex(i); sounds.playKeyClick(); }}
                className={`p-6 rounded-2xl transition-all cursor-pointer ${
                  magnifierIndex === i
                    ? 'skeuo-screen border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] transform scale-105'
                    : 'skeuo-inset border border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
                  <span className="text-white font-bold">{card.title}</span>
                  {magnifierIndex === i && <Search className="w-4 h-4 text-cyan-400 animate-pulse" />}
                </div>
                <p className="text-xs font-mono text-slate-300 py-3 leading-relaxed">
                  {card.text}
                </p>
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                  <span className="text-slate-500">COSINE COEFF</span>
                  <span className="text-cyan-400 font-bold">{(card.score * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 6: CONTEXT ASSEMBLY (MAGNETIC CONTEXT STACKING)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-purple-400">
            <Layers className="w-3.5 h-3.5" />
            <span>MAGNETIC STACKING INTERACTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Context Assembly
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Click layers to snap them magnetically into the local context window budget before dispatching to the LLM.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* Token Budget Gauge Bar */}
          <div className="skeuo-inset p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>CONTEXT WINDOW BUDGET:</span>
              <span className="text-cyan-400 font-bold">
                {stackedLayers.filter(Boolean).length * 800} / 8,192 TOKENS
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300"
                style={{ width: `${(stackedLayers.filter(Boolean).length * 800 / 8192) * 100}%` }}
              />
            </div>
          </div>

          {/* 3 Magnetic Layers */}
          <div className="space-y-3">
            {[
              { idx: 0, title: 'LAYER 01 // SYSTEM PROMPT & STRICT REASONING RULES', cost: '800 Tokens', desc: 'Sets ground-truth directive: Only answer using provided sources, never hallucinate outside context.' },
              { idx: 1, title: 'LAYER 02 // DENSE RETRIEVED CITATION CHUNKS', cost: '800 Tokens', desc: 'The top-K matched passages extracted from your PDF and DOCX files with page references.' },
              { idx: 2, title: 'LAYER 03 // USER QUERY INTENT & HISTORY', cost: '800 Tokens', desc: 'Original operator inquiry with conversational context and response formatting constraints.' }
            ].map((layer) => (
              <div
                key={layer.idx}
                onClick={() => {
                  const updated = [...stackedLayers];
                  updated[layer.idx] = !updated[layer.idx];
                  setStackedLayers(updated);
                  sounds.playSwitch();
                }}
                className={`p-5 rounded-2xl font-mono text-xs border transition-all cursor-pointer ${
                  stackedLayers[layer.idx]
                    ? 'skeuo-btn border-cyan-400 shadow-md translate-y-0'
                    : 'skeuo-inset border-slate-800 opacity-40 translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stackedLayers[layer.idx] ? 'skeuo-diode-emerald' : 'bg-slate-700'}`} />
                    {layer.title}
                  </span>
                  <span className="text-cyan-400">{layer.cost}</span>
                </div>
                <p className="text-slate-400">{layer.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 7: LOCAL LLM GENERATION (CRT PHOSPHOR TERMINAL)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>PHOSPHOR CRT TYPEWRITER TERMINAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Local LLM Generation
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Real-time SSE token typewriter streamed directly from local Bionic GPU with physical temperature knobs.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* CRT Screen Column (8 Cols) */}
          <div className="lg:col-span-8 skeuo-screen p-6 sm:p-8 rounded-2xl min-h-[280px] flex flex-col justify-between border border-cyan-500/30">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-500/20 pb-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
                <span>LOCAL ENGINE STREAM: QWEN 3.5 9B (GPU)</span>
              </span>
              <span className="text-slate-400">PORT: 127.0.0.1:1234/v1</span>
            </div>

            <div className="my-4 font-mono text-sm text-cyan-100 leading-relaxed min-h-[120px]">
              {genText || (
                <span className="text-slate-500 italic">
                  Press "Trigger Local Generation" to stream typewriter tokens with mechanical acoustic feedback...
                </span>
              )}
              {isTypingGen && <span className="inline-block w-2.5 h-4 ml-1 bg-cyan-400 animate-pulse" />}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-cyan-500/20 pt-2">
              <span>SPEED: 48.2 TOK/S</span>
              <span>TIME TO FIRST TOKEN: 18ms</span>
              <span className="text-emerald-400 font-bold">100% PRIVATE</span>
            </div>
          </div>

          {/* Rotary Control & Trigger Column (4 Cols) */}
          <div className="lg:col-span-4 skeuo-inset p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase text-slate-300 font-bold">
              Generation Temperature
            </span>

            <SkeuoKnob
              value={genTemp}
              onChange={setGenTemp}
              min={0.1}
              max={1.0}
              label="TEMP"
              size={84}
            />

            <span className="text-xs font-mono text-cyan-400 font-bold">
              TEMP: {genTemp.toFixed(2)}
            </span>

            <button
              onClick={() => {
                sounds.playSwitch();
                setIsTypingGen(true);
                setGenText('');
                const sampleTokens = "According to Section 4 of your uploaded research paper, dense vector indexation prevents contextual fragmentation across complex tabular balance sheets.";
                let idx = 0;
                const timer = setInterval(() => {
                  idx += 2;
                  setGenText(sampleTokens.slice(0, idx));
                  sounds.playKeyClick();
                  if (idx >= sampleTokens.length) {
                    clearInterval(timer);
                    setIsTypingGen(false);
                  }
                }, 35);
              }}
              disabled={isTypingGen}
              className="w-full skeuo-btn-primary py-3 rounded-xl text-xs font-mono font-bold text-white uppercase tracking-wider cursor-pointer"
            >
              Trigger Local Generation
            </button>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 8: INTERACTIVE 3D KNOWLEDGE SPACE (THREE.JS SPATIAL MAP)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
            <span>3D DATA VISUALIZATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Interactive 3D Knowledge Space
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Explore your dense 768-D vector topology projected into an interactive 3D spatial constellation with live raycasting and target targeting.
          </p>
        </div>

        {/* Embedded Interactive 3D Spatial Knowledge Map */}
        <Interactive3DKnowledgeMap 
          onSelectChunk={(chunk) => {
            sounds.playPaperRustle();
            alert(`Selected Chunk: ${chunk.doc_name} (Page ${chunk.page})\n\n"${chunk.snippet}"`);
          }}
        />
      </section>

      {/* ====================================================================
          SECTION 9: SOURCE & CITATION EXPLORER
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-amber-400">
            <Paperclip className="w-3.5 h-3.5" />
            <span>PINNED CITATION CLIPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Source & Citation Explorer
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Inspect exact page coordinates, source excerpts, and verified match percentages with physical paperclip pins.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* Folder Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
            {['Academic_RAG_Survey.pdf', 'AirGap_Security_Spec.docx', 'Financial_Q3_Balance.csv'].map((tab, i) => (
              <button
                key={i}
                onClick={() => { setActiveCitationTab(i); sounds.playPaperRustle(); }}
                className={`px-4 py-2 rounded-t-lg cursor-pointer ${
                  activeCitationTab === i ? 'folder-tab font-bold' : 'folder-tab-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sticky Note Excerpt */}
          <div className="sticky-note p-6 rounded-lg space-y-3 shadow-xl">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow border border-red-800 mb-2" />
            <div className="flex items-center justify-between text-xs font-mono text-amber-900 border-b border-amber-300 pb-2">
              <span className="font-bold">EXACT SOURCE PASSAGE [SOURCE #{activeCitationTab + 1}]</span>
              <span>PAGE {activeCitationTab * 4 + 2} • OFFSET: CHAR 1,420</span>
            </div>
            <p className="text-sm font-serif italic text-amber-950 leading-relaxed">
              {[
                'Sentence-level windowing ensures zero token truncation across multi-column academic PDF papers, preserving table hierarchies with 94.8% retrieval precision.',
                'The local socket loopback strictly enforces 0 outbound internet traffic. All mathematical matrix operations occur within local RAM registers.',
                'Gross operating expenditure on third-party cloud AI APIs was eliminated entirely, achieving a 100% reduction in per-token inference billing.'
              ][activeCitationTab]}
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-amber-900 pt-2 border-t border-amber-300">
              <span>MATCH SCORE: <strong className="text-amber-950">{(0.96 - activeCitationTab * 0.03).toFixed(3)}</strong></span>
              <span className="uppercase font-bold">100% GROUNDED</span>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 10: RAG PERFORMANCE & LABORATORY EVALUATION
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <Gauge className="w-3.5 h-3.5" />
            <span>INSTRUMENT PANEL TELEMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            RAG Performance & Evaluation
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Real analog galvanometer meters measuring deterministic retrieval hit-rates, latency, and tokens/sec velocity.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center">
            
            {/* Meter 1: Latency */}
            <div className="flex flex-col items-center">
              <SkeuoMeter
                value={evalLatency}
                label="RETRIEVAL SPEED"
                unit="MILLISECONDS"
                min={0}
                max={1}
                width={280}
                height={150}
              />
              <span className="mt-2 text-xs font-mono text-cyan-400 font-bold">
                AVERAGE LATENCY: 8.2ms
              </span>
            </div>

            {/* Meter 2: Precision Hit-Rate */}
            <div className="flex flex-col items-center">
              <SkeuoMeter
                value={evalHitRate}
                label="HIT-RATE PRECISION"
                unit="PERCENTAGE"
                min={0}
                max={1}
                width={280}
                height={150}
              />
              <span className="mt-2 text-xs font-mono text-emerald-400 font-bold">
                GROUNDED HIT-RATE: 94.8%
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 11: PRIVACY & LOCAL-FIRST AI (AIR-GAP KNIFE SWITCH)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>AIR-GAP HARDWARE ISOLATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Privacy & Local-First AI
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Physical air-gap isolation breaker. When engaged, zero network interfaces communicate outside localhost.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full skeuo-diode-emerald" />
              <span className="font-mono text-sm font-bold text-white uppercase">
                Hardware Air-Gap Breaker: {airGapActive ? 'ENGAGED' : 'STANDBY'}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              ContextOS features an uncompromised privacy policy. All document chunking, embeddings, and generative token inference run strictly on your local GPU via Bionic at 127.0.0.1:1234.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full disk-led-active bg-emerald-400" /> DISK I/O: LOCAL ONLY</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">WAN PACKETS: 0</span>
            </div>
          </div>

          {/* Physical Toggle Switch */}
          <div className="skeuo-inset p-6 rounded-2xl flex flex-col items-center gap-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">AIR-GAP BREAKER</span>
            <SkeuoSwitch
              checked={airGapActive}
              onChange={(val) => {
                setAirGapActive(val);
                sounds.playSwitch();
              }}
              label="AIR-GAP"
              color="emerald"
            />
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {airGapActive ? '100% ISOLATED' : 'PASS-THROUGH'}
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 12: SUPPORTED DOCUMENTS & MODELS (CARTRIDGE BAYS)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-purple-400">
            <HardDrive className="w-3.5 h-3.5" />
            <span>MODULAR COMPATIBILITY BAYS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Supported Documents & Models
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Hot-swappable physical cartridge slots for multi-format document types and local model architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Document Cartridge Slots */}
          <div className="skeuo-chassis p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Document Cartridge Formats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              {['.PDF (pypdf)', '.DOCX (Word)', '.TXT (UTF-8)', '.MD (Markdown)', '.CSV (Tabular)', '.JSON (Structured)'].map((fmt, i) => (
                <div key={i} className="skeuo-inset p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-cyan-300 font-bold block">{fmt}</span>
                  <span className="text-[10px] text-slate-500">Auto-Ingest</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Cartridge Slots */}
          <div className="skeuo-chassis p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Local Model Architecture Slots
            </h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {[
                { name: 'Qwen 3.5 9B', type: 'Primary GPU Model' },
                { name: 'Google Gemma 2B/4B', type: 'Lightweight CPU/GPU' },
                { name: 'Nomic Embed v1.5', type: '768-D Vector Embedder' },
                { name: 'Standby Synthesizer', type: 'Zero-Crash Fallback' }
              ].map((m, i) => (
                <div key={i} className="skeuo-inset p-3 rounded-xl border border-slate-800">
                  <span className="text-purple-300 font-bold block truncate">{m.name}</span>
                  <span className="text-[10px] text-slate-500">{m.type}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 13: TECHNICAL ARCHITECTURE (BLUEPRINT SCHEMATIC)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENGINEERING BLUEPRINT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Technical Architecture
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Dark grid blueprint schematic showing internal loopback busses, DMA channels, and memory boundaries.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          {/* Blueprint Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff08_1px,transparent_1px),linear-gradient(to_bottom,#00ffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="skeuo-inset p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block text-sm">FRONTEND WORKSTATION</span>
              <p className="text-slate-400 leading-relaxed">
                React 19 + Vite 6 + Tailwind CSS v4. Pure digital skeuomorphic tokens, analog meters, and Three.js 3D spatial knowledge maps.
              </p>
            </div>

            <div className="skeuo-inset p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold block text-sm">FASTAPI BACKEND CORE</span>
              <p className="text-slate-400 leading-relaxed">
                Python 3.13 + Uvicorn at 127.0.0.1:8000. Multi-format document parser, recursive chunker, and in-memory NumPy cosine similarity matrix.
              </p>
            </div>

            <div className="skeuo-inset p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">LOCAL INFERENCE ENGINE</span>
              <p className="text-slate-400 leading-relaxed">
                Bionic / LM Studio at 127.0.0.1:1234/v1. Air-gapped local GPU inference streaming typewriter tokens via Server-Sent Events (SSE).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 14: INTERACTIVE DEMO (LIVE HANDS-ON WORKBENCH)
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-amber-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>HANDS-ON WORKBENCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Interactive Demo
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Test real air-gap retrieval directly on this landing page. Click a sample query or type your own to watch the meters deflect!
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* Query Selector Buttons */}
          <div className="flex flex-wrap gap-2.5 font-mono text-xs">
            {[
              'How does ContextOS guarantee 100% offline air-gap privacy?',
              'What is the token overlap ratio in recursive chunking?',
              'How does the 768-D vector bus calculate cosine proximity?'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => { setDemoQuery(q); sounds.playKeyClick(); }}
                className={`px-3.5 py-2 rounded-xl text-left cursor-pointer ${
                  demoQuery === q ? 'skeuo-btn text-cyan-300 font-bold' : 'skeuo-inset text-slate-400'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Interactive Input Bar */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={demoQuery}
              onChange={(e) => setDemoQuery(e.target.value)}
              className="flex-1 skeuo-inset p-3.5 rounded-xl font-mono text-xs text-white outline-none border border-slate-700 focus:border-cyan-400"
            />
            <button
              onClick={handleRunDemo}
              disabled={demoStreaming}
              className="skeuo-btn-primary px-6 py-3.5 rounded-xl font-mono text-xs font-bold text-white uppercase tracking-wider cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>{demoStreaming ? 'STREAMING...' : 'RUN AIR-GAP RETRIEVAL'}</span>
            </button>
          </div>

          {/* Live Meter & Output Screen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-center">
            
            {/* Deflecting Meter */}
            <div className="flex flex-col items-center">
              <SkeuoMeter
                value={demoMeterVal}
                label="LIVE MATCH SCORE"
                unit="COSINE"
                min={0}
                max={1}
                width={240}
                height={130}
              />
              <span className="text-xs font-mono text-cyan-400 font-bold mt-1">
                {(demoMeterVal * 100).toFixed(1)}% PROXIMITY
              </span>
            </div>

            {/* Streamed Typewriter Output */}
            <div className="md:col-span-2 skeuo-screen p-5 rounded-2xl border border-cyan-500/30 min-h-[140px] font-mono text-xs text-cyan-200 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 text-[10px] block mb-1">SYNTHESIZED AIR-GAP OUTPUT:</span>
                <p className="leading-relaxed">
                  {demoOutput || 'Click "RUN AIR-GAP RETRIEVAL" to see typewriter response streamed locally...'}
                  {demoStreaming && <span className="inline-block w-2 h-3.5 ml-1 bg-cyan-400 animate-pulse" />}
                </p>
              </div>
              <div className="pt-2 border-t border-cyan-500/20 text-[10px] text-slate-500 flex justify-between">
                <span>SOURCE: AirGap_Security_Spec.docx (Page 1)</span>
                <span className="text-emerald-400">GROUNDED FACT</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 15: DEVELOPER / OPEN SOURCE
          ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-xs font-mono text-emerald-400">
            <Key className="w-3.5 h-3.5" />
            <span>COLLEGE LAB REPOSITORY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Developer / Open Source
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Inspect the complete codebase on GitHub. Clone, install dependencies, and launch locally in under two minutes.
          </p>
        </div>

        <div className="skeuo-chassis p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* CLI Code Card */}
          <div className="skeuo-screen p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span>bash // quickstart_install.sh</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("git clone https://github.com/pranav-6944/ContextOS.git\ncd ContextOS\npip install -r requirements.txt\npython run.py");
                  setCopiedCode(true);
                  sounds.playKeyClick();
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="skeuo-btn px-2.5 py-1 rounded text-[11px] text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
            <pre className="text-cyan-300 overflow-x-auto py-2">
{`# 1. Clone repository
git clone https://github.com/pranav-6944/ContextOS.git
cd ContextOS

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Launch single-command unified server
python run.py`}
            </pre>
          </div>

          {/* GitHub Repo Spec Plate */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="font-mono text-xs text-slate-400">
              MIT License • Built by Pranav for AGAI Lab Project Showcase
            </div>
            <a
              href="https://github.com/pranav-6944/ContextOS"
              target="_blank"
              rel="noreferrer"
              className="skeuo-btn px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white flex items-center gap-2 cursor-pointer hover:border-cyan-400 transition-all"
            >
              <span>GitHub: pranav-6944/ContextOS</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 16: FINAL CTA — BUILD WITH YOUR CONTEXT
          ==================================================================== */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="skeuo-chassis p-10 sm:p-14 rounded-3xl border border-cyan-500/40 text-center space-y-8 relative overflow-hidden shadow-2xl">
          
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              IGNITION WORKSTATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              Build With Your Context.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-xl mx-auto">
              Drop your confidential PDFs, connect your local LM Studio / Bionic engine, and operate your private intelligence console.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => { sounds.playSwitch(); setView('dashboard'); }}
              className="skeuo-btn-primary px-8 py-4 rounded-xl text-white font-bold text-sm font-mono tracking-wider flex items-center gap-3 cursor-pointer shadow-xl"
            >
              <Terminal className="w-4 h-4 text-cyan-200" />
              <span>ENGAGE CONSOLE NOW</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </button>
            <button
              onClick={() => { sounds.playSwitch(); setView('docs'); }}
              className="skeuo-btn px-6 py-4 rounded-xl text-slate-200 font-mono text-sm tracking-wider cursor-pointer"
            >
              <span>READ ARCHITECTURE MANUAL</span>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3 font-mono text-xs text-slate-500">
            <span>SERIAL // CTX-MK4-994-LOCAL</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">READY TO OPERATE</span>
          </div>

        </div>
      </section>

    </div>
  );
}
