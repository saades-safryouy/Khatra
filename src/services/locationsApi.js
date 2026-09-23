import api from './api';

export const locationsApi = {
  getLocations: async (params = {}) => {
    const res = await api.get('/locations', params);
    return Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
  },

  getLocationBySlug: async (slug) => {
    const res = await api.get(`/locations/${encodeURIComponent(slug)}`);
    return res?.data || null;
  },
};

export default locationsApi;
