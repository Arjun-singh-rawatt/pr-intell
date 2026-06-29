import api from './client.js';

export async function searchKb(query = '') {
  const { data } = await api.get('/kb/documents', { params: { search: query } });
  return data.documents;
}

export async function fetchKbDocument(docId) {
  const { data } = await api.get(`/kb/${docId}`);
  return data;
}
