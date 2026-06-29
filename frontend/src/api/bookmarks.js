import api from './client.js';

export async function fetchBookmarks(type) {
  const { data } = await api.get('/bookmarks', { params: type ? { type } : {} });
  return data.bookmarks;
}

export async function saveBookmark(type, id, record) {
  const { data } = await api.post(`/bookmarks/${type}/${id}`, record);
  return data;
}

export async function deleteBookmark(type, id) {
  const { data } = await api.delete(`/bookmarks/${type}/${id}`);
  return data;
}
