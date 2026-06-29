import api from './client.js';

export async function globalSearch(query, type = 'all') {
  const { data } = await api.get('/search', { params: { q: query, type } });
  return data;
}
