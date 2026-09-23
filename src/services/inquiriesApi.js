import api from './api';

export const inquiriesApi = {
  createInquiry: async (data) => {
    const res = await api.post('/inquiries', data);
    return res?.data;
  },
};

export default inquiriesApi;
