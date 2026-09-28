import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, FolderArchive, Compass, Grid, Settings, 
  Send, Upload, Trash2, Sparkles, RefreshCw, Cpu, Check, 
  Copy, ExternalLink, HardDrive, Shield, AlertCircle,
  Activity, Radio, Eye, Layers, Filter, Lock, Unlock,
  Sliders, SlidersHorizontal, Volume2, BarChart2, ArrowRight,
  AlertTriangle, Key, Terminal, FileText
} from 'lucide-react';
import { api } from '../services/api';
import SkeuoMeter from '../components/SkeuoMeter';
import SkeuoKnob from '../components/SkeuoKnob';
import SkeuoSwitch from '../components/SkeuoSwitch';
import InspectorDrawer from '../components/InspectorDrawer';
import { soundManager } from '../utils/soundEffects';

// High-dimension fallback nodes ensuring the VU Radar is NEVER blank
const FALLBACK_VECTOR_NODES = [
  { chunk_id: 'fb-1', doc_name: 'Attention_Is_All_You_Need.pdf', page: 3, word_count: 412, x: -18, y: 22, score: 0.94, snippet: 'The Transformer model architecture relies entirely on self-attention mechanisms to compute representations without sequence-aligned RNNs.' },
  { chunk_id: 'fb-2', doc_name: 'ContextOS_Architecture_Spec.md', page: 1, word_count: 320, x: 25, y: -15, score: 0.89, snippet: '5-stage air-gapped physical signal conveyor: Intake -> Cleaver -> 768-D Encoder -> Cosine Matcher -> Synthesis.' },
  { chunk_id: 'fb-3', doc_name: 'Vector_Embeddings_Guide.txt', page: 5, word_count: 280, x: 12, y: 30, score: 0.86, snippet: 'High-dimensional latent embeddings map semantic meaning into metric spaces where cosine proximity reflects conceptual similarity.' },
  { chunk_id: 'fb-4', doc_name: 'Bionic_Local_Inference.md', page: 2, word_count: 390, x: -28, y: -20, score: 0.91, snippet: 'Zero outbound telemetry: local GPU loopback on http://localhost:1234/v1 executing quantized Qwen and Gemma checkpoints.' },
  { chunk_id: 'fb-5', doc_name: 'Chunking_Strategies_Report.pdf', page: 4, word_count: 350, x: -8, y: -32, score: 0.82, snippet: 'Sliding window overlap prevents semantic boundary fractures during text slicing, ensuring complete retrieval context.' },
  { chunk_id: 'fb-6', doc_name: 'Cosine_Proximity_Math.pdf', page: 2, word_count: 295, x: 32, y: 18, score: 0.88, snippet: 'dot(A, B) / (||A|| * ||B||) yields scale-invariant directional orientation in 768-dimensional hyperspace.' },
  { chunk_id: 'fb-7', doc_name: 'Generative_AI_Lab_Guide.txt', page: 1, word_count: 440, x: 0, y: -12, score: 0.93, snippet: 'Retrieval Augmented Generation bridges the static knowledge cutoff of neural parameters with dynamic enterprise ground truth.' },
  { chunk_id: 'fb-8', doc_name: 'KV_Cache_Optimization.md', page: 3, word_count: 310, x: -35, y: 10, score: 0.79, snippet: 'Paged attention and FP8 quantization reduce VRAM footprint while sustaining 45+ tokens per second on consumer silicon.' },
  { chunk_id: 'fb-9', doc_name: 'Context_Assembly_Pipeline.pdf', page: 6, word_count: 375, x: 18, y: -30, score: 0.85, snippet: 'Hierarchical prompt injection ranks top-k chunks by cosine score, trimming payload to stay within the 8192 token window.' },
  { chunk_id: 'fb-10', doc_name: 'Hardware_Skeuomorphism.spec', page: 1, word_count: 260, x: -15, y: -10, score: 0.95, snippet: 'Physical laboratory workstation metaphor: paper-like document cards, galvanometer needles, phosphor CRT screens, rotary potentiometers.' }
];

const FREQ_BANDS = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

