import React, { useState } from 'react';
import { BookOpen, Terminal, Layers, Cpu, ArrowLeft, Copy, Check } from 'lucide-react';

export default function DocsPage({ setView }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen py-16 px-6 max-w-5xl mx-auto space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => setView('landing')}
        className="skeuo-btn px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Master Console</span>
      </button>

      {/* Main Enclosure */}
      <div className="skeuo-chassis p-8 sm:p-12 rounded-3xl relative border border-slate-700 space-y-8">
        
        {/* Four Rivets */}
        <div className="absolute top-3 left-3 skeuo-screw" />
        <div className="absolute top-3 right-3 skeuo-screw" />
        <div className="absolute bottom-3 left-3 skeuo-screw" />
        <div className="absolute bottom-3 right-3 skeuo-screw" />

        {/* Header Nameplate */}
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
              OPERATIONAL SCHEMATICS // DOCS-V2.5
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ContextOS Technical Manual & API Schematics
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-lg skeuo-inset text-xs font-mono text-cyan-400 self-start">
            REVISION: MK-IV // PRODUCTION
          </div>
        </div>

        {/* Section 1: Quickstart */}
        <div className="space-y-3 font-mono">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>1. Launching the Unified Console</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            ContextOS includes a single-command launcher that initializes the FastAPI backend and serves the compiled tactile console on port 8000:
          </p>
          <div className="skeuo-inset p-4 rounded-2xl relative group">
            <code className="text-xs text-cyan-300">python run.py</code>
            <button
              onClick={() => copyCode('python run.py', 1)}
              className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
            >
              {copiedIndex === 1 ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Section 2: Bionic Integration */}
        <div className="space-y-3 font-mono">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>2. Bionic / LM Studio Local LLM Setup</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ensure LM Studio or Bionic is running on its default OpenAI-compatible port with your preferred model:
          </p>
          <div className="skeuo-inset p-4 rounded-2xl space-y-2 text-xs text-slate-300">
            <div>• <strong className="text-white">Endpoint URL:</strong> <code className="text-cyan-400">http://localhost:1234/v1</code></div>
            <div>• <strong className="text-white">Embedding Model:</strong> <code className="text-cyan-400">text-embedding-nomic-embed-text-v1.5</code> (768 Dimensions)</div>
            <div>• <strong className="text-white">Chat Model:</strong> <code className="text-purple-400">qwen/qwen3.5-9b</code> or <code className="text-purple-400">google/gemma-4-e2b</code></div>
          </div>
        </div>

        {/* Section 3: REST API Endpoints */}
        <div className="space-y-3 font-mono">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>3. Hardware Controller REST API Matrix</span>
          </h2>
          
          <div className="skeuo-inset rounded-2xl overflow-hidden border border-white/5">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Method</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-3 text-cyan-400 font-bold">GET</td>
                  <td className="p-3 font-bold">/api/status</td>
                  <td className="p-3 text-slate-400">Returns Bionic connection status, model inventory, and vector stats.</td>
                </tr>
                <tr>
                  <td className="p-3 text-emerald-400 font-bold">POST</td>
                  <td className="p-3 font-bold">/api/upload</td>
                  <td className="p-3 text-slate-400">Multipart upload for PDF, DOCX, TXT, CSV. Parses, chunks, and indexes.</td>
                </tr>
                <tr>
                  <td className="p-3 text-cyan-400 font-bold">GET</td>
                  <td className="p-3 font-bold">/api/chunks</td>
                  <td className="p-3 text-slate-400">Returns stored chunks with 3D coordinates and metadata.</td>
                </tr>
                <tr>
                  <td className="p-3 text-purple-400 font-bold">POST</td>
                  <td className="p-3 font-bold">/api/query</td>
                  <td className="p-3 text-slate-400">Streams SSE events containing tokens, citations, and telemetry.</td>
                </tr>
                <tr>
                  <td className="p-3 text-amber-400 font-bold">POST</td>
                  <td className="p-3 font-bold">/api/preload-samples</td>
                  <td className="p-3 text-slate-400">Preloads built-in whitepapers into the local vector database.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
