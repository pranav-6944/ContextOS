import React from 'react';
import { Layers, Terminal, Sparkles, Github, Cpu, Activity } from 'lucide-react';

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
            <Github className="w-4 h-4" />
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
