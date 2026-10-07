import api from './api';

export const GOOGLE_MAPS_LISTING_URL = 'https://www.google.com/maps/place/Khatra+Market/@33.5634218,-7.5928591,17z/';

export const googleReviewsApi = {
  getReviews: async () => {
    const response = await api.get('/reviews/google');
    const data = response?.data;
    if (!data || typeof data.configured !== 'boolean' || !Array.isArray(data.reviews)) {
      throw new Error('Unexpected Google reviews response');
    }
    return data;
  },
};

export default googleReviewsApi;
