import React from 'react';
import { Cookie, HardDrive, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function CookiesPage({ setView }) {
  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => setView('landing')}
        className="skeuo-btn px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Master Console</span>
      </button>

      {/* Main Enclosure */}
      <div className="skeuo-chassis p-8 sm:p-12 rounded-3xl relative border border-slate-700 space-y-8">
        
        {/* Four Rivets */}
        <div className="absolute top-3 left-3 skeuo-screw" />
        <div className="absolute top-3 right-3 skeuo-screw" />
        <div className="absolute bottom-3 left-3 skeuo-screw" />
        <div className="absolute bottom-3 right-3 skeuo-screw" />

        {/* Header Nameplate */}
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
              STORAGE MANIFEST & COOKIE POLICY
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Local Storage Transparency Manifest
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-lg skeuo-inset text-xs font-mono text-cyan-400 self-start">
            THIRD-PARTY COOKIES: 0.00%
          </div>
        </div>

        {/* Overview Box */}
        <div className="skeuo-inset p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl skeuo-diode-green flex items-center justify-center text-white flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono text-slate-300 leading-relaxed">
            <strong className="text-white">Zero Tracking Guarantee:</strong> ContextOS does not employ advertising cookies, tracking pixels, or cross-site fingerprinting scripts. All persistent data resides solely on your local browser storage and machine disk.
          </div>
        </div>

        {/* Storage Table */}
        <div className="space-y-3 font-mono">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Local Storage Registry
          </h3>

          <div className="skeuo-inset rounded-2xl overflow-hidden border border-white/5">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Storage Key</th>
                  <th className="p-3.5">Scope</th>
                  <th className="p-3.5">Purpose</th>
                  <th className="p-3.5">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-3.5 font-bold text-cyan-400">contextos_settings</td>
                  <td className="p-3.5">LocalStorage</td>
                  <td className="p-3.5">Preserves Top-K, temperature, and active model selection</td>
                  <td className="p-3.5">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-cyan-400">data/vector_store.json</td>
                  <td className="p-3.5">Local Server Disk</td>
                  <td className="p-3.5">In-memory 768-D vector coordinates and parsed chunks</td>
                  <td className="p-3.5">Until manual deletion</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-cyan-400">3rd-Party Trackers</td>
                  <td className="p-3.5">External</td>
                  <td className="p-3.5 text-emerald-400 font-bold">NONE (BLOCKED)</td>
                  <td className="p-3.5 text-slate-500">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-5 skeuo-inset rounded-2xl space-y-2 text-xs font-mono text-slate-400 leading-relaxed">
          <div className="text-white font-bold">How to Purge Local Storage:</div>
          <p>
            You can clear all stored parameters at any time by clicking "Delete" inside the Document Vault or via your browser’s standard "Clear Site Data" developer tools.
          </p>
        </div>

      </div>

    </div>
  );
}
