import React from 'react';
import { X, FileText, Compass, Hash, Copy, Check } from 'lucide-react';

export default function InspectorDrawer({ chunk, isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !chunk) return null;

  const handleCopy = () => {
    const textToCopy = chunk.text || chunk.snippet || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col transition-transform duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Chunk Inspector</h3>
            <p className="text-xs text-slate-400 font-mono">Source Grounding Payload</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Source File & Page */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">Source Document</span>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="font-medium text-sm text-white truncate max-w-[240px]">
              {chunk.doc_name || 'Document'}
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Page {chunk.page || 1}
            </span>
          </div>
        </div>

        {/* Relevance Score & Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Match Confidence</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {chunk.score ? `${(chunk.score * 100).toFixed(1)}%` : 'Indexed'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">3D Coordinates</span>
            <div className="text-xs font-mono text-cyan-400 truncate">
              X:{chunk.x?.toFixed(1) ?? 0} Y:{chunk.y?.toFixed(1) ?? 0} Z:{chunk.z?.toFixed(1) ?? 0}
            </div>
          </div>
        </div>

        {/* Word & Char Metrics */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-around text-xs font-mono text-slate-300">
          <div>Words: <strong className="text-white">{chunk.word_count || chunk.text?.split(/\s+/).length || 0}</strong></div>
          <div className="w-px h-4 bg-white/10" />
          <div>Section: <strong className="text-white">{chunk.section || 'Body'}</strong></div>
        </div>

        {/* Full Text Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">Raw Text Content</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
            {chunk.text || chunk.snippet || 'No text content available.'}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-950 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
        >
          Close Inspector
        </button>
      </div>

    </div>
  );
}
