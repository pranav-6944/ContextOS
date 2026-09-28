import React from 'react';

export default function SkeuoSwitch({ 
  isOn = false, 
  onToggle, 
  label = "POWER", 
  color = "emerald" 
}) {
  return (
    <div className="flex flex-col items-center space-y-1.5 select-none">
      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
        {label}
      </span>

      {/* Rocker Frame */}
      <div 
        onClick={onToggle}
        className="w-10 h-16 rounded-xl skeuo-inset p-1 flex flex-col justify-between cursor-pointer"
        style={{
          boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Toggle Rocker Paddle */}
        <div 
          className={`w-full h-7 rounded-lg transition-all duration-150 flex items-center justify-center ${
            isOn ? 'translate-y-7' : 'translate-y-0'
          }`}
          style={{
            background: 'linear-gradient(180deg, #475569 0%, #1e293b 50%, #0f172a 100%)',
            borderTop: '1px solid rgba(255,255,255,0.4)',
            borderBottom: '2px solid #000000',
            boxShadow: '0 3px 6px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          {/* Small Grip Ridges */}
          <div className="w-4 h-1.5 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-black/60 rounded" />
            <div className="w-full h-0.5 bg-white/20 rounded" />
          </div>
        </div>

        {/* LED Diode Indicator */}
        <div className="w-full flex justify-center pb-1">
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              isOn 
                ? color === 'cyan' ? 'skeuo-diode-cyan' : 'skeuo-diode-green'
                : 'bg-slate-800 border border-slate-700'
            }`} 
          />
        </div>
      </div>
    </div>
  );
}
