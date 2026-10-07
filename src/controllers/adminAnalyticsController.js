const service = require('../services/adminAnalyticsService');
const { asyncHandler, ok } = require('../utils/helpers');

exports.overview = asyncHandler(async (req, res) => {
  ok(res, await service.getOverview());
});
