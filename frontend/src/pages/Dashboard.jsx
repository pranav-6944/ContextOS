import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, FolderArchive, Compass, Grid, Settings, 
  Send, Upload, Trash2, Sparkles, RefreshCw, Cpu, Check, 
  Copy, ExternalLink, HardDrive, Shield, AlertCircle,
  Activity, Radio, Eye, Layers, Filter
} from 'lucide-react';
import { api } from '../services/api';
import SkeuoMeter from '../components/SkeuoMeter';
import SkeuoKnob from '../components/SkeuoKnob';
import SkeuoSwitch from '../components/SkeuoSwitch';
import InspectorDrawer from '../components/InspectorDrawer';

export default function Dashboard({ bionicStatus, onRefreshStatus, setView }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'vault' | 'spectrum' | 'matrix' | 'settings'
  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [selectedChunk, setSelectedChunk] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Spectrum Analyzer State
  const [vuCosineLevel, setVuCosineLevel] = useState(0.78);
  const [vuDecibelLevel, setVuDecibelLevel] = useState(0.55);
  const [vectorZoom, setVectorZoom] = useState(1.0);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.5);
  const [activeDocFilter, setActiveDocFilter] = useState('ALL');


  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to ContextOS RAG Studio. Upload your files in the Document Vault or ask a question using the preloaded knowledge base.',
      citations: [],
      telemetry: null
    }
  ]);
  const [queryInput, setQueryInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeCitations, setActiveCitations] = useState([]);
  const messagesEndRef = useRef(null);

  // Settings State
  const [settings, setSettings] = useState({
    chat_model: 'qwen/qwen3.5-9b',
    embedding_model: 'text-embedding-nomic-embed-text-v1.5',
    top_k: 4,
    temperature: 0.7,
    chunk_size: 600,
    chunk_overlap: 120,
    llm_base_url: 'http://localhost:1234/v1'
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial documents & chunks
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [docsRes, chunksRes, statusRes] = await Promise.all([
        api.getDocuments(),
        api.getChunks(),
        api.getStatus()
      ]);
      setDocuments(docsRes.documents || []);
      setChunks(chunksRes.chunks || []);
      if (statusRes.settings) {
        setSettings(prev => ({ ...prev, ...statusRes.settings }));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Chat Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Execute RAG Query with SSE Streaming
  const handleSendQuery = async (textToSend) => {
    const query = (textToSend || queryInput).trim();
    if (!query || isStreaming) return;

    setQueryInput('');
    setIsStreaming(true);

    // Append User Message
    const userMsg = { role: 'user', content: query };
    const assistantMsg = {
      role: 'assistant',
      content: '',
      citations: [],
      telemetry: null,
      systemBadge: null
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);

    try {
      const res = await api.queryRAG({
        query,
        top_k: settings.top_k,
        temperature: settings.temperature,
        chat_model: settings.chat_model
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const block of lines) {
          if (!block.startsWith('data: ')) continue;
          const jsonStr = block.replace('data: ', '').trim();
          if (!jsonStr) continue;

          try {
            const payload = JSON.parse(jsonStr);

            if (payload.type === 'token') {
              setMessages(prev => {
                const updated = [...prev];
                const last = { ...updated[updated.length - 1] };
                last.content += payload.token;
                updated[updated.length - 1] = last;
                return updated;
              });
            } else if (payload.type === 'citations') {
              const citList = payload.data || [];
              setActiveCitations(citList);
              if (citList.length > 0 && citList[0].score) {
                setVuCosineLevel(Math.min(0.96, Math.max(0.3, citList[0].score)));
                setVuDecibelLevel(Math.min(0.92, Math.max(0.2, 0.4 + (citList.length * 0.1))));
              }
              setMessages(prev => {
                const updated = [...prev];
                const last = { ...updated[updated.length - 1] };
                last.citations = citList;
                updated[updated.length - 1] = last;
                return updated;
              });
            } else if (payload.type === 'system_badge') {
              setMessages(prev => {
                const updated = [...prev];
                const last = { ...updated[updated.length - 1] };
                last.systemBadge = payload.text;
                updated[updated.length - 1] = last;
                return updated;
              });
            } else if (payload.type === 'done') {
              setMessages(prev => {
                const updated = [...prev];
                const last = { ...updated[updated.length - 1] };
                last.telemetry = payload.stats;
                updated[updated.length - 1] = last;
                return updated;
              });
            }
          } catch (e) {
            console.warn('SSE Parse error:', e);
          }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        last.content += `\n\n[Error: ${err.message}]`;
        updated[updated.length - 1] = last;
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  // File Upload Handling
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    showToast(`Parsing & embedding ${files.length} document(s)...`);
    try {
      const res = await api.uploadFiles(files);
      showToast(`Successfully indexed ${res.documents?.length || 0} document(s)!`);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Upload failed');
    }
  };

  // Preload Samples
  const handlePreloadSamples = async () => {
    showToast('Loading pre-built knowledge base...');
    try {
      const res = await api.preloadSamples();
      showToast(`Loaded ${res.preloaded?.length || 0} documents.`);
      await loadData();
    } catch (err) {
      showToast('Failed to load samples');
    }
  };

  // Delete Document
  const handleDeleteDoc = async (docId) => {
    if (!confirm('Remove document and delete its vector chunks?')) return;
    try {
      await api.deleteDocument(docId);
      showToast('Document deleted.');
      await loadData();
    } catch (err) {
      showToast('Failed to delete document');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      await api.updateSettings(settings);
      showToast('RAG settings saved successfully!');
      if (onRefreshStatus) onRefreshStatus();
    } catch (err) {
      showToast('Failed to save settings');
    }
  };

  const handleOpenChunk = (chunk) => {
    setSelectedChunk(chunk);
    setIsInspectorOpen(true);
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-65px)] overflow-hidden bg-[#05070f] text-slate-100 relative">
      
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col justify-between p-4 z-20">
        
        {/* Navigation Tabs with Official Horizontal Logo */}
        <div className="space-y-6">
          <div className="px-1 pt-1 pb-2 border-b border-slate-800/80">
            <div className="h-10 px-2 py-1 rounded-xl skeuo-inset flex items-center justify-center border border-slate-700 bg-slate-900/60 shadow-inner mb-2">
              <img 
                src="/Horizontal_stack_logo.png" 
                alt="ContextOS" 
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]" 
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-semibold px-2">
              <span>CONTROL MATRIX</span>
              <span className="text-cyan-400 font-bold">MK-IV</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>RAG Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span>Document Vault</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {documents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('spectrum')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'spectrum'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>VU Spectrum Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'matrix'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Vector Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Engine Settings</span>
            </button>
          </nav>
        </div>

        {/* Telemetry Badge in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>INDEXED CHUNKS</span>
            <span className="text-cyan-400 font-bold">{chunks.length}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>DIMENSION</span>
            <span className="text-purple-400 font-bold">768-D</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>HARDWARE</span>
            <span className="text-emerald-400 font-bold">Local Silicon</span>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT STAGE */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* TAB 1: RAG STUDIO (CHAT) */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full p-6 justify-between">
            
            {/* Suggestion Prompts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs">
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">Suggested:</span>
              <button 
                onClick={() => handleSendQuery('Explain the 5-stage RAG pipeline of ContextOS')}
                className="whitespace-nowrap px-3 py-1.5 rounded-full glass-panel hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Explain 5-Stage RAG
              </button>
              <button 
                onClick={() => handleSendQuery('How does cosine similarity calculate relevance in 768-D vector space?')}
                className="whitespace-nowrap px-3 py-1.5 rounded-full glass-panel hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Cosine Similarity Math
              </button>
              <button 
                onClick={() => handleSendQuery('What are the chunk size trade-offs?')}
                className="whitespace-nowrap px-3 py-1.5 rounded-full glass-panel hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Chunking Trade-offs
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-cyan-500/20 flex-shrink-0">
                      COS
                    </div>
                  )}

                  <div className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-white' 
                      : 'glass-panel border-l-4 border-l-cyan-400 text-slate-200'
                  }`}>
                    {/* Standby Engine Badge */}
                    {msg.systemBadge && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-3">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{msg.systemBadge}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.content || (isStreaming && i === messages.length - 1 ? '▋' : '')}</div>

                    {/* Citations Tray */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                        {msg.citations.map((c, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleOpenChunk(c)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono transition-colors"
                          >
                            <span>[S{c.source_id}] {c.doc_name} (p.{c.page})</span>
                            <span className="text-[10px] opacity-75">• {(c.score * 100).toFixed(0)}%</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Telemetry Tag */}
                    {msg.telemetry && (
                      <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-3">
                        <span>⏱ {msg.telemetry.elapsed_seconds}s</span>
                        <span>⚡ {msg.telemetry.tokens_per_second} tok/s</span>
                        <span>🧩 {msg.citations?.length || 0} sources</span>
                        <span>⚙️ {msg.telemetry.engine}</span>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                      YOU
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Glowing Input Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
              className="glass-panel p-2 rounded-2xl border border-cyan-500/30 focus-within:border-cyan-400 flex items-center gap-3 shadow-xl"
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask anything grounded in your local documents..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 outline-none"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={isStreaming || !queryInput.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* TAB 2: DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Document Vault</h2>
                <p className="text-sm text-slate-400">Manage indexed files and explore knowledge representations.</p>
              </div>
              <button
                onClick={handlePreloadSamples}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-sm font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Sample Knowledge</span>
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <label className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
              <Upload className="w-10 h-10 text-cyan-400 mb-3" />
              <div className="font-semibold text-white text-base">Drop files here or click to browse</div>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT, Markdown, CSV, and JSON</p>
              <input 
                type="file" 
                multiple 
                accept=".pdf,.docx,.txt,.md,.csv,.json"
                onChange={(e) => handleFileUpload(e.target.files)} 
                className="hidden" 
              />
            </label>

            {/* Document List Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <div className="px-6 py-4 border-b border-white/10 text-xs font-mono text-slate-400 uppercase">
                Indexed Documents ({documents.length})
              </div>
              {documents.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  No documents in vault yet. Upload files above or load sample documents.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {documents.map((doc) => (
                    <div key={doc.doc_id} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="space-y-1">
                        <div className="font-medium text-sm text-white">{doc.doc_name}</div>
                        <div className="text-xs font-mono text-slate-400">
                          {doc.chunk_count} chunks • {(doc.file_size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDoc(doc.doc_id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: VECTOR VU SPECTRUM & RADAR ANALYZER */}
        {activeTab === 'spectrum' && (
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header & Status Diode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tight">
                    Vector VU Spectrum & Signal Analyzer
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                    768-D BUS
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Real-time analog galvanometer telemetry and 2D dense vector projection radar.
                </p>
              </div>

              {/* Document Filter Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase">CHASSIS FILTER:</span>
                <select
                  value={activeDocFilter}
                  onChange={(e) => setActiveDocFilter(e.target.value)}
                  className="skeuo-inset px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 border border-slate-700 outline-none cursor-pointer"
                >
                  <option value="ALL">ALL SOURCES ({chunks.length})</option>
                  {documents.map((d, i) => (
                    <option key={i} value={d.name}>{d.name} ({d.chunks_count})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TOP DUAL GALVANOMETER VU METER BRIDGE */}
            <div className="skeuo-chassis p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
              <div className="absolute top-3 left-3 w-3 h-3 skeuo-screw" />
              <div className="absolute top-3 right-3 w-3 h-3 skeuo-screw" />
              <div className="absolute bottom-3 left-3 w-3 h-3 skeuo-screw" />
              <div className="absolute bottom-3 right-3 w-3 h-3 skeuo-screw" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
                {/* Left Needle: Cosine Coherence */}
                <div className="flex flex-col items-center">
                  <SkeuoMeter 
                    value={vuCosineLevel} 
                    label="COSINE COHERENCE" 
                    unit="SIMILARITY" 
                    min={0} 
                    max={1} 
                    width={260} 
                    height={140} 
                  />
                  <div className="mt-2 text-center font-mono text-xs">
                    <span className="text-slate-400">TARGET CONFIDENCE: </span>
                    <span className="text-cyan-400 font-bold">{(vuCosineLevel * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Right Needle: Signal Density dB */}
                <div className="flex flex-col items-center">
                  <SkeuoMeter 
                    value={vuDecibelLevel} 
                    label="SIGNAL DENSITY" 
                    unit="DECIBELS" 
                    min={0} 
                    max={1} 
                    width={260} 
                    height={140} 
                  />
                  <div className="mt-2 text-center font-mono text-xs">
                    <span className="text-slate-400">HARMONIC INTENSITY: </span>
                    <span className="text-amber-400 font-bold">{(vuDecibelLevel * 10 - 2).toFixed(1)} dB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RADAR CRT PROJECTION GRID & CONTROLS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Radar CRT Display (2 Columns) */}
              <div className="lg:col-span-2 skeuo-screen p-6 rounded-3xl min-h-[440px] flex flex-col justify-between relative overflow-hidden">
                {/* CRT Glass Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none" />
                
                {/* Radar Sweep rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-[360px] h-[360px] rounded-full border border-cyan-400 animate-spin [animation-duration:16s]" />
                  <div className="w-[240px] h-[240px] rounded-full border border-cyan-400/50 absolute" />
                  <div className="w-[120px] h-[120px] rounded-full border border-cyan-400/30 absolute" />
                  <div className="w-full h-px bg-cyan-400/20 absolute" />
                  <div className="h-full w-px bg-cyan-400/20 absolute" />
                </div>

                {/* Scope Header */}
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300 z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
                    <span>CRT VECTOR PROJECTION RADAR // 2D TOPOLOGY</span>
                  </div>
                  <span className="text-slate-400">CHUNKS SHOWN: {
                    activeDocFilter === 'ALL' 
                      ? chunks.length 
                      : chunks.filter(c => c.doc_name === activeDocFilter).length
                  }</span>
                </div>

                {/* Radar Plot Field */}
                <div className="relative w-full h-[320px] my-3 z-10 overflow-hidden">
                  {chunks
                    .filter(c => activeDocFilter === 'ALL' || c.doc_name === activeDocFilter)
                    .map((c, idx) => {
                      // Project coordinates normalized to radar box
                      const posX = 50 + (c.x || Math.sin(idx * 1.618) * 35) * (vectorZoom * 0.9);
                      const posY = 50 + (c.y || Math.cos(idx * 1.618) * 35) * (vectorZoom * 0.9);
                      const isCited = activeCitations.some(cit => cit.chunk_id === c.chunk_id || cit.source_id === c.source_id);

                      return (
                        <div
                          key={c.chunk_id || idx}
                          onClick={() => handleOpenChunk(c)}
                          style={{
                            left: `${Math.max(5, Math.min(95, posX))}%`,
                            top: `${Math.max(5, Math.min(95, posY))}%`
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-150 ${
                            isCited ? 'z-30' : 'z-20'
                          }`}
                          title={`${c.doc_name} (Page ${c.page}): ${c.snippet?.slice(0, 60)}...`}
                        >
                          <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                            isCited
                              ? 'bg-emerald-400 shadow-[0_0_12px_#34d399] ring-2 ring-emerald-300 animate-ping'
                              : 'bg-cyan-400/80 hover:bg-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                          }`}>
                            <div className="w-1 h-1 rounded-full bg-white" />
                          </div>

                          {/* Hover Tooltip Card */}
                          <div className="hidden group-hover:block absolute bottom-5 left-1/2 -translate-x-1/2 w-48 p-2.5 rounded-lg skeuo-chassis border border-cyan-400/60 text-[10px] font-mono text-slate-200 shadow-2xl pointer-events-none z-50">
                            <span className="text-cyan-300 font-bold block truncate">{c.doc_name}</span>
                            <span className="text-slate-400 block">Page {c.page} • {c.word_count} words</span>
                            <span className="text-slate-300 line-clamp-2 mt-1">{c.snippet}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Scope Footer Stats */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10 border-t border-cyan-500/20 pt-2">
                  <span>SCALE: {vectorZoom.toFixed(1)}x MAGNIFICATION</span>
                  <span>BEARING: 045° NNE</span>
                  <span className="text-emerald-400">ACTIVE TARGETS: {activeCitations.length}</span>
                </div>
              </div>

              {/* Tactile Control & Spectrum Bay (1 Column) */}
              <div className="skeuo-chassis p-6 rounded-3xl border border-slate-700 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-4 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Radar Calibration</span>
                  </h3>

                  {/* Rotary Controls */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                    <div className="skeuo-inset p-3.5 rounded-xl flex flex-col items-center text-center space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Zoom Span</span>
                      <SkeuoKnob 
                        value={vectorZoom} 
                        onChange={setVectorZoom} 
                        min={0.5} 
                        max={2.5} 
                        label="ZOOM" 
                        size={64} 
                      />
                      <span className="text-xs font-mono text-cyan-400 font-bold">{vectorZoom.toFixed(1)}x</span>
                    </div>

                    <div className="skeuo-inset p-3.5 rounded-xl flex flex-col items-center text-center space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Threshold</span>
                      <SkeuoKnob 
                        value={similarityThreshold} 
                        onChange={setSimilarityThreshold} 
                        min={0.1} 
                        max={0.9} 
                        label="THRESH" 
                        size={64} 
                      />
                      <span className="text-xs font-mono text-purple-400 font-bold">{(similarityThreshold * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Top Citation Readout */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                    Target Proximity Channel
                  </span>
                  {activeCitations.length === 0 ? (
                    <div className="skeuo-inset p-4 rounded-xl text-center text-xs font-mono text-slate-500">
                      Run a query in RAG Studio to lock onto chunk citations.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeCitations.slice(0, 3).map((cit, cIdx) => (
                        <div 
                          key={cIdx} 
                          onClick={() => handleOpenChunk(cit)}
                          className="skeuo-inset p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-cyan-500/40 border border-transparent transition-all"
                        >
                          <div className="text-xs font-mono truncate max-w-[150px]">
                            <span className="text-cyan-300 font-bold block truncate">{cit.doc_name}</span>
                            <span className="text-[10px] text-slate-400">Page {cit.page}</span>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            {(cit.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manual Calibration Action */}
                <button
                  onClick={() => {
                    setVuCosineLevel(0.85);
                    setVuDecibelLevel(0.70);
                  }}
                  className="w-full skeuo-btn py-2.5 rounded-xl text-xs font-mono font-bold text-slate-200 uppercase tracking-wider cursor-pointer"
                >
                  Test Needle Deflection
                </button>
              </div>

            </div>

          </div>
        )}


        {/* TAB 4: VECTOR MATRIX (BENTO) */}
        {activeTab === 'matrix' && (
          <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-white">Bento Vector Matrix</h2>
              <p className="text-sm text-slate-400">Explore all {chunks.length} dense vector chunks stored in memory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chunks.map((c, i) => (
                <div 
                  key={c.chunk_id || i}
                  onClick={() => handleOpenChunk(c)}
                  className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 space-y-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold truncate max-w-[160px]">{c.doc_name}</span>
                    <span className="text-slate-400">p.{c.page}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {c.snippet || c.text}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span>{c.word_count || 0} words</span>
                    <span className="text-purple-400">({c.x?.toFixed(1)}, {c.y?.toFixed(1)}, {c.z?.toFixed(1)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ENGINE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-white">Engine Configuration</h2>
              <p className="text-sm text-slate-400">Tune local LLM connection, embedding models, and RAG hyperparameters.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              
              {/* Endpoint */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400">LOCAL LLM ENDPOINT (BIONIC / LM STUDIO)</label>
                <input
                  type="text"
                  value={settings.llm_base_url}
                  onChange={(e) => setSettings({ ...settings, llm_base_url: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm outline-none focus:border-cyan-400"
                />
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400">CHAT MODEL SELECTOR</label>
                <select
                  value={settings.chat_model}
                  onChange={(e) => setSettings({ ...settings, chat_model: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm outline-none focus:border-cyan-400"
                >
                  <option value="qwen/qwen3.5-9b">qwen/qwen3.5-9b (Local Bionic)</option>
                  <option value="google/gemma-4-e2b">google/gemma-4-e2b (Lightweight 2B)</option>
                  <option value="qwen3.6-12b-iq">qwen3.6-12b-iq</option>
                  <option value="gemma-4-e4b-uncensored-hauhaucs-aggressive">gemma-4-e4b</option>
                </select>
              </div>

              {/* Top-K Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">RETRIEVAL TOP-K CHUNKS</span>
                  <span className="text-cyan-400 font-bold">{settings.top_k}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.top_k}
                  onChange={(e) => setSettings({ ...settings, top_k: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">TEMPERATURE</span>
                  <span className="text-purple-400 font-bold">{settings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Save Configuration
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* CHUNK INSPECTOR DRAWER */}
      <InspectorDrawer 
        chunk={selectedChunk}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-cyan-500/40 text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
