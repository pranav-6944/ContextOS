import React from 'react';
import { Terminal, BookOpen, Key, Shield, ExternalLink, Cpu, Lock, Unlock } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setView, 
  bionicStatus, 
  isAuthenticated = false, 
  operatorId = 'ADMIN-01', 
  onLogout 
}) {
  const isOnline = bionicStatus?.online;

  return (
    <header className="sticky top-0 z-50 w-full skeuo-chassis border-b border-slate-700/80 px-6 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Nameplate */}
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-10 px-2.5 py-1 rounded-xl skeuo-inset flex items-center justify-center group-hover:scale-[1.02] transition-transform border border-slate-700 bg-slate-900/60 shadow-inner">
            <img 
              src="/Horizontal_stack_logo.png" 
              alt="ContextOS Logo" 
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
            />
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold tracking-widest uppercase hidden lg:block">
            MK-IV
          </span>
        </div>

        {/* Center Hardware Selector Keys */}
        <nav className="hidden md:flex items-center gap-1.5 skeuo-inset p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setView('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'skeuo-btn text-cyan-300 border-cyan-500/50 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Deck
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'skeuo-btn text-cyan-300 border-cyan-500/50 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Console
          </button>
          <button 
            onClick={() => setView('docs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'docs'
                ? 'skeuo-btn text-cyan-300 border-cyan-500/50 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Schematics
          </button>
          <button 
            onClick={() => setView('auth')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'auth'
                ? 'skeuo-btn text-cyan-300 border-cyan-500/50 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {isAuthenticated ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 skeuo-diode-emerald" />
                <span>Clearance: Active</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 skeuo-diode-amber" />
                <span>Clearance: Locked</span>
              </>
            )}
          </button>
        </nav>

        {/* Right Status Diode & Quick Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Diode Module */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg skeuo-inset font-mono text-[11px] text-slate-300 border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'skeuo-diode-emerald' : 'skeuo-diode-amber'}`} />
            <span className="tracking-wider uppercase font-semibold">
              {isOnline ? 'Bionic Online' : 'Standby Synth'}
            </span>
          </div>

          {/* Authentication Badge & Lock/Logout Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 skeuo-inset p-1 rounded-xl border border-slate-800">
              <div className="px-2.5 py-1 font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 skeuo-diode-emerald" />
                <span className="hidden xl:inline">{operatorId} // </span>
                <span>LVL-4</span>
              </div>
              <button
                onClick={onLogout}
                className="skeuo-btn px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-all"
                title="Lock Terminal & Revoke RAG Clearance"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>LOCK</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView('auth')}
              className="skeuo-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer border border-cyan-500/30"
              title="Authenticate Operator to Unlock RAG Pipeline"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AUTHENTICATE</span>
              <span className="sm:hidden">LOGIN</span>
            </button>
          )}

          {/* GitHub Repository */}
          <a
            href="https://github.com/pranav-6944/ContextOS"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl skeuo-btn text-slate-300 hover:text-white transition-all cursor-pointer hidden md:block"
            title="GitHub Hardware Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* Launch Console Action */}
          {currentView !== 'dashboard' ? (
            <button
              onClick={() => setView('dashboard')}
              className="skeuo-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-300" />
              <span>Engage Console</span>
            </button>
          ) : (
            <button
              onClick={() => setView('landing')}
              className="skeuo-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-200 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <span>Return to Deck</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

