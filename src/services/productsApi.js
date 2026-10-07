import api from './api';

export const productsApi = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', params);
    return res?.data || [];
  },

  getProductsPage: async (params = {}) => {
    const res = await api.get('/products', params);
    return {
      items: Array.isArray(res?.data) ? res.data : [],
      meta: res?.meta || {},
    };
  },

  getProductBySlug: async (slug) => {
    const res = await api.get(`/products/${encodeURIComponent(slug)}`);
    return res?.data || null;
  },

  getAdminProducts: async (params = {}) => {
    const res = await api.get('/admin/products', params);
    return {
      items: res?.data || [],
      meta: res?.meta || {},
    };
  },

  createProduct: async (payload, files = []) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });
    if (Array.isArray(files)) {
      files.forEach((f) => form.append('images', f));
    }
    const res = await api.post('/admin/products', form);
    return res?.data;
  },

  updateProduct: async (id, payload, files = []) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });
    if (Array.isArray(files)) {
      files.forEach((f) => form.append('images', f));
    }
    const res = await api.put(`/admin/products/${id}`, form);
    return res?.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/admin/products/${id}`);
    return res?.data;
  },
};

export default productsApi;
