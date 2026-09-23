const prisma = require('../config/database');
const { AppError, pagination, toBool, clean } = require('../utils/helpers');
const { deleteFile } = require('../middleware/upload');

function validate(data, partial = false) {
  if (!partial || data.name !== undefined) {
    if (!String(data.name || '').trim()) throw new AppError('Store name is required', 400);
  }
  if (!partial || data.locationId !== undefined) {
    if (!data.locationId) throw new AppError('Store locationId is required', 400);
  }
  if (!partial || data.address !== undefined) {
    if (!String(data.address || '').trim()) throw new AppError('Store address is required', 400);
  }
}

function validateCoords(data, partial = false) {
  if (!partial || data.latitude !== undefined) {
    if (data.latitude !== undefined && data.latitude !== null && data.latitude !== '') {
      const lat = Number(data.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new AppError('Latitude must be a number between -90 and 90', 400);
      }
    }
  }
  if (!partial || data.longitude !== undefined) {
    if (data.longitude !== undefined && data.longitude !== null && data.longitude !== '') {
      const lng = Number(data.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        throw new AppError('Longitude must be a number between -180 and 180', 400);
      }
    }
  }
}

function parseCoords(data) {
  let latitude = undefined;
  let longitude = undefined;

  if (data.latitude !== undefined && data.latitude !== null && data.latitude !== '') {
    latitude = Number(data.latitude);
  }
  if (data.longitude !== undefined && data.longitude !== null && data.longitude !== '') {
    longitude = Number(data.longitude);
  }

  return { latitude, longitude };
}

async function ensureLocation(id) {
  const loc = await prisma.location.findUnique({ where: { id: Number(id) } });
  if (!loc) throw new AppError('Location not found', 404);
  return loc;
}

const include = { location: true };

exports.publicList = () =>
  prisma.store.findMany({ where: { active: true, location: { active: true } }, orderBy: { createdAt: 'desc' }, include });

exports.publicById = async (id) => {
  const item = await prisma.store.findFirst({
    where: { id: Number(id), active: true, location: { active: true } },
    include,
  });
  if (!item) throw new AppError('Store not found', 404);
  return item;
};

exports.adminList = async (q) => {
  const { page, limit, skip } = pagination(q);
  const where = {};
  if (q.search) where.OR = [{ name: { contains: q.search } }, { address: { contains: q.search } }, { phone: { contains: q.search } }];
  if (q.locationId) where.locationId = Number(q.locationId);
  const [items, total] = await Promise.all([
    prisma.store.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include }),
    prisma.store.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

exports.adminById = async (id) => {
  const item = await prisma.store.findUnique({ where: { id: Number(id) }, include });
  if (!item) throw new AppError('Store not found', 404);
  return item;
};

exports.create = async (data) => {
  validate(data);
  validateCoords(data);
  await ensureLocation(data.locationId);
  const coords = parseCoords(data);
  return prisma.store.create({
    data: clean({
      locationId: Number(data.locationId),
      name: data.name.trim(),
      address: data.address.trim(),
      latitude: coords.latitude,
      longitude: coords.longitude,
      phone: data.phone,
      googleMapsUrl: data.googleMapsUrl,
      image: data.image,
      description: data.description,
      active: data.active === undefined ? true : toBool(data.active),
    }),
    include,
  });
};

exports.update = async (id, data) => {
  validate(data, true);
  validateCoords(data, true);
  const coords = parseCoords(data);
  const existing = await exports.adminById(id);
  if (data.image === undefined) delete data.image;
  const cleaned = clean({
    locationId: data.locationId !== undefined ? Number(data.locationId) : undefined,
    name: data.name !== undefined ? data.name.trim() : undefined,
    address: data.address !== undefined ? data.address.trim() : undefined,
    latitude: coords.latitude,
    longitude: coords.longitude,
    phone: data.phone !== undefined ? data.phone : undefined,
    googleMapsUrl: data.googleMapsUrl !== undefined ? data.googleMapsUrl : undefined,
    image: data.image !== undefined ? data.image : undefined,
    description: data.description !== undefined ? data.description : undefined,
    active: data.active !== undefined ? toBool(data.active) : undefined,
  });
  const updated = await prisma.store.update({ where: { id: Number(id) }, data: cleaned, include });
  if (data.image === undefined && existing.image && existing.image !== updated.image) {
    deleteFile(existing.image);
  }
  return updated;
};

exports.remove = async (id) => {
  const existing = await exports.adminById(id);
  const deleted = await prisma.store.delete({ where: { id: Number(id) } });
  deleteFile(existing.image);
  return deleted;
};