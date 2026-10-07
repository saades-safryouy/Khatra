const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { AppError, isEmail, pagination } = require('../utils/helpers');

const SAFE_USER_FIELDS = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
};
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_BYTES = 72;

function validateName(value, label) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 100) {
    throw new AppError(`${label} is required and must be at most 100 characters`, 400);
  }
}

function validateEmail(value) {
  if (typeof value !== 'string' || value.trim().length > 255 || !isEmail(value)) {
    throw new AppError('A valid email address is required', 400);
  }
}

function validatePassword(value) {
  if (typeof value !== 'string'
    || value.length < PASSWORD_MIN_LENGTH
    || Buffer.byteLength(value, 'utf8') > PASSWORD_MAX_BYTES) {
    throw new AppError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters and no more than ${PASSWORD_MAX_BYTES} UTF-8 bytes`, 400);
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function assertActiveAdminRemains(tx, excludedId) {
  const activeAdmins = await tx.user.count({
    where: { role: 'ADMIN', active: true, ...(excludedId ? { id: { not: excludedId } } : {}) },
  });
  if (activeAdmins === 0) {
    throw new AppError('At least one active administrator must remain', 409);
  }
}

exports.list = async (query) => {
  const { page, limit, skip } = pagination(query);
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: SAFE_USER_FIELDS,
      skip,
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

exports.create = async (data) => {
  validateName(data.firstName, 'First name');
  validateName(data.lastName, 'Last name');
  validateEmail(data.email);
  validatePassword(data.password);

  return prisma.user.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizeEmail(data.email),
      password: await bcrypt.hash(data.password, 12),
      role: 'ADMIN',
      active: true,
    },
    select: SAFE_USER_FIELDS,
  });
};

exports.update = async (id, data, actorId) => {
  const userId = Number(id);
  if (!Number.isSafeInteger(userId) || userId < 1) throw new AppError('Invalid administrator id', 400);
  const hasUpdate = ['firstName', 'lastName', 'email', 'active'].some((key) => data[key] !== undefined);
  if (!hasUpdate) throw new AppError('No administrator fields provided', 400);

  if (data.firstName !== undefined) validateName(data.firstName, 'First name');
  if (data.lastName !== undefined) validateName(data.lastName, 'Last name');
  if (data.email !== undefined) validateEmail(data.email);
  if (data.active !== undefined && typeof data.active !== 'boolean') {
    throw new AppError('Active must be a boolean', 400);
  }
  if (data.active === false && userId === actorId) {
    throw new AppError('You cannot deactivate your own administrator account', 409);
  }

  const updateData = {};
  if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
  if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
  if (data.email !== undefined) updateData.email = normalizeEmail(data.email);
  if (data.active !== undefined) updateData.active = data.active;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { id: userId }, select: SAFE_USER_FIELDS });
    if (!existing || existing.role !== 'ADMIN') throw new AppError('Administrator not found', 404);
    if (data.active === false && existing.active) {
      await assertActiveAdminRemains(tx, userId);
    }
    return tx.user.update({ where: { id: userId }, data: updateData, select: SAFE_USER_FIELDS });
  }, { isolationLevel: 'Serializable' });
};

exports.changePassword = async (id, password) => {
  const userId = Number(id);
  if (!Number.isSafeInteger(userId) || userId < 1) throw new AppError('Invalid administrator id', 400);
  validatePassword(password);

  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!existing || existing.role !== 'ADMIN') throw new AppError('Administrator not found', 404);

  await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(password, 12) },
  });
  return { id: userId, passwordUpdated: true };
};

exports.remove = async (id, actorId) => {
  const userId = Number(id);
  if (!Number.isSafeInteger(userId) || userId < 1) throw new AppError('Invalid administrator id', 400);
  if (userId === actorId) throw new AppError('You cannot delete your own administrator account', 409);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { id: userId }, select: SAFE_USER_FIELDS });
    if (!existing || existing.role !== 'ADMIN') throw new AppError('Administrator not found', 404);
    if (existing.active) await assertActiveAdminRemains(tx, userId);
    await tx.user.delete({ where: { id: userId } });
    return existing;
  }, { isolationLevel: 'Serializable' });
};
