const service = require('../services/googleReviewsService');
const { asyncHandler, ok } = require('../utils/helpers');

exports.list = asyncHandler(async (req, res) => {
  ok(res, await service.getGoogleReviews());
});
