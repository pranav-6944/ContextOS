/**
 * ContextOS - Core Client Controller & RAG Pipeline Orchestrator
 */

// Application State
const state = {
  activeTab: 'chat',
  documents: [],
  chunks: [],
  isQuerying: false,
  soundEnabled: true,
  settings: {
    chatModel: 'qwen/qwen3.5-9b',
    embeddingModel: 'text-embedding-nomic-embed-text-v1.5',
    topK: 4,
    temperature: 0.7,
    baseUrl: 'http://localhost:1234/v1'
  },
  telemetry: {
    lastLatency: 0,
    lastTps: 0,
    totalIndexedChunks: 0,
    bionicOnline: false
  }
};

let visualizer = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Three.js Visualizer
  visualizer = new GalaxyVisualizer('webgl-canvas');

  // Setup Visualizer Callbacks
  window.onChunkHover = (chunk, x, y) => showTooltip(chunk, x, y);
  window.onChunkLeave = () => hideTooltip();
  window.onChunkClick = (chunk) => openInspectorWithChunk(chunk);

  // Bind UI Events
  setupTabNavigation();
  setupUploadZone();
  setupChatHandlers();
  setupInspectorDrawer();
  setupSettingsModal();
  setupSoundToggle();

  // Load Initial Data
  await refreshSystemStatus();
  await refreshDocumentsAndChunks();

  // If no documents exist yet, offer to preload samples
  if (state.documents.length === 0) {
    await preloadSampleKnowledge(true);
  }
});

// --- System Status & Connectivity ---
async function refreshSystemStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    const indicator = document.getElementById('bionic-indicator');
    const statusText = document.getElementById('bionic-text');
    const modelBadge = document.getElementById('model-badge-text');

    state.telemetry.bionicOnline = data.bionic?.online || false;

    if (data.bionic?.online) {
      indicator.className = 'status-indicator online';
      statusText.innerText = 'Bionic: Connected';
      modelBadge.innerText = data.bionic.active_model || 'Local Model';
    } else {
      indicator.className = 'status-indicator';
      statusText.innerText = 'Bionic: Standby';
      modelBadge.innerText = 'Standby Synthesizer';
    }

    // Populate model options in settings modal if models exist
    if (data.bionic?.models && data.bionic.models.length > 0) {
      populateModelDropdown(data.bionic.models, data.bionic.active_model);
    }
  } catch (err) {
    console.warn('System status fetch failed:', err);
  }
}

// --- Documents & Chunks Management ---
async function refreshDocumentsAndChunks() {
  try {
    // 1. Fetch Documents
    const docRes = await fetch('/api/documents');
    const docData = await docRes.json();
    state.documents = docData.documents || [];
    renderVaultDocuments(state.documents);

    // 2. Fetch Chunks for 3D Visualizer & Bento
    const chunkRes = await fetch('/api/chunks');
    const chunkData = await chunkRes.json();
    state.chunks = chunkData.chunks || [];
    state.telemetry.totalIndexedChunks = state.chunks.length;

    // Update 3D Canvas
    if (visualizer) {
      visualizer.updateChunks(state.chunks);
    }

    // Update Bento Matrix
    renderBentoMatrix(state.chunks);

    // Update Telemetry HUD
    updateTelemetryCounters();
  } catch (err) {
    console.error('Error refreshing docs & chunks:', err);
  }
}

