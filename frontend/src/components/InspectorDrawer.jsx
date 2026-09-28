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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md skeuo-chassis border-l border-slate-700 shadow-2xl flex flex-col transition-transform duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl skeuo-inset text-cyan-400 border border-slate-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wide">Chunk Grounding Inspector</h3>
            <p className="text-[11px] text-slate-400 font-mono">768-D Vector Bus Payload</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg skeuo-btn text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        
        {/* Source File & Page */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Source Document Dossier</span>
          <div className="p-3.5 rounded-xl skeuo-inset border border-slate-800 flex items-center justify-between">
            <div className="font-bold font-mono text-xs text-white truncate max-w-[240px]">
              {chunk.doc_name || 'Document'}
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md skeuo-inset text-cyan-400 border border-cyan-500/30">
              Page {chunk.page || 1}
            </span>
          </div>
        </div>

        {/* Relevance Score & Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl skeuo-inset border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Match Confidence</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {chunk.score ? `${(chunk.score * 100).toFixed(1)}%` : 'Indexed'}
            </div>
          </div>

          <div className="p-3 rounded-xl skeuo-inset border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Vector Projection</span>
            <div className="text-xs font-mono text-cyan-300 font-bold truncate">
              X:{chunk.x?.toFixed(1) ?? 0} Y:{chunk.y?.toFixed(1) ?? 0}
            </div>
          </div>
        </div>

        {/* Word & Char Metrics */}
        <div className="p-3 rounded-xl skeuo-inset border border-slate-800 flex items-center justify-around text-xs font-mono text-slate-300">
          <div>Words: <strong className="text-cyan-400">{chunk.word_count || chunk.text?.split(/\s+/).length || 0}</strong></div>
          <div className="w-px h-4 bg-slate-700" />
          <div>Section: <strong className="text-purple-400">{chunk.section || 'Corpus Body'}</strong></div>
        </div>

        {/* Full Text Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Raw Text Fragment</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl skeuo-screen border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
            {chunk.text || chunk.snippet || 'No text content available.'}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 skeuo-chassis flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl skeuo-btn text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Close Inspector
        </button>
      </div>

    </div>
  );
}
