import React, { useState } from 'react';
import { Copy, Check, Terminal, Cpu, Sparkles, BookOpen, Layers, Zap } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function FormattedMessage({ content = '', isStreaming = false }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (codeText, idx) => {
    soundManager.playKeyClick();
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) {
    return isStreaming ? <span className="text-cyan-400 animate-pulse font-mono">▋</span> : null;
  }

  // Parse lines into structured blocks
  const lines = content.split('\n');
  const elements = [];
  let currentCodeBlock = null;
  let codeLang = '';
  let inCodeBlock = false;
  let codeBlockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code fence start or end
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trim().slice(3) || 'code';
        currentCodeBlock = [];
      } else {
        // End code block
        inCodeBlock = false;
        const codeText = currentCodeBlock.join('\n');
        const thisIdx = codeBlockIndex++;
        elements.push(
          <div key={`code-${i}`} className="my-3 rounded-xl skeuo-screen border border-slate-700/80 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="uppercase text-cyan-400 font-bold">{codeLang}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeText, thisIdx)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedIndex === thisIdx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed selection:bg-cyan-500/30">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        currentCodeBlock = null;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      continue;
    }

    // Check for Section Headers: ### 🎯 Executive Summary, ### 🔍 ..., etc.
    if (line.startsWith('### ')) {
      const headerText = line.slice(4).trim();
      let borderColor = 'border-l-cyan-400';
      let titleColor = 'text-cyan-300';

      if (headerText.includes('Executive Summary') || headerText.includes('🎯')) {
        borderColor = 'border-l-cyan-400';
        titleColor = 'text-cyan-300';
      } else if (headerText.includes('Core Concepts') || headerText.includes('Analysis') || headerText.includes('🔍')) {
        borderColor = 'border-l-emerald-400';
        titleColor = 'text-emerald-300';
      } else if (headerText.includes('Technical Implementation') || headerText.includes('Code') || headerText.includes('💻')) {
        borderColor = 'border-l-purple-400';
        titleColor = 'text-purple-300';
      } else if (headerText.includes('Source Grounding') || headerText.includes('Evidence') || headerText.includes('📑')) {
        borderColor = 'border-l-blue-400';
        titleColor = 'text-blue-300';
      } else if (headerText.includes('Key Takeaway') || headerText.includes('💡') || headerText.includes('Conclusion')) {
        borderColor = 'border-l-amber-400';
        titleColor = 'text-amber-300';
      }

      elements.push(
        <div key={`h3-${i}`} className={`mt-4 mb-2 pl-3 border-l-4 ${borderColor}`}>
          <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${titleColor}`}>
            {headerText}
          </h3>
        </div>
      );
      continue;
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="mt-3 mb-1 text-xs font-bold font-mono text-slate-200 uppercase tracking-wide">
          {line.slice(5).trim()}
        </h4>
      );
      continue;
    }

    // Check for Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <div key={`quote-${i}`} className="my-2 p-2.5 rounded-lg skeuo-inset border-l-2 border-l-cyan-500/60 text-xs font-mono text-slate-300 italic">
          {formatInline(line.slice(2))}
        </div>
      );
      continue;
    }

    // Check for Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-slate-700/60" />);
      continue;
    }

    // Check for Bullet points (- or *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const bulletText = line.trim().slice(2);
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 my-1.5 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 shadow-[0_0_6px_#22d3ee]" />
          <div className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
            {formatInline(bulletText)}
          </div>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed my-1">
        {formatInline(line)}
      </p>
    );
  }

  // Handle unclosed code block if streaming is mid-code
  if (inCodeBlock && currentCodeBlock) {
    elements.push(
      <div key="unclosed-code" className="my-3 rounded-xl skeuo-screen border border-slate-700 p-3 text-xs font-mono text-cyan-200">
        <pre><code>{currentCodeBlock.join('\n')}</code></pre>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 selection:bg-cyan-500/30">
      {elements}
      {isStreaming && <span className="text-cyan-400 animate-pulse font-mono">▋</span>}
    </div>
  );
}

// Helper to format inline markdown (**bold**, `code`, etc.)
function formatInline(text) {
  if (!text) return null;

  // Split by inline code `...`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, pIdx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={pIdx} className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 font-mono text-cyan-300 text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Split by **bold**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
        return (
          <strong key={`${pIdx}-${bIdx}`} className="font-bold text-white tracking-wide">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      return bPart;
    });
  });
}
