import api, { getData, getMeta } from '../lib/api';

function productForm(payload, files = []) {
  const form = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => form.append(key, item));
      return;
    }
    form.append(key, value);
  });
  files.forEach((file) => form.append('images', file));
  return form;
}

export const productApi = {
  list: async (params = {}) => {
    const res = await api.get('/admin/products', { params });
    return { items: getData(res) || [], meta: getMeta(res) };
  },
  get: async (id) => getData(await api.get(`/admin/products/${id}`)),
  create: async (payload, files = []) => getData(await api.post('/admin/products', productForm(payload, files))),
  update: async (id, payload, files = []) => getData(await api.put(`/admin/products/${id}`, productForm(payload, files))),
  remove: async (id) => getData(await api.delete(`/admin/products/${id}`)),
};


