import React from 'react';
import { Shield, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function TermsPage({ setView }) {
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

      {/* Main Specimen Enclosure */}
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
              LEGAL SPECIFICATION SPEC-01/REV-2
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Terms & Operational Conditions
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-lg skeuo-inset text-xs font-mono text-emerald-400 self-start">
            STATUS: ACTIVE // AIR-GAPPED
          </div>
        </div>

        {/* Content Clauses */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-mono">
          
          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className="text-cyan-400">§ 1.</span> Local-First Hardware Execution
            </h3>
            <p className="text-xs text-slate-400">
              ContextOS is provided as a local-first software console. All vector computations, text extractions (PDF, DOCX, TXT, CSV), and neural generations execute solely within the host computer’s local runtime (via Bionic / LM Studio on 127.0.0.1:1234). The software does not transmit files or prompts to external telemetry servers.
            </p>
          </div>

          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className="text-cyan-400">§ 2.</span> Open Source MIT License
            </h3>
            <p className="text-xs text-slate-400">
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.
            </p>
          </div>

          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className="text-cyan-400">§ 3.</span> Document Ownership & Privacy
            </h3>
            <p className="text-xs text-slate-400">
              The user retains 100% intellectual property, confidentiality, and ownership rights over any documents uploaded into the Document Vault or embedded into local vector indexes.
            </p>
          </div>

          <div className="skeuo-inset p-5 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className="text-cyan-400">§ 4.</span> Limitation of Hardware Liability
            </h3>
            <p className="text-xs text-slate-400">
              The software is provided "as is", without warranty of any kind, express or implied. Under no circumstances shall the authors or project creators be liable for any claim, damages, or GPU/hardware thermal throttling arising from local inference.
            </p>
          </div>

        </div>

        {/* Footer Seal */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>EFFECTIVE: SEPTEMBER 2026 // LAB RELEASE</div>
          <div className="text-cyan-400">CONTEXT-OS // VERIFIED</div>
        </div>

      </div>

    </div>
  );
}
