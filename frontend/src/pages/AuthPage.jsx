import React, { useState } from 'react';
import { Shield, Lock, Unlock, Key, Fingerprint, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function AuthPage({ 
  setView, 
  isAuthenticated = false, 
  operatorId = 'ADMIN-01', 
  onLoginSuccess, 
  onLogout 
}) {
  const [currentOpId, setCurrentOpId] = useState(operatorId || 'ADMIN-01');
  const [pinDigits, setPinDigits] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keypad click handler
  const handleKeypadPress = (val) => {
    soundManager.playKeyClick();
    setErrorMessage('');
    if (val === 'CLR') {
      setPinDigits('');
    } else if (val === 'DEL') {
      setPinDigits(prev => prev.slice(0, -1));
    } else {
      if (pinDigits.length < 6) {
        const nextDigits = pinDigits + val;
        setPinDigits(nextDigits);
        // Auto-authenticate if 4 or more digits entered and user presses submit or reaches 4
      }
    }
  };

  // Biometric touch scan
  const handleSimulateScan = () => {
    soundManager.playRelayEngage();
    setIsScanning(true);
    setErrorMessage('');
    setTimeout(() => {
      soundManager.playRelayEngage();
      setIsScanning(false);
      setAuthSuccess(true);
      if (onLoginSuccess) {
        onLoginSuccess(currentOpId || 'ADMIN-01');
      }
      setTimeout(() => {
        setView('dashboard');
      }, 1100);
    }, 1400);
  };

  // Form or Keypad submit
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    soundManager.playSwitch();
    setAuthSuccess(true);
    if (onLoginSuccess) {
      onLoginSuccess(currentOpId || 'ADMIN-01');
    }
    setTimeout(() => {
      setView('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-xl mx-auto flex flex-col justify-center">
      
      {/* Return to Deck Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            soundManager.playKeyClick();
            setView('landing');
          }}
          className="skeuo-btn px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Workstation Deck</span>
        </button>

        <span className="text-[10px] font-mono text-slate-500 uppercase">
          SECURITY PROTOCOL: ISO-LOCAL-RAG
        </span>
      </div>

      {/* Main Skeuomorphic Terminal Enclosure */}
      <div className="skeuo-chassis p-6 sm:p-10 rounded-3xl relative overflow-hidden border border-slate-700/80 shadow-2xl">
        
        {/* Four Corner Screw Rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 skeuo-screw" />
        <div className="absolute top-3 right-3 w-3 h-3 skeuo-screw" />
        <div className="absolute bottom-3 left-3 w-3 h-3 skeuo-screw" />
        <div className="absolute bottom-3 right-3 w-3 h-3 skeuo-screw" />

        {/* Console Header with Official Vertical Stack Logo */}
        <div className="text-center space-y-3 mb-8 flex flex-col items-center">
          <div className="p-3.5 rounded-2xl skeuo-inset border border-slate-700 bg-slate-900/80 shadow-inner">
            <img 
              src="/Vertical_stack_logo.png" 
              alt="ContextOS Security Seal" 
              className="h-20 w-auto object-contain filter drop-shadow-[0_0_14px_rgba(6,182,212,0.5)]" 
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-[11px] font-mono text-cyan-400">
            <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'skeuo-diode-emerald' : 'skeuo-diode-cyan'}`} />
            <span>OPERATOR CLEARANCE TERMINAL MK-IV</span>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Air-Gapped Machine Clearance • Local Inference Bus Gating
          </p>
        </div>

        {/* STATE A: Already Logged In / Authenticated */}
        {isAuthenticated && !authSuccess ? (
          <div className="skeuo-inset p-6 sm:p-8 rounded-2xl text-center space-y-6 border border-emerald-500/30">
            <div className="w-16 h-16 mx-auto rounded-2xl skeuo-diode-green flex items-center justify-center text-white shadow-xl">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold font-mono text-emerald-400 tracking-wider">
                CLEARANCE LEVEL-4 ACTIVE
              </div>
              <div className="text-xs font-mono text-slate-300">
                Operator Authenticated: <span className="text-cyan-400 font-bold">{operatorId}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                Full privileges granted to query RAG Studio and ingest dossiers.
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  soundManager.playKeyClick();
                  setView('dashboard');
                }}
                className="flex-1 py-3 px-4 rounded-xl skeuo-btn-primary text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Engage RAG Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playSwitch();
                  if (onLogout) onLogout();
                }}
                className="py-3 px-4 rounded-xl skeuo-btn text-amber-400 hover:text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-amber-500/30"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Lock Terminal</span>
              </button>
            </div>
          </div>
        ) : authSuccess ? (
          /* STATE B: Authorization Transition Splash */
          <div className="skeuo-inset p-8 rounded-2xl text-center space-y-4 border border-emerald-500/40">
            <div className="w-14 h-14 mx-auto rounded-full skeuo-diode-green flex items-center justify-center text-white animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-300">CLEARANCE VERIFIED</div>
            <p className="text-xs font-mono text-slate-300">
              Session key issued for Operator <span className="text-cyan-300 font-bold">[{currentOpId}]</span>. Unlocking RAG Studio...
            </p>
          </div>
        ) : (
          /* STATE C: Login / Clearance Gate Form */
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            
            {/* Operator Identifier Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex justify-between">
                <span>OPERATOR IDENTIFIER</span>
                <span className="text-cyan-400">BUS://AIR-GAP</span>
              </label>
              <div className="skeuo-inset rounded-xl p-1.5">
                <input
                  type="text"
                  value={currentOpId}
                  onChange={(e) => setCurrentOpId(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm font-mono text-white outline-none"
                  placeholder="e.g. OPERATOR-01"
                />
              </div>
            </div>

            {/* PIN Indicator Display */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex justify-between">
                <span>HARDWARE MASTER PIN / KEY</span>
                <span className="text-slate-400 font-mono text-[10px]">Enter Any Keypad Code</span>
              </label>
              <div className="skeuo-screen rounded-xl p-3 flex items-center justify-center gap-3">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                      pinDigits.length > idx
                        ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] scale-110'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tactile 12-Key Mechanical Keypad */}
            <div className="skeuo-inset p-3.5 rounded-2xl">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold text-center mb-2.5">
                TACTILE MECHANICAL NUMPAD
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleKeypadPress(val)}
                    className="skeuo-btn py-3 rounded-xl font-mono font-bold text-sm text-slate-200 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                  >
                    {val === 'DEL' ? '⌫' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Biometric Touch Sensor Section */}
            <div className="p-4 skeuo-inset rounded-2xl flex items-center justify-between border border-slate-800">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span>Optical Thumbprint Sensor</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Touch sensor to simulate biometric scan
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className={`w-14 h-14 rounded-2xl skeuo-btn flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${
                  isScanning ? 'scale-95 shadow-inner border-cyan-400' : ''
                }`}
                title="Press to scan biometric thumbprint"
              >
                {/* Laser scan line effect */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-[bounce_1s_infinite]" />
                )}
                <Fingerprint className={`w-7 h-7 transition-colors ${
                  isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-400 hover:text-cyan-300'
                }`} />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">SCAN</span>
              </button>
            </div>

            {/* Submit & Demo Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl skeuo-btn-primary text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>AUTHENTICATE & UNLOCK RAG STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playKeyClick();
                  handleLoginSubmit();
                }}
                className="w-full py-2 rounded-xl skeuo-btn text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Instant Demo Bypass (Auto-Clearance)</span>
              </button>
            </div>

            {/* Air-gap security note */}
            <div className="text-center text-[10px] font-mono text-slate-500">
              🔒 100% Local Validation. Zero telemetry emitted. Machine air-gap enforced.
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
