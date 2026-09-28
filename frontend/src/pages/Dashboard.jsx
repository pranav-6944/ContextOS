import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, FolderArchive, Compass, Grid, Settings, 
  Send, Upload, Trash2, Sparkles, RefreshCw, Cpu, Check, 
  Copy, ExternalLink, HardDrive, Shield, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import Galaxy3DCanvas from '../components/Galaxy3DCanvas';
import InspectorDrawer from '../components/InspectorDrawer';

export default function Dashboard({ bionicStatus, onRefreshStatus }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'vault' | 'galaxy' | 'matrix' | 'settings'
  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [selectedChunk, setSelectedChunk] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

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
              setActiveCitations(payload.data || []);
              setMessages(prev => {
                const updated = [...prev];
                const last = { ...updated[updated.length - 1] };
                last.citations = payload.data || [];
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
        
        {/* Navigation Tabs */}
        <div className="space-y-6">
          <div className="px-3 pt-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Control Matrix
            </span>
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
              onClick={() => setActiveTab('galaxy')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'galaxy'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3D Neural Galaxy</span>
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

        {/* TAB 3: 3D NEURAL GALAXY */}
        {activeTab === 'galaxy' && (
          <div className="flex-1 w-full h-full relative">
            <Galaxy3DCanvas 
              chunks={chunks} 
              activeCitations={activeCitations}
              onSelectChunk={handleOpenChunk}
            />
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
