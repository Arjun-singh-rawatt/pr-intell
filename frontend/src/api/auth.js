import api from './client.js';

export const fetchMe            = ()               => api.get('/auth/me').then(r => r.data);
export const logout             = ()               => api.post('/auth/logout');
export const fetchUserKeys      = ()               => api.get('/auth/keys').then(r => r.data);
export const saveUserKey        = (provider, key)  => api.put(`/auth/keys/${provider}`, { apiKey: key }).then(r => r.data);
export const deleteUserKey      = (provider)       => api.delete(`/auth/keys/${provider}`).then(r => r.data);
export const testUserKey        = (provider)       => api.post(`/auth/keys/${provider}/test`).then(r => r.data);

