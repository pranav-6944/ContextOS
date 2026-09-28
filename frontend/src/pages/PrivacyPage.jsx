import React from 'react';
import { Shield, Lock, Cpu, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage({ setView }) {
  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto space-y-8">
      
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
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
              HARDWARE DATA PROTECTION DIRECTIVE
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Air-Gapped Privacy & Security Guarantee
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-lg skeuo-inset text-xs font-mono text-emerald-400 self-start">
            AIR-GAP AUDIT: 100% VERIFIED
          </div>
        </div>

        {/* The 4 Physical Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          
          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg skeuo-diode-green flex items-center justify-center text-white text-xs font-bold">
              01
            </div>
            <h3 className="text-white font-bold text-sm">Zero External Egress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Neither user prompts, document extracts, nor generated answers are ever transmitted across external networks. The server listens exclusively on loopback IP 127.0.0.1.
            </p>
          </div>

          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg skeuo-diode-cyan flex items-center justify-center text-white text-xs font-bold">
              02
            </div>
            <h3 className="text-white font-bold text-sm">Local Silicon Processing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inference is computed entirely by your workstation's local GPU or CPU via Bionic / LM Studio. No training on your private documents takes place.
            </p>
          </div>

          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg skeuo-diode-amber flex items-center justify-center text-white text-xs font-bold">
              03
            </div>
            <h3 className="text-white font-bold text-sm">Local Vector Persistence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracted chunks and high-dimensional vectors are stored locally in data/vector_store.json on your hard drive, easily inspectable with any text editor.
            </p>
          </div>

          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg skeuo-diode-green flex items-center justify-center text-white text-xs font-bold">
              04
            </div>
            <h3 className="text-white font-bold text-sm">Instant Hard Wipe Capability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deleting any document from the Document Vault instantly deletes all associated chunks, embeddings, and indices from memory and disk.
            </p>
          </div>

        </div>

        {/* Verification Check */}
        <div className="p-5 skeuo-inset rounded-2xl flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div className="text-xs font-mono text-slate-300">
            <strong>Audit Verification:</strong> You can disconnect your workstation from Wi-Fi or Ethernet completely; ContextOS and Bionic will continue running at 100% capacity with zero interruption.
          </div>
        </div>

      </div>

    </div>
  );
}
