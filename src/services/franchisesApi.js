import api from './api';

export const franchisesApi = {
  getFranchises: async () => {
    const res = await api.get('/franchises');
    return Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
  },

  getFranchiseBySlug: async (slug) => {
    const res = await api.get(`/franchises/${encodeURIComponent(slug)}`);
    return res?.data || null;
  },
};

export default franchisesApi;