function renderVaultDocuments(docs) {
  const container = document.getElementById('vault-file-list');
  if (!container) return;

  if (docs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); padding: 20px 10px; font-size: 0.8rem;">
        No documents indexed.<br>Upload files or load samples below.
      </div>
    `;
    return;
  }

  container.innerHTML = docs.map(doc => `
    <div class="vault-item" data-id="${doc.doc_id}">
      <div class="vault-item-info">
        <div class="vault-item-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="vault-item-details">
          <div class="vault-item-name" title="${doc.doc_name}">${doc.doc_name}</div>
          <div class="vault-item-meta">${doc.chunk_count} chunks • ${(doc.file_size / 1024).toFixed(1)} KB</div>
        </div>
      </div>
      <button class="delete-doc-btn" onclick="deleteDocument('${doc.doc_id}')" title="Delete document">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `).join('');
}

async function deleteDocument(docId) {
  if (!confirm('Remove this document and delete its vector chunks?')) return;
  try {
    const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Document removed from vector store');
      await refreshDocumentsAndChunks();
    }
  } catch (err) {
    showToast('Failed to delete document', true);
  }
}

// --- Preload Samples ---
async function preloadSampleKnowledge(silent = false) {
  try {
    const res = await fetch('/api/preload-samples', { method: 'POST' });
    const data = await res.json();
    if (!silent) {
      showToast(`Preloaded ${data.preloaded?.length || 0} sample documents`);
    }
    await refreshDocumentsAndChunks();
  } catch (err) {
    console.error('Failed to preload samples:', err);
  }
}

// --- Upload Dropzone Handling ---
function setupUploadZone() {
  const dropzone = document.getElementById('vault-dropzone');
  const fileInput = document.getElementById('file-input');
  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(e.target.files);
      fileInput.value = '';
    }
  });

  const sampleBtn = document.getElementById('load-samples-btn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => preloadSampleKnowledge());
  }
}

async function uploadFiles(fileList) {
  const formData = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    formData.append('files', fileList[i]);
  }

  showToast(`Parsing & embedding ${fileList.length} file(s)...`);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`Successfully indexed ${data.documents?.length || 0} document(s)!`);
      if (window.soundFX) window.soundFX.playBeam();
      await refreshDocumentsAndChunks();
    } else {
      showToast(data.detail || 'Upload failed', true);
    }
  } catch (err) {
    showToast('Failed to upload files', true);
  }
}

// --- Chat & RAG Streaming ---
function setupChatHandlers() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query || state.isQuerying) return;
    input.value = '';
    executeRagQuery(query);
  });

  // Suggestion Pills Click
  document.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.getAttribute('data-query');
      if (q) executeRagQuery(q);
    });
  });
}

async function executeRagQuery(query) {
  state.isQuerying = true;
  const sendBtn = document.getElementById('send-query-btn');
  if (sendBtn) sendBtn.disabled = true;

  if (window.soundFX) window.soundFX.playBeam();

  // 1. Append User Message
  appendUserMessage(query);

  // 2. Prepare Assistant Bubble
  const { msgElement, textContainer, citationsContainer, telemetryContainer } = createAssistantMessageHolder();

  const startTime = performance.now();
  let accumulatedText = '';
  let citations = [];

  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query,
        top_k: state.settings.topK,
        temperature: state.settings.temperature,
        chat_model: state.settings.chatModel
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // keep trailing incomplete segment

      for (const block of lines) {
        if (!block.startsWith('data: ')) continue;
        const jsonStr = block.replace('data: ', '').trim();
        if (!jsonStr) continue;

        try {
          const payload = JSON.parse(jsonStr);

          if (payload.type === 'token') {
            accumulatedText += payload.token;
            textContainer.innerHTML = formatMarkdown(accumulatedText);
            scrollToBottom();
          } else if (payload.type === 'citations') {
            citations = payload.data || [];
            renderCitationsInMessage(citationsContainer, citations);
            // Trigger 3D laser pulse to retrieved chunks!
            if (visualizer) {
              visualizer.animateQueryRetrieval(citations);
            }
          } else if (payload.type === 'system_badge') {
            const badge = document.createElement('div');
            badge.className = 'engine-badge';
            badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ${payload.text}`;
            msgElement.querySelector('.msg-content-wrapper').prepend(badge);
          } else if (payload.type === 'telemetry') {
            const latency = Math.round(performance.now() - startTime);
            state.telemetry.lastLatency = latency;
          } else if (payload.type === 'done') {
            const stats = payload.stats || {};
            state.telemetry.lastTps = stats.tokens_per_second || 0;
            telemetryContainer.innerHTML = `
              <span>⏱ ${stats.elapsed_seconds || 0}s</span>
              <span>⚡ ${stats.tokens_per_second || 0} tok/s</span>
              <span>🧩 ${citations.length} sources</span>
              <span>⚙️ ${stats.engine || 'ContextOS'}</span>
            `;
            updateTelemetryCounters();
          }
        } catch (e) {
          console.warn('Error parsing SSE payload:', e);
        }
      }
    }
  } catch (err) {
    textContainer.innerHTML += `<p style="color: var(--rose-primary)">Error during generation: ${err.message}</p>`;
  } finally {
    state.isQuerying = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}

function appendUserMessage(text) {
  const scroller = document.getElementById('messages-scroller');
  if (!scroller) return;

  const msg = document.createElement('div');
  msg.className = 'chat-message user';
  msg.innerHTML = `
    <div class="msg-avatar">YOU</div>
    <div class="msg-content-wrapper">
      <div class="msg-bubble">${escapeHtml(text)}</div>
    </div>
  `;
  scroller.appendChild(msg);
  scrollToBottom();
}

