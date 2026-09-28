import React, { useState, useRef, useEffect } from 'react';

export default function SkeuoKnob({ 
  value = 0.7, 
  min = 0, 
  max = 1.5, 
  step = 0.05, 
  onChange, 
  label = "DIAL", 
  unit = "" 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Normalize angle between -135deg and +135deg (270 degree sweep)
  const percent = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const angle = -135 + percent * 270;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaY = startYRef.current - e.clientY;
      const range = max - min;
      const deltaVal = (deltaY / 150) * range;
      const rawVal = startValRef.current + deltaVal;
      const clamped = Math.min(max, Math.max(min, rawVal));
      const stepped = Math.round(clamped / step) * step;
      if (onChange) onChange(parseFloat(stepped.toFixed(2)));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, onChange]);

  return (
    <div className="flex flex-col items-center select-none space-y-2">
      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
        {label}
      </span>

      {/* Rotary Dial Container */}
      <div 
        onMouseDown={handleMouseDown}
        className="w-16 h-16 rounded-full relative flex items-center justify-center cursor-ns-resize"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #475569 0%, #1e293b 50%, #0f172a 100%)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9), inset 0 2px 2px rgba(255,255,255,0.4), inset 0 -2px 2px rgba(0,0,0,0.8)',
          border: '1.5px solid #334155'
        }}
      >
        {/* Outer Knurled Ring */}
        <div 
          className="w-13 h-13 rounded-full relative flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          {/* Inner Cap with Indicator Notch */}
          <div 
            className="w-10 h-10 rounded-full relative flex items-center justify-center transition-transform"
            style={{
              transform: `rotate(${angle}deg)`,
              background: 'radial-gradient(circle at 40% 40%, #334155 0%, #0f172a 80%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.3)'
            }}
          >
            {/* Notch Needle */}
            <div 
              className="w-1 h-3.5 bg-cyan-400 rounded-full absolute -top-0.5 shadow-[0_0_6px_#00f0ff]" 
            />
          </div>
        </div>
      </div>

      {/* Value Readout */}
      <div className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-cyan-400 font-mono text-[11px] font-bold shadow-inner">
        {value} {unit}
      </div>
    </div>
  );
}
