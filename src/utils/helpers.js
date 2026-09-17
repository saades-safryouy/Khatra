class AppError extends Error { constructor(message, statusCode = 500) { super(message); this.statusCode = statusCode; this.isOperational = true; } }
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const ok = (res, data, status = 200, meta) => res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (message, status = 400) => { throw new AppError(message, status); };
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const clean = obj => Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== undefined));
const toBool = v => v === true || v === 'true' || v === '1' || v === 1;
const pagination = q => { const page = Math.max(parseInt(q.page || '1', 10), 1); const limit = Math.min(Math.max(parseInt(q.limit || '12', 10), 1), 100); return { page, limit, skip: (page - 1) * limit }; };
module.exports = { AppError, asyncHandler, ok, fail, isEmail, clean, toBool, pagination };
