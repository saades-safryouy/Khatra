import api, { setToken, clearToken } from './api';

export const authApi = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res?.data || {};
    if (token) setToken(token);
    return { token, user };
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res?.data?.user || res?.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      clearToken();
    }
  },
};

export default authApi;
