const service = require('../services/adminAccountService');
const { asyncHandler, ok, AppError } = require('../utils/helpers');

exports.list = asyncHandler(async (req, res) => {
  const result = await service.list(req.query);
  ok(res, result.items, 200, result.meta);
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await service.create(req.body || {}), 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await service.update(req.params.id, req.body || {}, req.user.id));
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { password } = req.body || {};
  if (password === undefined) throw new AppError('Password is required', 400);
  ok(res, await service.changePassword(req.params.id, password));
});

exports.remove = asyncHandler(async (req, res) => {
  ok(res, await service.remove(req.params.id, req.user.id));
});
