import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  withCredentials: true,   // ← this is the fix — sends the httpOnly cookie on every request
});

export default api;