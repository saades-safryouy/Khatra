const { AppError } = require('../utils/helpers');
function errorHandler(err, req, res, next) {
  if (!err.isOperational && process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    const fields = Array.isArray(target) ? target.join(', ') : (target || 'unique field');
    return res.status(409).json({ success: false, message: `Duplicate value for ${fields}` });
  }
  if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Record not found' });
  if (err.code === 'P2034') return res.status(409).json({ success: false, message: 'The record changed during this operation. Please retry.' });
  if (err.name === 'MulterError') return res.status(400).json({ success: false, message: err.message });
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ success: false, message: 'Invalid JSON payload' });

  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : err.message });
}
function notFound(req, res) { res.status(404).json({ success: false, message: 'Route not found' }); }
module.exports = { errorHandler, notFound };
