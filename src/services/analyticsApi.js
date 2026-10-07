import api, { getData } from '../lib/api';

export const analyticsApi = {
  overview: async () => getData(await api.get('/admin/analytics')),
};

export default analyticsApi;
