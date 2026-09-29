/**
 * Centralized API client for ContextOS backend & Bionic / LM Studio
 */

const API_BASE = '/api';

export const api = {
  // Check system & Bionic status
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },

  // List available models from LM Studio / Bionic
  async getModels() {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  // Load a custom or local LLM model
  async loadModel(modelId) {
    const res = await fetch(`${API_BASE}/models/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to load model');
    }
    return res.json();
  },

  // Eject current local LLM model to Standby Synthesizer
  async ejectModel() {
    const res = await fetch(`${API_BASE}/models/eject`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to eject model');
    return res.json();
  },

  // Get indexed documents
  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  // Delete a document
  async deleteDocument(docId) {
    const res = await fetch(`${API_BASE}/documents/${docId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },

  // Get all chunks with 3D coordinates for Three.js
  async getChunks() {
    const res = await fetch(`${API_BASE}/chunks`);
    if (!res.ok) throw new Error('Failed to fetch chunks');
    return res.json();
  },

  // Upload one or multiple files
  async uploadFiles(fileList) {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i]);
    }
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  // Preload sample knowledge documents
  async preloadSamples() {
    const res = await fetch(`${API_BASE}/preload-samples`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to preload samples');
    return res.json();
  },

  // Update runtime settings
  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Execute streaming RAG query (returns fetch Response for SSE reader)
  async queryRAG(payload) {
    return fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
};
