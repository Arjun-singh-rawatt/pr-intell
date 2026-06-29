// PATH: pr-intel/frontend/src/api/knowledge.js

import api from './client.js';

export async function fetchKnowledgeStatus() {
  const { data } = await api.get('/knowledge/status');
  return data;
}

export async function triggerScrape(pages = 10) {
  const { data } = await api.post('/knowledge/scrape', { pages });
  return data;
}

export async function searchKnowledge(query, topK = 8) {
  const { data } = await api.get(`/knowledge/search?q=${encodeURIComponent(query)}&k=${topK}`);
  return data;
}