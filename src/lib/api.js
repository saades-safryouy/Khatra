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
    const messages = {
      400: 'Les informations fournies sont invalides. Vérifiez les champs et réessayez.',
      401: url.includes('/auth/login')
        ? 'Adresse e-mail ou mot de passe incorrect.'
        : 'Votre session a expiré. Veuillez vous reconnecter.',
      403: 'Vous n’êtes pas autorisé à effectuer cette action.',
      404: 'L’élément demandé est introuvable.',
      409: 'Cette opération entre en conflit avec une donnée existante.',
      413: 'Le fichier envoyé est trop volumineux.',
      429: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
      500: 'Une erreur interne est survenue. Veuillez réessayer.',
    };
    error.uiMessage = status
      ? messages[status] || 'Une erreur est survenue. Veuillez réessayer.'
      : 'Impossible de contacter le serveur. Vérifiez votre connexion.';
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

