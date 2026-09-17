import api, { getData, getMeta } from '../lib/api';

export const locationApi = {
  list: async (params = {}) => {
    const res = await api.get('/admin/locations', { params: { ...params, limit: params.limit || 100 } });
    const data = getData(res);
    return { items: Array.isArray(data) ? data : [], meta: getMeta(res) };
  },
  create: async (payload) => getData(await api.post('/admin/locations', payload)),
  update: async (id, payload) => getData(await api.put(`/admin/locations/${id}`, payload)),
  remove: async (id) => getData(await api.delete(`/admin/locations/${id}`)),
};


