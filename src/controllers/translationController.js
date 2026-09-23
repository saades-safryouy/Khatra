const service = require('../services/translationService');
const { asyncHandler, ok, fail } = require('../utils/helpers');

exports.translate = asyncHandler(async (req, res) => {
  const texts = req.body?.texts;
  const target = String(req.body?.target || 'ar').toLowerCase();
  const source = String(req.body?.source || 'fr').toLowerCase();
  if (!Array.isArray(texts) || texts.length === 0) fail('texts array is required', 400);
  if (texts.length > 80) fail('Too many texts', 400);
  if (!['fr', 'ar'].includes(target) || !['fr', 'ar'].includes(source)) fail('Unsupported language', 400);
  const translations = await service.translateMany(texts.slice(0, 80), source, target);
  ok(res, { translations, source, target });
});
