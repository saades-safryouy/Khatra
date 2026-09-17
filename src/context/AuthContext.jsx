import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { TOKEN_KEY } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData, token) => {
    // CAVEMAN: login get user + token. Store token. User is now logged in.
    if (token) localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    // CAVEMAN: remove local login stuff. Do NOT reload page here. Reload made login loop.
    try {
      await authApi.logout();
    } catch (e) {
      // CAVEMAN: server may already reject old token. Local logout still works.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const restore = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    // CAVEMAN: no token means no login. Do not call /auth/me. No call means no 401 loop.
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch (e) {
      // CAVEMAN: bad/expired token. Forget it once, then show login page.
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, restore }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


