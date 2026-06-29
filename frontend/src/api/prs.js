import api from './client.js';

export async function fetchPRs(page = 1) {
  const { data } = await api.get(`/prs?page=${page}`);
  return data;
}

export async function fetchPRDetail(prNumber) {
  const { data } = await api.get(`/prs/${prNumber}`);
  return data;
}

export async function summarizePR(prNumber) {
  const { data } = await api.post(`/prs/${prNumber}/summarize`);
  return data;
}

export async function fetchRouterStatus() {
  const { data } = await api.get('/prs/router-status');
  return data;
}
