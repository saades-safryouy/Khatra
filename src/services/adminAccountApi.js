import api, { getData, getMeta } from '../lib/api';

export const adminAccountApi = {
  list: async (params = {}) => {
    const response = await api.get('/admin/accounts', { params });
    return { items: getData(response) || [], meta: getMeta(response) };
  },
  create: async (payload) => getData(await api.post('/admin/accounts', payload)),
  update: async (id, payload) => getData(await api.patch(`/admin/accounts/${id}`, payload)),
  changePassword: async (id, password) => getData(await api.put(`/admin/accounts/${id}/password`, { password })),
  remove: async (id) => getData(await api.delete(`/admin/accounts/${id}`)),
};

export default adminAccountApi;
