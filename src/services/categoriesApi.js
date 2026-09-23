import api from './api';

export const categoriesApi = {
  getCategories: async (params = {}) => {
    const res = await api.get('/categories', params);
    return Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
  },

  getCategoryBySlug: async (slug) => {
    const res = await api.get(`/categories/${encodeURIComponent(slug)}`);
    return res?.data || null;
  },

  getAdminCategories: async (params = {}) => {
    const res = await api.get('/admin/categories', params);
    return {
      items: Array.isArray(res?.data) ? res.data : (res?.data?.items || []),
      meta: res?.meta || {},
    };
  },
};

export default categoriesApi;
