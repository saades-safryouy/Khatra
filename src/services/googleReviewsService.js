const { AppError } = require('../utils/helpers');

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map();

function normalizeReview(review) {
  return {
    rating: typeof review.rating === 'number' ? review.rating : null,
    text: review.text?.text || review.originalText?.text || '',
    publishTime: review.publishTime || null,
    authorName: review.authorAttribution?.displayName || null,
    authorUri: review.authorAttribution?.uri || null,
    authorPhotoUri: review.authorAttribution?.photoUri || null,
  };
}

exports.getGoogleReviews = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) {
    return { configured: false, rating: null, reviewCount: null, reviews: [] };
  }

  const cached = cache.get(placeId);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const fields = 'rating,userRatingCount,reviews';
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);

  const response = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fields,
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new AppError('Google Places API request failed', 502);

  const place = await response.json();
  const data = {
    configured: true,
    rating: typeof place.rating === 'number' ? place.rating : null,
    reviewCount: Number.isInteger(place.userRatingCount) ? place.userRatingCount : null,
    reviews: Array.isArray(place.reviews) ? place.reviews.slice(0, 3).map(normalizeReview) : [],
  };

  cache.set(placeId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
};
