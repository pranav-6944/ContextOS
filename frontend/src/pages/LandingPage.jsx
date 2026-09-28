import React, { useState } from 'react';
import { 
  Terminal, Sparkles, Shield, Cpu, Zap, Database, 
  Layers, Compass, ArrowRight, CheckCircle2, ChevronDown, 
  ChevronUp, Lock, RefreshCw, Eye, HardDrive, BarChart3
} from 'lucide-react';
import Hero3DCanvas from '../components/Hero3DCanvas';

export default function LandingPage({ setView, bionicStatus, stats }) {
  const [activePipelineStage, setActivePipelineStage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const pipelineStages = [
    {
      step: '01',
      title: 'Multi-Format Ingestion',
      subtitle: 'PDF, DOCX, TXT, Markdown, CSV & JSON',
      desc: 'Documents are parsed into semantic page segments with hierarchical preservation of titles and paragraphs.',
      tech: 'pypdf + python-docx + Native Serializers',
      payload: 'Raw Bytes ➔ Clean Text Hierarchy with Page Metadata'
    },
    {
      step: '02',
      title: 'Recursive Character Chunking',
      subtitle: 'Sentence & Paragraph Preservation',
      desc: 'Texts are segmented into 600-character windows with 120-character overlapping boundaries to preserve narrative coherence.',
      tech: 'Recursive Character Splitter (Multi-Separators)',
      payload: 'Window Size: 600 chars | Overlap: 120 chars | Token Tags'
    },
    {
      step: '03',
      title: '768-D Vector Embeddings',
      subtitle: 'Nomic Embed v1.5 / Local Neural Vectors',
      desc: 'Every chunk is projected into high-dimensional semantic space where conceptual synonyms naturally cluster together.',
      tech: 'Bionic LM Studio Endpoint (text-embedding-nomic-embed-text-v1.5)',
      payload: 'Dimension: 768-D | L2 Normalized (||v|| = 1.0)'
    },
    {
      step: '04',
      title: 'Cosine Nearest-Neighbor Search',
      subtitle: 'Dot-Product Semantic Similarity',
      desc: 'Incoming user queries are embedded into the same 768-D space. Top-K nearest chunks are scored in sub-milliseconds.',
      tech: 'Vectorized NumPy Dot Product (q • c)',
      payload: 'Top-K: 4 | Precision: 0.0001 | Latency: <10ms'
    },
    {
      step: '05',
      title: 'Local LLM Streaming Inference',
      subtitle: 'OpenAI-Compatible Bionic Engine',
      desc: 'Retrieved context is synthesized into an augmented prompt and streamed via Server-Sent Events (SSE) directly to the HUD.',
      tech: 'Qwen 3.5 / Gemma via http://localhost:1234/v1',
      payload: 'Streaming SSE: Tokens + Live Citations + Telemetry'
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
      q: 'How does the 3D Neural Galaxy visualize high-dimensional vectors?',
      a: 'Document chunks live in a 768-dimensional latent vector space. ContextOS applies Principal Component Analysis (PCA) and Singular Value Decomposition (SVD) to mathematically project these vectors into 3D Euclidean coordinates (x, y, z), rendering them as interactive WebGL constellations.'
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
    <div className="min-h-screen flex flex-col bg-[#05070f] text-slate-100 cyber-grid">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-7 space-y-6 z-10">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ContextOS v2.5 • Next-Gen Local RAG Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            The <span className="gradient-text-cyan-purple">3D Operating System</span> for Local Document Intelligence.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            Say goodbye to flat, generic Streamlit dashboards. Chat with multi-format documents using 
            <strong className="text-slate-200"> 100% private local LLMs </strong> 
            powered by Bionic & LM Studio, with interactive 3D WebGL neural topology and laser-targeted source citations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Interactive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium text-sm transition-all"
            >
              <span>Explore 3D Pipeline</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold font-mono text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 font-mono">Air-Gapped Privacy</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-purple-400">768-D</div>
              <div className="text-xs text-slate-400 font-mono">Vector Dimension</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">&lt;12ms</div>
              <div className="text-xs text-slate-400 font-mono">Retrieval Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">0$</div>
              <div className="text-xs text-slate-400 font-mono">Cloud API Fees</div>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Interactive Hero Canvas */}
        <div className="lg:col-span-5 h-[400px] lg:h-[480px] w-full glass-panel rounded-3xl relative overflow-hidden neon-border-cyan flex items-center justify-center">
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[11px] font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Interactive 3D Neural Nucleus</span>
          </div>
          <Hero3DCanvas />
        </div>

      </section>

      {/* 21ST.DEV BENTO GRID SECTION */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">Architecture Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered Beyond the Limitations of Basic Web Apps
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            ContextOS pairs high-dimensional spatial mathematics with local hardware acceleration to deliver a professional-grade intelligence workspace.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 3D Neural Constellation (Col Span 2) */}
          <div className="md:col-span-2 glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Spatial 3D Neural Constellation</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Vector embeddings are reduced via Principal Component Analysis (PCA) and rendered in WebGL space. Inspect knowledge clusters, track synaptic connections, and watch laser conduits connect queries directly to source nodes.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-cyan-400 pt-4 border-t border-white/10">
              <span>• PCA Spatial Projection</span>
              <span>• Real-Time Orbit Controls</span>
              <span>• Raycasted Node Inspection</span>
            </div>
          </div>

          {/* Card 2: 100% Local GPU */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">100% Air-Gapped Privacy</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Zero outbound telemetry. Your documents never touch cloud servers. Powered locally via LM Studio / Bionic across Apple Silicon, CUDA, or Vulkan.
            </p>
            <div className="text-xs font-mono text-purple-400 pt-2">
              Endpoint: http://localhost:1234/v1
            </div>
          </div>

          {/* Card 3: Multi-Format Vault */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Multi-Format Vault</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Drag-and-drop ingestion of PDFs, DOCX, TXT, Markdown, CSV, and JSON with structural metadata and page-level numbering preserved.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-2">
              Formats: PDF • DOCX • TXT • MD • CSV • JSON
            </div>
          </div>

          {/* Card 4: Laser Retrieval (Col Span 2) */}
          <div className="md:col-span-2 glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Adaptive Standby Synthesizer & Telemetry</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Real-time Server-Sent Events (SSE) stream tokens with token-per-second counters, retrieval latency metrics, and interactive citation badges that highlight source text on click.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-amber-400 pt-4 border-t border-white/10">
              <span>• Typewriter SSE Streaming</span>
              <span>• Interactive Citations</span>
              <span>• Standby Fallback Engine</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3D PIPELINE EXPLORER SECTION */}
      <section id="pipeline" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">End-To-End Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Interactive 5-Stage RAG Execution Pipeline
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Click through each pipeline stage to inspect the algorithms, intermediate data transformations, and technical parameters.
          </p>
        </div>

        {/* Stage Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {pipelineStages.map((stage, idx) => (
            <button
              key={stage.step}
              onClick={() => setActivePipelineStage(idx)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-mono text-xs transition-all ${
                activePipelineStage === idx
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/25 scale-105'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="opacity-60">{stage.step}</span>
              <span>{stage.title}</span>
            </button>
          ))}
        </div>

        {/* Active Stage Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-4xl mx-auto border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                STAGE {pipelineStages[activePipelineStage].step} OF 05
              </span>
              <span className="text-xs font-mono text-slate-400">
                {pipelineStages[activePipelineStage].tech}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {pipelineStages[activePipelineStage].title}
              </h3>
              <p className="text-sm font-mono text-cyan-400 mt-1">
                {pipelineStages[activePipelineStage].subtitle}
              </p>
            </div>

            <p className="text-slate-300 text-base leading-relaxed">
              {pipelineStages[activePipelineStage].desc}
            </p>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200">
              <span className="text-slate-400 uppercase text-[10px] block mb-1">Payload Transformation:</span>
              <code>{pipelineStages[activePipelineStage].payload}</code>
            </div>
          </div>
        </div>
      </section>

      {/* BENCHMARKS & COMPATIBILITY MATRIX */}
      <section id="benchmarks" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">Performance Comparison</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            ContextOS vs. Traditional Streamlit Architectures
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Why building with modern full-stack technologies outperforms basic scripting tools.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-xs font-mono uppercase text-slate-400">
                <tr>
                  <th className="p-4 sm:p-6">Feature Metric</th>
                  <th className="p-4 sm:p-6 text-cyan-400 font-bold">ContextOS (Full-Stack)</th>
                  <th className="p-4 sm:p-6 text-slate-400">Standard Streamlit RAG</th>
                  <th className="p-4 sm:p-6 text-slate-400">Cloud Web SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs sm:text-sm">
                <tr>
                  <td className="p-4 sm:p-6 text-white font-medium">3D Vector Visualization</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ WebGL 60FPS Three.js</td>
                  <td className="p-4 sm:p-6 text-rose-400">✗ None (Flat Lists)</td>
                  <td className="p-4 sm:p-6 text-amber-400">⚠ Paid Enterprise Only</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 text-white font-medium">Local GPU Privacy</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ 100% Air-Gapped</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ Local (Basic)</td>
                  <td className="p-4 sm:p-6 text-rose-400">✗ Cloud Leakage Risk</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 text-white font-medium">Interactive Citations</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ Slide-out Inspector</td>
                  <td className="p-4 sm:p-6 text-amber-400">⚠ Raw Text Dump</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ Supported</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 text-white font-medium">Model Offline Resilience</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ Standby Synthesizer</td>
                  <td className="p-4 sm:p-6 text-rose-400">✗ Crashes / Connection Error</td>
                  <td className="p-4 sm:p-6 text-rose-400">✗ Fails on Outage</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 text-white font-medium">UI / UX Modernity</td>
                  <td className="p-4 sm:p-6 text-emerald-400 font-semibold">✓ 21st.dev Cyber-Glass</td>
                  <td className="p-4 sm:p-6 text-rose-400">✗ Default Generic Layout</td>
                  <td className="p-4 sm:p-6 text-slate-300">Standard SaaS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">Common Inquiries</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between text-base font-medium text-white hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-cyan-500/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Explore Your Documents in 3D?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Launch the interactive dashboard, upload your notes or papers, and experience local-first retrieval augmented generation.
            </p>
          </div>
          <button
            onClick={() => setView('dashboard')}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            <Terminal className="w-5 h-5" />
            <span>Launch ContextOS Dashboard</span>
          </button>
        </div>
      </section>

    </div>
  );
}
