import api from './api';

export const storesApi = {
  getStores: async (params = {}) => {
    const res = await api.get('/stores', params);
    return Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
  },

  getStoreById: async (id) => {
    const res = await api.get(`/stores/${id}`);
    return res?.data || null;
  },

  getAdminStores: async (params = {}) => {
    const res = await api.get('/admin/stores', params);
    return {
      items: Array.isArray(res?.data) ? res.data : (res?.data?.items || []),
      meta: res?.meta || {},
    };
  },

  createStore: async (payload, file) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });
    if (file) form.append('image', file);
    const res = await api.post('/admin/stores', form);
    return res?.data;
  },

  updateStore: async (id, payload, file) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });
    if (file) form.append('image', file);
    const res = await api.put(`/admin/stores/${id}`, form);
    return res?.data;
  },

  deleteStore: async (id) => {
    const res = await api.delete(`/admin/stores/${id}`);
    return res?.data;
  },
};

export default storesApi;
