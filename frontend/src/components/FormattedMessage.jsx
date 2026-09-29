import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, Cpu, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
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

  const rawLines = content.split('\n');
  const elements = [];
  let i = 0;
  let codeBlockIndex = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Code Block (``` ... ```)
    if (trimmed.startsWith('```')) {
      const codeLang = trimmed.slice(3).trim() || 'code';
      const codeLines = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().startsWith('```')) {
        i++; // skip closing fence
      }
      const codeText = codeLines.join('\n');
      const thisIdx = codeBlockIndex++;
      elements.push(
        <div key={`code-${i}`} className="my-3 rounded-xl skeuo-screen border border-slate-700/80 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500/80" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              <span className="uppercase text-cyan-400 font-bold ml-1 tracking-wider">{codeLang}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyCode(codeText, thisIdx)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px]"
            >
              {copiedIndex === thisIdx ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed selection:bg-cyan-500/30">
            <code>{codeText}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Markdown Table Detection (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|', 1)) {
      const tableLines = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
        // Check if row 1 is a delimiter row (| :--- | :--- |)
        const hasDelimiter = tableLines[1].includes('---');
        const dataRows = (hasDelimiter ? tableLines.slice(2) : tableLines.slice(1)).map(rowStr =>
          rowStr.split('|').slice(1, -1).map(c => c.trim())
        );

        elements.push(
          <div key={`table-${i}`} className="my-3 overflow-x-auto rounded-xl border border-slate-700/80 skeuo-screen shadow-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900/95 border-b border-cyan-500/40 text-cyan-300">
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                      {formatInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {dataRows.map((r, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`transition-colors ${
                      rIdx % 2 === 0 ? 'bg-slate-950/40 hover:bg-cyan-950/20' : 'bg-slate-900/40 hover:bg-cyan-950/20'
                    }`}
                  >
                    {r.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2 text-slate-200 leading-relaxed">
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 3. Section Headers (### 🎯 ..., ### ⚠️ ..., ### 🔍 ..., etc.)
    if (trimmed.startsWith('### ')) {
      const headerText = trimmed.slice(4).trim();
      let borderColor = 'border-l-cyan-400';
      let titleColor = 'text-cyan-300';
      let isWarning = false;

      if (headerText.includes('⚠️') || headerText.toLowerCase().includes('boundary') || headerText.toLowerCase().includes('out of')) {
        borderColor = 'border-l-amber-500';
        titleColor = 'text-amber-400';
        isWarning = true;
      } else if (headerText.includes('Executive Summary') || headerText.includes('🎯')) {
        borderColor = 'border-l-cyan-400';
        titleColor = 'text-cyan-300';
      } else if (headerText.includes('Core Concepts') || headerText.includes('Analysis') || headerText.includes('🔍') || headerText.includes('Overview')) {
        borderColor = 'border-l-emerald-400';
        titleColor = 'text-emerald-300';
      } else if (headerText.includes('Technical Implementation') || headerText.includes('Code') || headerText.includes('💻')) {
        borderColor = 'border-l-purple-400';
        titleColor = 'text-purple-300';
      } else if (headerText.includes('Source Grounding') || headerText.includes('Evidence') || headerText.includes('📑') || headerText.includes('Verification')) {
        borderColor = 'border-l-blue-400';
        titleColor = 'text-blue-300';
      } else if (headerText.includes('Key Takeaway') || headerText.includes('💡') || headerText.includes('Conclusion')) {
        borderColor = 'border-l-amber-400';
        titleColor = 'text-amber-300';
      }

      if (isWarning) {
        elements.push(
          <div key={`h3-${i}`} className="mt-4 mb-2 p-2.5 rounded-xl skeuo-chassis border border-amber-500/40 bg-amber-950/20 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-amber-400">
                {headerText}
              </h3>
            </div>
          </div>
        );
      } else {
        elements.push(
          <div key={`h3-${i}`} className={`mt-4 mb-2 pl-3 border-l-4 ${borderColor}`}>
            <h3 className={`text-xs sm:text-sm font-bold font-mono uppercase tracking-wider ${titleColor}`}>
              {headerText}
            </h3>
          </div>
        );
      }
      i++;
      continue;
    }

    // 4. Sub-Headers (#### ...)
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="mt-3 mb-1 text-xs font-bold font-mono text-cyan-200 uppercase tracking-wide">
          {trimmed.slice(5).trim()}
        </h4>
      );
      i++;
      continue;
    }

    // 5. Blockquotes (> ...) or Indented Blockquotes (  > ...)
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <div key={`quote-${i}`} className="my-2 p-2.5 rounded-lg skeuo-inset border-l-2 border-l-cyan-500/70 text-xs font-mono text-slate-300 italic shadow-inner">
          {formatInline(quoteText)}
        </div>
      );
      i++;
      continue;
    }

    // 6. Horizontal Rules (--- or ***)
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-slate-700/60" />);
      i++;
      continue;
    }

    // 7. Bullet Points (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.slice(2);
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 shadow-[0_0_6px_#22d3ee]" />
          <div className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
            {formatInline(bulletText)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // 8. Empty Lines
    if (!trimmed) {
      elements.push(<div key={`space-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // 9. Standard Paragraphs
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed my-1">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return (
    <div className="space-y-0.5 selection:bg-cyan-500/30">
      {elements}
      {isStreaming && <span className="text-cyan-400 animate-pulse font-mono ml-1">▋</span>}
    </div>
  );
}

// Inline Markdown Formatter: `code`, **bold**, *italic*, [link](url)
function formatInline(text) {
  if (!text) return null;

  // Split by inline code `...`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, pIdx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={pIdx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 font-mono text-cyan-300 text-xs">
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

      // Split by *italic*
      const italicParts = bPart.split(/(\*[^*]+\*)/g);
      return italicParts.map((iPart, iIdx) => {
        if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) {
          return (
            <em key={`${pIdx}-${bIdx}-${iIdx}`} className="italic text-cyan-200/90 font-medium">
              {iPart.slice(1, -1)}
            </em>
          );
        }
        return iPart;
      });
    });
  });
}
