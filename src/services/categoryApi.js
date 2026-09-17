import api, { getData, getMeta } from '../lib/api';

function toForm(payload, file) {
  const form = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  if (file) form.append('image', file);
  return form;
}

export const categoryApi = {
  list: async (params = {}) => {
    const res = await api.get('/admin/categories', { params });
    const data = getData(res);
    if (Array.isArray(data)) return { items: data, meta: getMeta(res) };
    return { items: data || [], meta: getMeta(res) };
  },
  get: async (id) => getData(await api.get(`/admin/categories/${id}`)),
  create: async (payload, file) => getData(await api.post('/admin/categories', toForm(payload, file))),
  update: async (id, payload, file) => getData(await api.put(`/admin/categories/${id}`, toForm(payload, file))),
  remove: async (id) => getData(await api.delete(`/admin/categories/${id}`)),
};

