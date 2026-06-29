import api from './client.js';

export async function fetchUserSettings() {
  const { data } = await api.get('/user/settings');
  return data;
}

export async function updateUserSettings(settings) {
  const { data } = await api.put('/user/settings', settings);
  return data;
}
