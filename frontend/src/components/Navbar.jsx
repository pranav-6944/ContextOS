import React from 'react';
import { Layers, Terminal, Sparkles, Cpu, Activity } from 'lucide-react';

export default function Navbar({ currentView, setView, bionicStatus }) {
  const isOnline = bionicStatus?.online;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ContextOS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold tracking-wider uppercase">
                3D RAG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Local-First Neural OS</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm font-medium">
          <button 
            onClick={() => { setView('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => { setView('landing'); setTimeout(() => document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            3D Pipeline
          </button>
          <button 
            onClick={() => { setView('landing'); setTimeout(() => document.getElementById('benchmarks')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Benchmarks
          </button>
          <button 
            onClick={() => { setView('landing'); setTimeout(() => document.getElementById('specs')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Architecture
          </button>
        </nav>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          
          {/* Bionic Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 font-mono text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse'}`} />
            <span>{isOnline ? 'Bionic GPU' : 'Standby Engine'}</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/pranav-6944/ContextOS"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* Launch Dashboard / Landing Switcher */}
          {currentView === 'landing' ? (
            <button
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-sm transition-all"
            >
              <span>Back to Home</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
