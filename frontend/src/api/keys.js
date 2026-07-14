import api from './client.js';

export async function fetchKeyStatus() {
  const { data } = await api.get('/user/keys');
  return data;
}

export async function saveKey(provider, apiKey) {
  const { data } = await api.post(`/user/keys/${provider}`, { apiKey });
  return data;
}

export async function deleteKey(provider) {
  const { data } = await api.delete(`/user/keys/${provider}`);
  return data;
}