function createAssistantMessageHolder() {
  const scroller = document.getElementById('messages-scroller');
  const msg = document.createElement('div');
  msg.className = 'chat-message assistant';

  msg.innerHTML = `
    <div class="msg-avatar">COS</div>
    <div class="msg-content-wrapper">
      <div class="msg-bubble"><span class="cursor-blink">▋</span></div>
      <div class="citation-badges-tray"></div>
      <div class="telemetry-tag"></div>
    </div>
  `;

  scroller.appendChild(msg);
  scrollToBottom();

  return {
    msgElement: msg,
    textContainer: msg.querySelector('.msg-bubble'),
    citationsContainer: msg.querySelector('.citation-badges-tray'),
    telemetryContainer: msg.querySelector('.telemetry-tag')
  };
}

function renderCitationsInMessage(container, citations) {
  container.innerHTML = citations.map(c => `
    <div class="citation-chip" onclick='openInspectorWithCitation(${JSON.stringify(c)})' title="View source snippet">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      [S${c.source_id}] ${escapeHtml(c.doc_name)} (p.${c.page}) • ${(c.score * 100).toFixed(0)}%
    </div>
  `).join('');
}

function scrollToBottom() {
  const scroller = document.getElementById('messages-scroller');
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
}

// --- Navigation Tabs ---
function setupTabNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchView(target);
    });
  });
}

function switchView(tabKey) {
  state.activeTab = tabKey;

  // Update tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
  });

  // Update panels
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `view-${tabKey}`);
  });

  if (window.soundFX) window.soundFX.playClick();

  // Reset or focus camera in 3D Galaxy view
  if (tabKey === 'galaxy' && visualizer) {
    visualizer.resetCamera();
  }
}

// --- Bento Matrix Render ---
function renderBentoMatrix(chunks) {
  const container = document.getElementById('bento-grid');
  if (!container) return;

  if (chunks.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 40px;">No chunks stored. Upload a document to populate the Bento Vector Matrix.</div>`;
    return;
  }

  container.innerHTML = chunks.map((c, i) => `
    <div class="bento-card" onclick='openInspectorWithChunk(${JSON.stringify(c)})'>
      <div class="bento-header">
        <span class="bento-doc-tag">${escapeHtml(c.doc_name)} • p.${c.page}</span>
        <span class="bento-coords">(${c.x.toFixed(1)}, ${c.y.toFixed(1)}, ${c.z.toFixed(1)})</span>
      </div>
      <div class="bento-snippet">${escapeHtml(c.snippet || c.text?.slice(0, 140) + '...')}</div>
      <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">
        <span>Chunk #${c.chunk_index !== undefined ? c.chunk_index : i}</span>
        <span>${c.word_count || 0} words</span>
      </div>
    </div>
  `).join('');
}

// --- Inspector Drawer ---
function setupInspectorDrawer() {
  const closeBtn = document.getElementById('close-drawer-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeInspector());
  }
}

function openInspectorWithChunk(chunk) {
  const drawer = document.getElementById('inspector-drawer');
  const content = document.getElementById('drawer-chunk-details');
  if (!drawer || !content) return;

  content.innerHTML = `
    <div class="setting-group">
      <span class="setting-label">SOURCE DOCUMENT</span>
      <div style="font-weight: 600; color: #ffffff;">${escapeHtml(chunk.doc_name || 'Document')} (Page ${chunk.page || 1})</div>
    </div>
    <div class="setting-group">
      <span class="setting-label">3D VECTOR COORDINATES</span>
      <div style="font-family: var(--font-mono); color: var(--cyan-primary);">
        X: ${chunk.x?.toFixed(2) || '0.00'} | Y: ${chunk.y?.toFixed(2) || '0.00'} | Z: ${chunk.z?.toFixed(2) || '0.00'}
      </div>
    </div>
    <div class="setting-group">
      <span class="setting-label">CHUNK METRICS</span>
      <div style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.8rem;">
        Words: ${chunk.word_count || 0} • Section: ${escapeHtml(chunk.section || 'General')}
      </div>
    </div>
    <div class="setting-group">
      <span class="setting-label">FULL CHUNK TEXT</span>
      <div style="background: rgba(0,0,0,0.5); padding: 14px; border-radius: 8px; border: 1px solid var(--border-glass); font-size: 0.85rem; line-height: 1.6; max-height: 350px; overflow-y: auto;">
        ${escapeHtml(chunk.text || chunk.snippet || '')}
      </div>
    </div>
  `;

  drawer.classList.add('open');
}

function openInspectorWithCitation(cit) {
  // Find full chunk from memory
  const chunk = state.chunks.find(c => c.chunk_id === cit.chunk_id) || cit;
  openInspectorWithChunk(chunk);
}

