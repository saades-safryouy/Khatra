import api from './api';

export const inquiriesApi = {
  quoteCart: async (items, language) => {
    const res = await api.post('/inquiries/quote', { items, language });
    return res?.data;
  },
  createInquiry: async (data) => {
    const res = await api.post('/inquiries', data);
    return res?.data;
  },
};

export default inquiriesApi;
