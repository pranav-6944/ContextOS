import React from 'react';

export default function SkeuoMeter({ 
  value = 24, 
  min = 0, 
  max = 100, 
  label = "VU METER", 
  unit = "%" 
}) {
  const percent = Math.min(1, Math.max(0, (value - min) / (max - min)));
  // Needle swings from -45deg to +45deg
  const needleAngle = -45 + percent * 90;

  return (
    <div className="w-full max-w-[200px] skeuo-inset p-3 rounded-2xl flex flex-col items-center space-y-1.5 select-none relative overflow-hidden">
      
      {/* Meter Glass Bezel */}
      <div 
        className="w-full h-24 rounded-xl relative overflow-hidden flex flex-col items-center justify-end pb-2"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #1a2230 0%, #0d121a 70%, #07090e 100%)',
          boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Specular Glass Reflection */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)'
          }}
        />

        {/* Meter Calibrated Arc Scale */}
        <svg className="w-full h-16 absolute top-2" viewBox="0 0 160 80">
          {/* Main Arc */}
          <path 
            d="M 20 70 A 70 70 0 0 1 140 70" 
            fill="none" 
            stroke="#334155" 
            strokeWidth="3" 
          />
          {/* Green / Normal Range */}
          <path 
            d="M 20 70 A 70 70 0 0 1 100 25" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="3" 
            strokeDasharray="4,2" 
          />
          {/* Red / Peak Range */}
          <path 
            d="M 100 25 A 70 70 0 0 1 140 70" 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="3" 
          />
          {/* Tick Labels */}
          <text x="24" y="65" fontSize="7" fill="#64748b" fontFamily="monospace">0</text>
          <text x="76" y="24" fontSize="7" fill="#10b981" fontFamily="monospace">50</text>
          <text x="130" y="65" fontSize="7" fill="#ef4444" fontFamily="monospace">100</text>
        </svg>

        {/* Pivot Center Cap */}
        <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 z-10 shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-500" />
        </div>

        {/* Galvanometer Needle */}
        <div 
          className="w-0.5 h-16 bg-red-500 absolute bottom-3 origin-bottom z-10 rounded-full transition-transform duration-300 ease-out"
          style={{
            transform: `rotate(${needleAngle}deg)`,
            boxShadow: '0 0 4px rgba(239, 68, 68, 0.8)'
          }}
        />
      </div>

      {/* Label & Value */}
      <div className="w-full flex items-center justify-between px-1 text-[10px] font-mono">
        <span className="text-slate-400 font-bold uppercase">{label}</span>
        <span className="text-cyan-400 font-bold bg-black/60 px-1.5 py-0.5 rounded border border-white/5">
          {value}{unit}
        </span>
      </div>

    </div>
  );
}
