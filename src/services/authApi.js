import api, { getData } from '../lib/api';

export const authApi = {
  login: async (email, password) => getData(await api.post('/auth/login', { email, password })),
  me: async () => getData(await api.get('/auth/me')),
  logout: async () => getData(await api.post('/auth/logout')),
};


