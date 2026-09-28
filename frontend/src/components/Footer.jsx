import React from 'react';
import { Layers, Github, Heart, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="w-full glass-panel border-t border-white/10 mt-20 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">ContextOS</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The next-generation 3D animated RAG platform powered by local LLMs via Bionic & LM Studio. Zero cloud dependency, 100% private document intelligence.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Air-Gapped Local Inference</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><button onClick={() => setView('dashboard')} className="hover:text-cyan-400 transition-colors">RAG Studio (Chat)</button></li>
            <li><button onClick={() => setView('dashboard')} className="hover:text-cyan-400 transition-colors">Document Vault</button></li>
            <li><button onClick={() => setView('dashboard')} className="hover:text-cyan-400 transition-colors">3D Neural Galaxy</button></li>
            <li><button onClick={() => setView('dashboard')} className="hover:text-cyan-400 transition-colors">Telemetry & Settings</button></li>
          </ul>
        </div>

        {/* Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Tech Stack</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> React 19 + Vite 6</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Tailwind CSS v4</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Three.js WebGL 3D</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Python 3.13 + FastAPI</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Bionic / LM Studio (localhost:1234)</li>
          </ul>
        </div>

        {/* Project Meta */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Open Source</h4>
          <p className="text-sm text-slate-400">
            Developed by Pranav as an advanced college AI laboratory showcase.
          </p>
          <a
            href="https://github.com/pranav-6944/ContextOS"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>&copy; {new Date().getFullYear()} ContextOS. Released under the MIT License.</div>
        <div className="flex items-center gap-2">
          <span>Engineered with 3D WebGL, 21st.dev tokens & Local AI</span>
        </div>
      </div>
    </footer>
  );
}
