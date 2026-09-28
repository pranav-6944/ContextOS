import React from 'react';
import { Shield, Terminal, BookOpen, Key, FileText, Cookie, Cpu, ExternalLink } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="w-full skeuo-chassis border-t border-slate-700/80 mt-20 pt-16 pb-12 px-6 shadow-2xl relative">
      {/* Corner Screws */}
      <div className="absolute top-4 left-4 w-3.5 h-3.5 skeuo-screw" />
      <div className="absolute top-4 right-4 w-3.5 h-3.5 skeuo-screw" />
      <div className="absolute bottom-4 left-4 w-3.5 h-3.5 skeuo-screw" />
      <div className="absolute bottom-4 right-4 w-3.5 h-3.5 skeuo-screw" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
        
        {/* Brand & Specification */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl skeuo-inset p-1.5 flex items-center justify-center border border-slate-700">
              <img src="/logo.svg" alt="ContextOS" className="w-full h-full drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-slate-100 uppercase font-mono">
                Context<span className="text-cyan-400">OS</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">AIR-GAP NEURAL APPARATUS</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm">
            Tactile skeuomorphic document intelligence console. Engineered with 768-D dense mathematical embeddings and strictly local LLM inference via Bionic & LM Studio.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg skeuo-inset border border-slate-800 text-[11px] font-mono text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>100% AIR-GAPPED HARDWARE RUNTIME</span>
          </div>
        </div>

        {/* Console & Tools */}
        <div className="space-y-3 font-mono">
          <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>OPERATING DECK</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => setView('dashboard')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                Hardware Console
              </button>
            </li>
            <li>
              <button onClick={() => setView('docs')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                Technical Manual
              </button>
            </li>
            <li>
              <button onClick={() => setView('auth')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                Operator Clearance
              </button>
            </li>
            <li>
              <button onClick={() => setView('landing')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                Console Deck
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="space-y-3 font-mono">
          <h4 className="text-xs uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>GOVERNANCE</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => setView('terms')} className="hover:text-purple-300 transition-colors cursor-pointer">
                Terms & Conditions
              </button>
            </li>
            <li>
              <button onClick={() => setView('cookies')} className="hover:text-purple-300 transition-colors cursor-pointer">
                Storage & Cookies
              </button>
            </li>
            <li>
              <button onClick={() => setView('privacy')} className="hover:text-purple-300 transition-colors cursor-pointer">
                Air-Gap Privacy Guarantee
              </button>
            </li>
            <li>
              <span className="text-slate-600">MIT Open License</span>
            </li>
          </ul>
        </div>

        {/* Technical Infrastructure & Repo */}
        <div className="space-y-3 font-mono">
          <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>LAB ARTIFACT</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Architected by Pranav for AGAI Lab showcase.
          </p>
          <a
            href="https://github.com/pranav-6944/ContextOS"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl skeuo-btn text-slate-200 text-xs font-mono font-bold tracking-wider hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub Spec</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
        <div>&copy; {new Date().getFullYear()} ContextOS. Pure Skeuomorphic Tactile Hardware RAG Platform.</div>
        <div className="flex items-center gap-3">
          <span className="skeuo-inset px-2.5 py-1 rounded text-[10px] text-cyan-400">CHASSIS SERIAL // CTX-994-AIRGAP-LOCAL</span>
        </div>
      </div>
    </footer>
  );
}

