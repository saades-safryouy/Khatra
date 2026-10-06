import axios from 'axios';

export const TOKEN_KEY = 'khatra_admin_token';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}` || 'http://localhost:5000/',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || '');
    if (status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.assign('/admin/login');
      }
    }
    const message = error?.response?.data?.message || error.message || 'Une erreur est survenue';
    error.uiMessage = message;
    return Promise.reject(error);
  }
);

export function getData(response) {
  return response?.data?.data;
}

export function getMeta(response) {
  return response?.data?.meta;
}

export default api;


