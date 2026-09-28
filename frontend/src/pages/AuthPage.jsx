import React, { useState } from 'react';
import { Shield, Lock, Key, Fingerprint, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthPage({ setView }) {
  const [operatorId, setOperatorId] = useState('ADMIN-01');
  const [accessKey, setAccessKey] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAuthSuccess(true);
      setTimeout(() => {
        setView('dashboard');
      }, 1200);
    }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthSuccess(true);
    setTimeout(() => {
      setView('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen py-16 px-6 max-w-xl mx-auto flex flex-col justify-center">
      
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => setView('landing')}
          className="skeuo-btn px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Master Console</span>
        </button>
      </div>

      {/* Main Skeuomorphic Terminal Enclosure */}
      <div className="skeuo-chassis p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-slate-700">
        
        {/* Screw Rivets */}
        <div className="absolute top-3 left-3 skeuo-screw" />
        <div className="absolute top-3 right-3 skeuo-screw" />
        <div className="absolute bottom-3 left-3 skeuo-screw" />
        <div className="absolute bottom-3 right-3 skeuo-screw" />

        {/* Console Header with Official Vertical Stack Logo */}
        <div className="text-center space-y-3 mb-8 flex flex-col items-center">
          <div className="p-3 rounded-2xl skeuo-inset border border-slate-700 bg-slate-900/80 shadow-inner">
            <img 
              src="/Vertical_stack_logo.png" 
              alt="ContextOS Security Emblem" 
              className="h-20 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]" 
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-[11px] font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 skeuo-diode-cyan" />
            <span>OPERATOR CLEARANCE TERMINAL</span>
          </div>
          <p className="text-xs font-mono text-slate-400">Air-Gapped Local Machine Authentication</p>
        </div>

        {authSuccess ? (
          <div className="skeuo-inset p-8 rounded-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full skeuo-diode-green flex items-center justify-center text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-lg font-bold text-white">CLEARANCE GRANTED</div>
            <p className="text-xs font-mono text-emerald-400">Operator token verified. Launching Operating Console...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Operator ID Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-bold flex justify-between">
                <span>Operator Identifier</span>
                <span className="text-cyan-400">LOCAL://AUTH</span>
              </label>
              <div className="skeuo-inset rounded-xl p-1">
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-mono text-white outline-none"
                  placeholder="e.g. LAB-OPERATOR-01"
                />
              </div>
            </div>

            {/* Hardware PIN / Key */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-bold flex justify-between">
                <span>Hardware Master PIN</span>
                <span className="text-slate-500 font-mono text-[10px]">Optional for Local Dev</span>
              </label>
              <div className="skeuo-inset rounded-xl p-1">
                <input
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-mono text-white outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Biometric / Tap Sensor */}
            <div className="p-4 skeuo-inset rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200">Biometric Touch Sensor</div>
                <div className="text-[11px] font-mono text-slate-400">Simulate physical thumbprint verification</div>
              </div>
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className={`w-12 h-12 rounded-xl skeuo-btn flex items-center justify-center transition-all ${
                  isScanning ? 'scale-95 shadow-inner' : ''
                }`}
              >
                <Fingerprint className={`w-6 h-6 ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl skeuo-btn-primary text-white font-bold text-sm font-mono tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <span>AUTHENTICATE OPERATOR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Note */}
            <div className="text-center text-[10px] font-mono text-slate-500">
              Zero telemetry transmitted. Credentials authenticated locally on machine loopback.
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
