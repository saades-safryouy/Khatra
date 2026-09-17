import api, { getData, getMeta } from '../lib/api';

export const inquiryApi = {
  list: async (params = {}) => {
    const res = await api.get('/admin/inquiries', { params });
    return { items: getData(res) || [], meta: getMeta(res) };
  },
  get: async (id) => getData(await api.get(`/admin/inquiries/${id}`)),
  update: async (id, payload) => getData(await api.put(`/admin/inquiries/${id}`, payload)),
  remove: async (id) => getData(await api.delete(`/admin/inquiries/${id}`)),
};


