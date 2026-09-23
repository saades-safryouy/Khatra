const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';
export const TOKEN_KEY = 'khatra_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token, remember = true) {
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // ignore
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function resolveImageUrl(url, fallback = '') {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `${UPLOADS_BASE_URL}${url}`;
  }
  if (url.startsWith('uploads/')) {
    return `${UPLOADS_BASE_URL}/${url}`;
  }
  return url;
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers = { ...options.headers };
  const token = getToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = (data && data.message) || (data && data.error) || response.statusText || 'Une erreur est survenue';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (url, params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return request(`${url}${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  post: (url, data, isForm = false) => {
    if (isForm && !(data instanceof FormData)) {
      const form = new FormData();
      Object.entries(data || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) form.append(k, v);
      });
      return request(url, { method: 'POST', body: form });
    }
    return request(url, { method: 'POST', body: data });
  },

  put: (url, data, isForm = false) => {
    if (isForm && !(data instanceof FormData)) {
      const form = new FormData();
      Object.entries(data || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) form.append(k, v);
      });
      return request(url, { method: 'PUT', body: form });
    }
    return request(url, { method: 'PUT', body: data });
  },

  delete: (url) => request(url, { method: 'DELETE' }),
};

export default api;
