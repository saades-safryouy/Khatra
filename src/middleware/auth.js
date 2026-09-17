const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { AppError, asyncHandler } = require('../utils/helpers');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Authentication required', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await prisma.user.findFirst({
    where: { id: decoded.id, active: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) throw new AppError('Invalid or expired token', 401);
  req.user = user;
  next();
});

module.exports = { protect };
