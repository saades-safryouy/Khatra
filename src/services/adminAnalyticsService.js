const prisma = require('../config/database');
const googleReviewsService = require('./googleReviewsService');

exports.getOverview = async () => {
  const [
    productTotal,
    productsByStatus,
    productCategories,
    locationTotal,
    locations,
    storeTotal,
    inquiriesByType,
    franchiseTotal,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.location.count(),
    prisma.location.findMany({ select: { id: true, city: true, region: true } }),
    prisma.store.count(),
    prisma.inquiry.groupBy({ by: ['type'], _count: { _all: true } }),
    prisma.franchiseConcept.count(),
  ]);

  const productsStatus = { ACTIVE: 0, INACTIVE: 0 };
  productsByStatus.forEach(({ status, _count }) => {
    if (Object.hasOwn(productsStatus, status)) productsStatus[status] = _count._all;
  });

  let googleReviews;
  try {
    const reviews = await googleReviewsService.getGoogleReviews();
    googleReviews = reviews.configured
      ? { available: true, rating: reviews.rating, reviewCount: reviews.reviewCount }
      : { available: false, rating: null, reviewCount: null };
  } catch (error) {
    console.error('Google review metrics unavailable for admin analytics:', error);
    googleReviews = { available: false, rating: null, reviewCount: null };
  }

  return {
    products: {
      total: productTotal,
      byStatus: productsStatus,
      byCategory: productCategories.map((category) => ({
        name: category.name,
        count: category._count.products,
      })),
    },
    locations: {
      total: locationTotal,
      pointsOfSale: storeTotal,
      byCity: locations.reduce((counts, location) => {
        const city = location.city.trim() || 'Unknown';
        counts[city] = (counts[city] || 0) + 1;
        return counts;
      }, {}),
      byRegion: locations.reduce((counts, location) => {
        if (location.region) {
          const region = location.region.trim();
          counts[region] = (counts[region] || 0) + 1;
        }
        return counts;
      }, {}),
    },
    inquiries: {
      byType: inquiriesByType.map(({ type, _count }) => ({ type, count: _count._all })),
      franchiseConceptBreakdownAvailable: false,
    },
    franchises: { total: franchiseTotal },
    googleReviews,
  };
};