export default function Dashboard({ 
  bionicStatus, 
  onRefreshStatus, 
  setView,
  isAuthenticated = false,
  operatorId = 'ADMIN-01',
  onLoginRequest,
  onLogout
}) {
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
  const [eqLevels, setEqLevels] = useState([65, 80, 45, 90, 75, 85, 60, 70, 95, 50]);

  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'ContextOS RAG Studio initialized on air-gapped machine loopback. Ingest knowledge dossiers into the Document Vault or transmit queries over the 768-D semantic bus.',
      citations: [],
      telemetry: null,
      systemBadge: 'LOCAL CORE ACTIVE'
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

  // Animate graphic equalizer slightly for authentic analog life
  useEffect(() => {
    const interval = setInterval(() => {
      setEqLevels(prev => prev.map(lvl => {
        const jitter = (Math.random() - 0.5) * 16;
        return Math.min(100, Math.max(20, Math.round(lvl + jitter)));
      }));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

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
    // SECURITY INTERLOCK CHECK: Only authenticated users can query RAG
    if (!isAuthenticated) {
      soundManager.playSwitch();
      if (onLoginRequest) {
        onLoginRequest();
      } else if (setView) {
        setView('auth');
      }
      return;
    }

    const query = (textToSend || queryInput).trim();
    if (!query || isStreaming) return;

    soundManager.playKeyClick();
    setQueryInput('');
    setIsStreaming(true);

    // Needle deflects up on query launch
    setVuCosineLevel(0.88 + Math.random() * 0.08);
    setVuDecibelLevel(0.72 + Math.random() * 0.15);

    // Append User Message
    const userMsg = { role: 'user', content: query };
    const assistantMsg = {
      role: 'assistant',
      content: '',
      citations: [],
      telemetry: null,
      systemBadge: 'INFERENCE BUS ENGAGED'
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: settings.top_k })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep partial

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr.trim() === '[DONE]') continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.citations) {
                setActiveCitations(data.citations);
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx].citations = data.citations;
                  return updated;
                });
                // Bump needle on citation retrieval
                setVuCosineLevel(Math.min(0.98, data.citations[0]?.score || 0.85));
              }

              if (data.token) {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx].content += data.token;
                  return updated;
                });
              }

              if (data.telemetry) {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx].telemetry = data.telemetry;
                  updated[lastIdx].systemBadge = data.telemetry.engine?.toUpperCase() || 'LOCAL SILICON';
                  return updated;
                });
              }

            } catch (e) {
              console.error('Error parsing SSE event:', e);
            }
          }
        }
      }

    } catch (err) {
      console.error('Query error:', err);
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx].content = `[INFERENCE INTERRUPT] Unable to stream response: ${err.message}. Ensure Bionic LLM is active on port 1234.`;
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  // Upload Files to Document Vault
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    soundManager.playSwitch();
    showToast(`Ingesting ${files.length} document(s)...`);
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
    soundManager.playSwitch();
    showToast('Loading pre-built knowledge base dossiers...');
    try {
      const res = await api.preloadSamples();
      showToast(`Loaded ${res.preloaded?.length || 0} document dossiers.`);
      await loadData();
    } catch (err) {
      showToast('Failed to load samples');
    }
  };

  // Delete Document
  const handleDeleteDoc = async (docId) => {
    if (!confirm('Shred document dossier and purge vector chunks from local memory?')) return;
    soundManager.playSwitch();
    try {
      await api.deleteDocument(docId);
      showToast('Document purged.');
      await loadData();
    } catch (err) {
      showToast('Failed to purge document');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    soundManager.playKeyClick();
    try {
      await api.updateSettings(settings);
      showToast('RAG hyperparameters committed to chassis memory!');
      if (onRefreshStatus) onRefreshStatus();
    } catch (err) {
      showToast('Failed to save settings');
    }
  };

  const handleOpenChunk = (chunk) => {
    soundManager.playKeyClick();
    setSelectedChunk(chunk);
    setIsInspectorOpen(true);
  };

  // Combine real chunks with fallback nodes so radar is NEVER empty
  const activeChunksList = chunks.length > 0 ? chunks : FALLBACK_VECTOR_NODES;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden bg-[#0b0e14] text-slate-100 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 px-4 py-2.5 rounded-xl skeuo-chassis border border-cyan-500/50 text-cyan-300 font-mono text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 skeuo-diode-cyan" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          LEFT NAVIGATION SIDEBAR (Heavy Machined Workstation Chassis)
          ========================================================================= */}
      <aside className="w-full md:w-64 skeuo-chassis border-r border-slate-700/80 flex flex-col justify-between p-4 z-20 select-none shadow-2xl">
        
        {/* Navigation Tabs with Official Horizontal Logo */}
        <div className="space-y-5">
          
          {/* Logo Nameplate Header */}
          <div className="px-1 pt-1 pb-3 border-b border-slate-800">
            <div className="h-10 px-2 py-1 rounded-xl skeuo-inset flex items-center justify-center border border-slate-700 bg-slate-900/60 shadow-inner mb-2">
              <img 
                src="/Horizontal_stack_logo.png" 
                alt="ContextOS Workstation" 
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]" 
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-semibold px-2">
              <span>WORKSTATION BUS</span>
              <span className="text-cyan-400 font-bold">MK-IV RACK</span>
            </div>
          </div>

          {/* Navigation Keycaps */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                soundManager.playKeyClick();
                setActiveTab('chat');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'skeuo-btn-primary text-white shadow-lg'
                  : 'skeuo-btn text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-cyan-300" />
              <span>RAG Studio</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 skeuo-diode-cyan" />
            </button>

            <button
              onClick={() => {
                soundManager.playKeyClick();
                setActiveTab('vault');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'vault'
                  ? 'skeuo-btn-primary text-white shadow-lg'
                  : 'skeuo-btn text-slate-300 hover:text-white'
              }`}
            >
              <FolderArchive className="w-4 h-4 text-amber-300" />
              <span>Document Vault</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full skeuo-inset text-slate-300">
                {documents.length}
              </span>
            </button>

            <button
              onClick={() => {
                soundManager.playKeyClick();
                setActiveTab('spectrum');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'spectrum'
                  ? 'skeuo-btn-primary text-white shadow-lg'
                  : 'skeuo-btn text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>VU Spectrum</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 skeuo-diode-green" />
            </button>

            <button
              onClick={() => {
                soundManager.playKeyClick();
                setActiveTab('matrix');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'skeuo-btn-primary text-white shadow-lg'
                  : 'skeuo-btn text-slate-300 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4 text-purple-300" />
              <span>Vector Matrix</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/60 text-purple-400 font-bold">
                768-D
              </span>
            </button>

            <button
              onClick={() => {
                soundManager.playKeyClick();
                setActiveTab('settings');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'skeuo-btn-primary text-white shadow-lg'
                  : 'skeuo-btn text-slate-300 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-300" />
              <span>Engine Rack</span>
            </button>
          </nav>
        </div>

        {/* Security & Operator Clearance Status Card */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          
          <div className="p-3 rounded-2xl skeuo-inset space-y-2 text-xs font-mono border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase text-[10px]">CLEARANCE STATUS</span>
              {isAuthenticated ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 skeuo-diode-green" />
                  <span>LVL-4 ACTIVE</span>
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 skeuo-diode-amber" />
                  <span>LOCKED</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[10px] text-slate-500">OPERATOR:</span>
              <span className="text-cyan-300 font-bold truncate max-w-[120px]">{operatorId}</span>
            </div>

            {/* Quick Lock / Auth Switch Button */}
            <div className="pt-1">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    soundManager.playSwitch();
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-1.5 rounded-lg skeuo-btn text-amber-400 hover:text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/20"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Lock Console</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playKeyClick();
                    if (onLoginRequest) onLoginRequest();
                    else setView('auth');
                  }}
                  className="w-full py-1.5 rounded-lg skeuo-btn-primary text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3 h-3 text-cyan-300" />
                  <span>Authenticate Operator</span>
                </button>
              )}
            </div>
          </div>

          {/* Telemetry Readout */}
          <div className="p-3 rounded-2xl skeuo-inset space-y-1.5 text-[11px] font-mono border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400">
              <span>INDEXED CHUNKS</span>
              <span className="text-cyan-400 font-bold">{chunks.length}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>EMBEDDING BUS</span>
              <span className="text-purple-400 font-bold">768-D</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>LOCAL SILICON</span>
              <span className="text-emerald-400 font-bold">127.0.0.1</span>
            </div>
          </div>

        </div>

      </aside>

      {/* =========================================================================
          MAIN WORKSTATION STAGE (Center Deck)
          ========================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* =====================================================================
            TAB 1: RAG STUDIO (Physical Teletype Terminal with Live VU Bridge)
            ===================================================================== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full max-w-5xl mx-auto w-full p-4 sm:p-6 justify-between overflow-hidden">
            
            {/* Top Deck: Dual Analog Needle VU Bridge & Telemetry Strip */}
            <div className="skeuo-chassis p-4 rounded-2xl border border-slate-700/80 shadow-xl mb-4 relative">
              <div className="absolute top-2 left-2 w-2.5 h-2.5 skeuo-screw" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 skeuo-screw" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left Galvanometer: Cosine Similarity Coherence */}
                <div className="flex items-center gap-3">
                  <SkeuoMeter 
                    value={vuCosineLevel * 100} 
                    min={0} 
                    max={100} 
                    label="COSINE PROXIMITY" 
                    unit="%" 
                  />
                  <div className="hidden lg:block space-y-1 text-left font-mono">
                    <div className="text-[10px] text-slate-400 uppercase">COHERENCE VECTOR</div>
                    <div className="text-sm font-bold text-cyan-400">{(vuCosineLevel * 100).toFixed(1)}%</div>
                    <div className="text-[9px] text-slate-500">768-D DOT METRIC</div>
                  </div>
                </div>

                {/* Center Console Status Badge */}
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-[10px] font-mono text-cyan-300 border border-slate-700">
                    <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'skeuo-diode-green' : 'skeuo-diode-amber'}`} />
                    <span>{isAuthenticated ? 'RAG PIPELINE READY' : 'INTERLOCK ACTIVE // LOCKED'}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Model: <span className="text-slate-200 font-bold">{settings.chat_model.split('/')[1] || settings.chat_model}</span> • Top-K: <span className="text-cyan-400 font-bold">{settings.top_k}</span>
                  </div>
                </div>

                {/* Right Galvanometer: Signal Density dB */}
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block space-y-1 text-right font-mono">
                    <div className="text-[10px] text-slate-400 uppercase">SIGNAL HARMONICS</div>
                    <div className="text-sm font-bold text-amber-400">{(vuDecibelLevel * 12 - 2).toFixed(1)} dB</div>
                    <div className="text-[9px] text-slate-500">AIR-GAP BUS</div>
                  </div>
                  <SkeuoMeter 
                    value={vuDecibelLevel * 100} 
                    min={0} 
                    max={100} 
                    label="SIGNAL DENSITY" 
                    unit="VU" 
                  />
                </div>

              </div>
            </div>

            {/* SECURITY LOCKOUT BANNER IF UNAUTHENTICATED */}
            {!isAuthenticated && (
              <div className="skeuo-chassis p-5 sm:p-6 rounded-2xl border-2 border-amber-500/60 shadow-2xl mb-4 relative overflow-hidden animate-pulse">
                <div className="absolute top-2 left-2 w-2.5 h-2.5 skeuo-screw" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 skeuo-screw" />
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl skeuo-inset border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner flex-shrink-0">
                      <Lock className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold font-mono text-amber-400 tracking-wide flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>ACCESS RESTRICTED: OPERATOR CLEARANCE REQUIRED</span>
                      </div>
                      <p className="text-xs font-mono text-slate-300">
                        Hardware security interlock engaged. You must authenticate as an authorized Operator to query the local RAG inference pipeline.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        soundManager.playKeyClick();
                        if (onLoginRequest) onLoginRequest();
                        else setView('auth');
                      }}
                      className="flex-1 sm:flex-initial skeuo-btn-primary px-4 py-2.5 rounded-xl text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Key className="w-3.5 h-3.5 text-cyan-200" />
                      <span>Authenticate Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Suggestion Prompts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs select-none">
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">Suggested Keys:</span>
              <button 
                onClick={() => handleSendQuery('Explain the 5-stage RAG pipeline of ContextOS')}
                disabled={!isAuthenticated}
                className="whitespace-nowrap px-3 py-1 rounded-xl skeuo-btn text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                5-Stage RAG Pipeline
              </button>
              <button 
                onClick={() => handleSendQuery('How does cosine similarity calculate relevance in 768-D vector space?')}
                disabled={!isAuthenticated}
                className="whitespace-nowrap px-3 py-1 rounded-xl skeuo-btn text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cosine Similarity Math
              </button>
              <button 
                onClick={() => handleSendQuery('What are the chunk size trade-offs?')}
                disabled={!isAuthenticated}
                className="whitespace-nowrap px-3 py-1 rounded-xl skeuo-btn text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Chunk Size Trade-offs
              </button>
            </div>

            {/* Messages CRT Scroll Stage */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-2 skeuo-screen p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-inner">
              
              {/* CRT Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none" />

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 relative z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl skeuo-btn flex items-center justify-center text-xs font-mono font-bold text-cyan-300 shadow-md flex-shrink-0 border border-cyan-500/30">
                      COS
                    </div>
                  )}

                  <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'skeuo-chassis border border-cyan-500/50 text-white shadow-xl' 
                      : 'skeuo-inset border-l-4 border-l-cyan-400 text-slate-200 shadow-inner'
                  }`}>
                    {/* Standby Engine Badge */}
                    {msg.systemBadge && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md skeuo-inset text-cyan-300 text-[10px] font-mono mb-2.5 border border-slate-700">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{msg.systemBadge}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-mono leading-relaxed">
                      {msg.content || (isStreaming && i === messages.length - 1 ? '▋' : '')}
                    </div>

                    {/* Citations Grounding Tray */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700/80 flex flex-wrap gap-2">
                        {msg.citations.map((c, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleOpenChunk(c)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg skeuo-btn hover:border-cyan-400 text-cyan-300 text-xs font-mono transition-all cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span>[S{c.source_id}] {c.doc_name} (p.{c.page})</span>
                            <span className="text-[10px] text-emerald-400 font-bold">• {(c.score * 100).toFixed(0)}%</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Telemetry Tag */}
                    {msg.telemetry && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex flex-wrap items-center gap-3">
                        <span>⏱ {msg.telemetry.elapsed_seconds}s</span>
                        <span>⚡ {msg.telemetry.tokens_per_second} tok/s</span>
                        <span>🧩 {msg.citations?.length || 0} citations</span>
                        <span>⚙️ {msg.telemetry.engine}</span>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl skeuo-inset flex items-center justify-center text-xs font-mono font-bold text-slate-300 flex-shrink-0 border border-slate-700">
                      OP
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Physical Teletype Prompt Input Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
              className="skeuo-chassis p-2.5 rounded-2xl border border-slate-700 flex items-center gap-3 shadow-2xl relative"
            >
              <div className="absolute top-2 left-2 w-2 h-2 skeuo-screw" />
              <div className="absolute top-2 right-2 w-2 h-2 skeuo-screw" />

              <div className="flex-1 skeuo-inset rounded-xl p-1 flex items-center">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  disabled={!isAuthenticated || isStreaming}
                  placeholder={
                    !isAuthenticated 
                      ? "🔒 TERMINAL LOCKED — OPERATOR CLEARANCE REQUIRED" 
                      : isStreaming 
                        ? "Streaming token synthesis over 768-D bus..." 
                        : "Transmit query over 768-D semantic vector bus..."
                  }
                  className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-500 outline-none disabled:opacity-50"
                />
              </div>

              {isAuthenticated ? (
                <button
                  type="submit"
                  disabled={!queryInput.trim() || isStreaming}
                  className="skeuo-btn-primary px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  <span>Transmit</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    if (onLoginRequest) onLoginRequest();
                    else setView('auth');
                  }}
                  className="skeuo-btn px-4 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Locked</span>
                </button>
              )}
            </form>

          </div>
        )}

        {/* =====================================================================
            TAB 2: DOCUMENT VAULT (Physical File Cabinet & Paper Cards)
            ===================================================================== */}
        {activeTab === 'vault' && (
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tight flex items-center gap-2.5">
                  <FolderArchive className="w-6 h-6 text-amber-400" />
                  <span>Air-Gapped Document Vault</span>
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Local physical document cabinet with semantic chunking & 768-D embeddings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreloadSamples}
                  className="skeuo-btn px-4 py-2 rounded-xl text-xs font-mono font-bold text-cyan-300 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preload Sample Dossiers</span>
                </button>
              </div>
            </div>

            {/* Physical Ingestion Hopper Slot */}
            <label className="block skeuo-inset p-8 rounded-3xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 cursor-pointer text-center space-y-3 transition-colors group">
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl skeuo-btn flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-lg">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold font-mono text-white">DOCUMENT INGESTION HOPPER</div>
                <div className="text-xs font-mono text-slate-400">
                  Drag & drop dossiers or click to browse (PDF, DOCX, TXT, CSV, JSON)
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset text-[10px] font-mono text-slate-400 border border-slate-800">
                <span>LOCAL 768-D NOMIC CHUNK ENGINE</span>
              </div>
            </label>

            {/* Document Cards Tray */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
                <span>INDEXED DOSSIERS ({documents.length})</span>
                <span>PHYSICAL DISK RECORD</span>
              </div>

              {documents.length === 0 ? (
                <div className="skeuo-inset p-8 rounded-2xl text-center space-y-3">
                  <div className="text-xs font-mono text-slate-400">
                    Vault is currently unpopulated. Ingest documents via the hopper above or click Preload Sample Dossiers.
                  </div>
                  <button
                    onClick={handlePreloadSamples}
                    className="skeuo-btn-primary px-4 py-2 rounded-xl text-xs font-mono font-bold text-white cursor-pointer"
                  >
                    Load Pre-Built Knowledge Dossiers
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div 
                      key={doc.doc_id} 
                      className="paper-card p-5 rounded-xl flex flex-col justify-between space-y-3 shadow-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold font-mono text-sm text-stone-900 truncate">
                            {doc.doc_name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-300/80 text-stone-800 font-bold flex-shrink-0">
                            DOC
                          </span>
                        </div>
                        <p className="text-xs font-mono text-stone-600">
                          {doc.chunk_count} vector chunks • {(doc.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-300">
                        <span className="text-[10px] font-mono text-stone-500">
                          ID: {doc.doc_id.slice(0, 10)}...
                        </span>
                        <button
                          onClick={() => handleDeleteDoc(doc.doc_id)}
                          className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Purge Document Dossier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 3: VECTOR VU SPECTRUM & RADAR ANALYZER (Fully Displayed & Live)
            ===================================================================== */}
        {activeTab === 'spectrum' && (
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header & Status Diode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tight flex items-center gap-2">
                    <Activity className="w-6 h-6 text-cyan-400" />
                    <span>Vector VU Spectrum & Signal Analyzer</span>
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                    768-D BUS ACTIVE
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Real-time analog galvanometer telemetry, 10-band frequency equalizer, and 2D dense vector projection radar.
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
                  <option value="ALL">ALL SOURCES ({activeChunksList.length})</option>
                  {documents.map((d, i) => (
                    <option key={i} value={d.doc_name}>{d.doc_name} ({d.chunk_count})</option>
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
                    value={vuCosineLevel * 100} 
                    min={0} 
                    max={100} 
                    label="COSINE COHERENCE" 
                    unit="SIMILARITY" 
                  />
                  <div className="mt-2 text-center font-mono text-xs">
                    <span className="text-slate-400">TARGET CONFIDENCE: </span>
                    <span className="text-cyan-400 font-bold">{(vuCosineLevel * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Right Needle: Signal Density dB */}
                <div className="flex flex-col items-center">
                  <SkeuoMeter 
                    value={vuDecibelLevel * 100} 
                    min={0} 
                    max={100} 
                    label="SIGNAL DENSITY" 
                    unit="DECIBELS" 
                  />
                  <div className="mt-2 text-center font-mono text-xs">
                    <span className="text-slate-400">HARMONIC INTENSITY: </span>
                    <span className="text-amber-400 font-bold">{(vuDecibelLevel * 10 - 2).toFixed(1)} dB</span>
                  </div>
                </div>

              </div>

              {/* 10-Band Graphic Spectrum Equalizer */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold text-center mb-2">
                  10-BAND HARMONIC SPECTRUM EQUALIZER (SEMANTIC ENERGY DISTRIBUTION)
                </div>
                <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto items-end h-24 p-2 skeuo-inset rounded-xl border border-slate-800">
                  {FREQ_BANDS.map((freq, idx) => (
                    <div key={freq} className="flex flex-col items-center h-full justify-end">
                      <div className="w-full bg-slate-900 rounded-sm h-16 flex flex-col justify-end overflow-hidden p-0.5">
                        <div 
                          style={{ height: `${eqLevels[idx]}%` }}
                          className={`w-full rounded-sm transition-all duration-300 ${
                            eqLevels[idx] > 85 
                              ? 'bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500 shadow-[0_0_8px_#ef4444]' 
                              : 'bg-gradient-to-t from-cyan-500 to-emerald-400 shadow-[0_0_6px_#06b6d4]'
                          }`}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 mt-1">{freq}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RADAR CRT PROJECTION GRID & CONTROLS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Radar CRT Display (2 Columns) */}
              <div className="lg:col-span-2 skeuo-screen p-6 rounded-3xl min-h-[460px] flex flex-col justify-between relative overflow-hidden border border-slate-700">
                
                {/* CRT Glass Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none z-10" />
                
                {/* Radar Sweep rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                  <div className="w-[360px] h-[360px] rounded-full border border-cyan-400 animate-spin [animation-duration:14s]" />
                  <div className="w-[240px] h-[240px] rounded-full border border-cyan-400/60 absolute" />
                  <div className="w-[120px] h-[120px] rounded-full border border-cyan-400/40 absolute" />
                  <div className="w-full h-px bg-cyan-400/30 absolute" />
                  <div className="h-full w-px bg-cyan-400/30 absolute" />
                </div>

                {/* Scope Header */}
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300 z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full skeuo-diode-emerald" />
                    <span>CRT VECTOR PROJECTION RADAR // 2D TOPOLOGY</span>
                  </div>
                  <span className="text-slate-400">
                    BLIPS: {
                      activeDocFilter === 'ALL' 
                        ? activeChunksList.length 
                        : activeChunksList.filter(c => c.doc_name === activeDocFilter).length
                    }
                  </span>
                </div>

                {/* Radar Plot Field */}
                <div className="relative w-full h-[320px] my-3 z-20 overflow-hidden">
                  {activeChunksList
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
                            left: `${Math.max(6, Math.min(94, posX))}%`,
                            top: `${Math.max(6, Math.min(94, posY))}%`
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-150 ${
                            isCited ? 'z-30' : 'z-20'
                          }`}
                          title={`${c.doc_name} (Page ${c.page}): ${c.snippet?.slice(0, 60)}...`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                            isCited
                              ? 'bg-emerald-400 shadow-[0_0_14px_#34d399] ring-2 ring-emerald-300 animate-ping'
                              : 'bg-cyan-400/90 hover:bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.9)]'
                          }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>

                          {/* Hover Tooltip Card */}
                          <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 w-52 p-3 rounded-xl skeuo-chassis border border-cyan-400/60 text-[10px] font-mono text-slate-200 shadow-2xl pointer-events-none z-50">
                            <span className="text-cyan-300 font-bold block truncate">{c.doc_name}</span>
                            <span className="text-slate-400 block">Page {c.page} • {c.word_count || 300} words</span>
                            <span className="text-slate-300 line-clamp-2 mt-1">{c.snippet}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Scope Footer Stats */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-20 border-t border-cyan-500/20 pt-2">
                  <span>SCALE: {vectorZoom.toFixed(1)}x MAGNIFICATION</span>
                  <span>BEARING: 045° NNE</span>
                  <span className="text-emerald-400">ACTIVE TARGETS: {activeCitations.length}</span>
                </div>
              </div>

              {/* Tactile Control & Calibration Bay (1 Column) */}
              <div className="skeuo-chassis p-6 rounded-3xl border border-slate-700 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
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
                      Run a query in RAG Studio to lock onto live chunk citations.
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
                    soundManager.playSwitch();
                    setVuCosineLevel(0.85 + Math.random() * 0.1);
                    setVuDecibelLevel(0.70 + Math.random() * 0.15);
                  }}
                  className="w-full skeuo-btn py-3 rounded-xl text-xs font-mono font-bold text-slate-200 uppercase tracking-wider cursor-pointer"
                >
                  Test Needle Deflection
                </button>
              </div>

            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 4: VECTOR MATRIX (Bento Memory Cartridge Grid)
            ===================================================================== */}
        {activeTab === 'matrix' && (
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tight flex items-center gap-2">
                  <Grid className="w-6 h-6 text-purple-400" />
                  <span>Bento Vector Matrix</span>
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Dense 768-dimensional vector memory cartridges stored in air-gapped machine RAM.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl skeuo-inset text-xs font-mono text-purple-300 border border-slate-800">
                TOTAL CHUNKS: <span className="font-bold text-white">{activeChunksList.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChunksList.map((c, i) => (
                <div 
                  key={c.chunk_id || i}
                  onClick={() => handleOpenChunk(c)}
                  className="skeuo-chassis p-5 rounded-2xl border border-slate-700 space-y-3 cursor-pointer hover:border-cyan-500/50 transition-all shadow-xl group"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold truncate max-w-[170px] group-hover:text-cyan-300">
                      {c.doc_name}
                    </span>
                    <span className="text-slate-400 px-2 py-0.5 rounded-md skeuo-inset text-[10px]">
                      p.{c.page}
                    </span>
                  </div>
                  
                  <div className="p-3 rounded-xl skeuo-inset">
                    <p className="text-xs font-mono text-slate-300 line-clamp-3 leading-relaxed">
                      {c.snippet || c.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span>{c.word_count || 300} words</span>
                    <span className="text-purple-400 font-bold">
                      ({c.x ? c.x.toFixed(1) : '0.0'}, {c.y ? c.y.toFixed(1) : '0.0'})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: ENGINE SETTINGS (Brushed Rack Control Panel)
            ===================================================================== */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tight flex items-center gap-2">
                <Settings className="w-6 h-6 text-slate-300" />
                <span>Engine Configuration Rack</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Calibrate local LLM endpoints, 768-D embedding tensors, and retrieval hyperparameters.
              </p>
            </div>

            <div className="skeuo-chassis p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 shadow-2xl relative">
              <div className="absolute top-3 left-3 w-3 h-3 skeuo-screw" />
              <div className="absolute top-3 right-3 w-3 h-3 skeuo-screw" />
              <div className="absolute bottom-3 left-3 w-3 h-3 skeuo-screw" />
              <div className="absolute bottom-3 right-3 w-3 h-3 skeuo-screw" />

              {/* Endpoint */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-300 font-bold">
                  LOCAL LLM ENDPOINT (BIONIC / LM STUDIO)
                </label>
                <div className="skeuo-inset rounded-xl p-1.5">
                  <input
                    type="text"
                    value={settings.llm_base_url}
                    onChange={(e) => setSettings({ ...settings, llm_base_url: e.target.value })}
                    className="w-full bg-transparent px-3 py-2 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-300 font-bold">
                  CHAT MODEL SELECTOR
                </label>
                <div className="skeuo-inset rounded-xl p-1.5">
                  <select
                    value={settings.chat_model}
                    onChange={(e) => setSettings({ ...settings, chat_model: e.target.value })}
                    className="w-full bg-transparent px-3 py-2 text-white font-mono text-sm outline-none cursor-pointer"
                  >
                    <option value="qwen/qwen3.5-9b" className="bg-slate-900">qwen/qwen3.5-9b (Local Bionic)</option>
                    <option value="google/gemma-4-e2b" className="bg-slate-900">google/gemma-4-e2b (Lightweight 2B)</option>
                    <option value="qwen3.6-12b-iq" className="bg-slate-900">qwen3.6-12b-iq</option>
                    <option value="gemma-4-e4b-uncensored-hauhaucs-aggressive" className="bg-slate-900">gemma-4-e4b</option>
                  </select>
                </div>
              </div>

              {/* Top-K Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300 font-bold">
                  <span>RETRIEVAL DEPTH (TOP-K CHUNKS)</span>
                  <span className="text-cyan-400 font-bold">{settings.top_k} CHUNKS</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.top_k}
                  onChange={(e) => setSettings({ ...settings, top_k: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300 font-bold">
                  <span>SYNTHESIS TEMPERATURE</span>
                  <span className="text-purple-400 font-bold">{settings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                className="w-full py-3.5 rounded-xl skeuo-btn-primary text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>Commit Hyperparameters</span>
                <Check className="w-4 h-4" />
              </button>

            </div>
          </div>
        )}

      </main>

      {/* Inspector Drawer for Detailed Chunk Inspection */}
      <InspectorDrawer
        chunk={selectedChunk}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

    </div>
  );
}
