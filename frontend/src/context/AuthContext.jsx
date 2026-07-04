import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
  try {
    const { data } = await api.get('/auth/me');
    setUser(data);
    return data;   // ← add this return
  } catch {
    setUser(false);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth') === 'success') {
    window.history.replaceState({}, '', window.location.pathname);
    // Will show confirmation once fetchMe resolves and user is set
    fetchMe().then((u) => {
      if (u?.username) {
        // dispatch a custom event the UI can listen to
        window.dispatchEvent(new CustomEvent('auth:loggedin', { detail: u }));
      }
    });
  } else {
    fetchMe();
  }
}, [fetchMe]);

  const login = useCallback(() => {
    window.location.href = '/api/auth/github';
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { }
    setUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}