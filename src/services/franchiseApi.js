import api, { getData, getMeta } from '../lib/api';

export const franchiseApi = {
  list: async (params = {}) => {
    const res = await api.get('/admin/franchises', { params });
    const data = getData(res);
    return { items: Array.isArray(data) ? data : [], meta: getMeta(res) };
  },
  get: async (id) => getData(await api.get(`/admin/franchises/${id}`)),
  create: async (payload, file) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      form.append(key, value);
    });
    if (file) form.append('image', file);
    return getData(await api.post('/admin/franchises', form));
  },
  update: async (id, payload, file) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      form.append(key, value);
    });
    if (file) form.append('image', file);
    return getData(await api.put(`/admin/franchises/${id}`, form));
  },
  remove: async (id) => getData(await api.delete(`/admin/franchises/${id}`)),
};