function closeInspector() {
  const drawer = document.getElementById('inspector-drawer');
  if (drawer) drawer.classList.remove('open');
}

// --- Tooltip on 3D Hover ---
function showTooltip(chunk, x, y) {
  let tip = document.getElementById('galaxy-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'galaxy-tooltip';
    tip.style.position = 'fixed';
    tip.style.zIndex = '30';
    tip.style.background = 'rgba(13, 18, 31, 0.95)';
    tip.style.border = '1px solid var(--cyan-primary)';
    tip.style.borderRadius = '8px';
    tip.style.padding = '8px 12px';
    tip.style.color = '#ffffff';
    tip.style.fontSize = '0.75rem';
    tip.style.pointerEvents = 'none';
    tip.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
    tip.style.maxWidth = '250px';
    document.body.appendChild(tip);
  }

  tip.innerHTML = `
    <div style="color: var(--cyan-primary); font-weight: 600; font-family: var(--font-mono); margin-bottom: 2px;">
      ${escapeHtml(chunk.doc_name)} (p.${chunk.page})
    </div>
    <div style="color: var(--text-muted); line-height: 1.3;">
      ${escapeHtml(chunk.snippet || '')}
    </div>
  `;

  tip.style.left = `${x + 14}px`;
  tip.style.top = `${y + 14}px`;
  tip.style.display = 'block';
}

function hideTooltip() {
  const tip = document.getElementById('galaxy-tooltip');
  if (tip) tip.style.display = 'none';
}

// --- Settings Modal ---
function setupSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('open-settings-btn');
  const closeBtn = document.getElementById('close-settings-btn');
  const saveBtn = document.getElementById('save-settings-btn');

  if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  // Top-K and Temp slider live updates
  const topKSlider = document.getElementById('setting-top-k');
  const topKVal = document.getElementById('top-k-val');
  if (topKSlider && topKVal) {
    topKSlider.addEventListener('input', (e) => topKVal.innerText = e.target.value);
  }

  const tempSlider = document.getElementById('setting-temp');
  const tempVal = document.getElementById('temp-val');
  if (tempSlider && tempVal) {
    tempSlider.addEventListener('input', (e) => tempVal.innerText = e.target.value);
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const topK = parseInt(topKSlider.value);
      const temp = parseFloat(tempSlider.value);
      const modelSelect = document.getElementById('setting-chat-model');

      state.settings.topK = topK;
      state.settings.temperature = temp;
      if (modelSelect && modelSelect.value) {
        state.settings.chatModel = modelSelect.value;
      }

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          top_k: topK,
          temperature: temp,
          chat_model: state.settings.chatModel
        })
      });

      modal.classList.remove('open');
      showToast('Settings saved successfully');
      await refreshSystemStatus();
    });
  }
}

function populateModelDropdown(models, currentActive) {
  const select = document.getElementById('setting-chat-model');
  if (!select) return;
  select.innerHTML = models.map(m => `
    <option value="${m}" ${m === currentActive ? 'selected' : ''}>${m}</option>
  `).join('');
}

// --- Audio Feedback Toggle ---
function setupSoundToggle() {
  const btn = document.getElementById('sound-toggle-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (window.soundFX) window.soundFX.enabled = state.soundEnabled;
    btn.style.color = state.soundEnabled ? 'var(--cyan-primary)' : 'var(--text-dim)';
    showToast(state.soundEnabled ? 'Audio Feedback: ON' : 'Audio Feedback: MUTED');
  });
}

// --- Telemetry Counters ---
function updateTelemetryCounters() {
  const chunkCounter = document.getElementById('hud-total-chunks');
  const latencyCounter = document.getElementById('hud-latency');
  const tpsCounter = document.getElementById('hud-tps');

  if (chunkCounter) chunkCounter.innerText = state.telemetry.totalIndexedChunks;
  if (latencyCounter) latencyCounter.innerText = `${state.telemetry.lastLatency}ms`;
  if (tpsCounter) tpsCounter.innerText = `${state.telemetry.lastTps}/s`;
}

// --- Toast Notification ---
function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) toast.style.borderLeftColor = 'var(--rose-primary)';
  toast.innerText = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Simple Markdown Formatter
function formatMarkdown(text) {
  let html = escapeHtml(text);

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  // Code block
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Blockquote
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  // Horizontal Rule
  html = html.replace(/^---$/gm, '<hr style="border:none; border-top:1px solid var(--border-glass); margin:12px 0;">');
  // Line breaks
  html = html.replace(/\n\n/g, '<p></p>');

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
