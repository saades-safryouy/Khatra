const prisma = require('../config/database');
const { AppError, pagination, toBool, clean } = require('../utils/helpers');
const { deleteFile } = require('../middleware/upload');

function validate(data, partial = false) {
  if (!partial || data.name !== undefined) {
    if (!String(data.name || '').trim()) throw new AppError('Product name is required', 400);
  }
  if (!partial || data.categoryId !== undefined) {
    if (!data.categoryId) throw new AppError('Product categoryId is required', 400);
  }
  if (!partial || data.slug !== undefined) {
    if (!String(data.slug || '').trim()) throw new AppError('Product slug is required', 400);
  }
  if (data.price !== undefined && data.price !== '' && data.price !== null) {
    const num = Number(data.price);
    if (!Number.isFinite(num) || num < 0 || num > 99999999.99 || !/^\d{1,8}(\.\d{1,2})?$/.test(String(data.price).trim())) {
      throw new AppError('Product price must be a non-negative amount with at most two decimal places', 400);
    }
  }
}

async function ensureUniqueSlug(slug, excludeId) {
  const found = await prisma.product.findUnique({ where: { slug } });
  if (found && found.id !== excludeId) throw new AppError('Product slug already exists', 409);
}

async function ensureCategory(id) {
  const cat = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!cat) throw new AppError('Category not found', 404);
  return cat;
}

const include = { category: true, images: { orderBy: { displayOrder: 'asc' } } };

exports.publicList = async q => {
  const { page, limit, skip } = pagination(q);
  const where = { status: 'ACTIVE', category: { active: true } };
  if (q.search) {
    where.OR = [
      { name: { contains: q.search } },
      { shortDescription: { contains: q.search } },
      { description: { contains: q.search } },
      { reference: { contains: q.search } }
    ];
  }
  if (q.category) where.category = { active: true, slug: q.category };
  if (q.featured !== undefined) where.featured = toBool(q.featured);
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include }),
    prisma.product.count({ where })
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

exports.publicBySlug = async slug => {
  const item = await prisma.product.findFirst({
    where: { slug, status: 'ACTIVE', category: { active: true } },
    include
  });
  if (!item) throw new AppError('Product not found', 404);
  return item;
};

exports.adminList = async q => {
  const { page, limit, skip } = pagination(q);
  const where = {};
  if (q.search) {
    where.OR = [
      { name: { contains: q.search } },
      { slug: { contains: q.search } },
      { reference: { contains: q.search } }
    ];
  }
  if (q.categoryId) where.categoryId = Number(q.categoryId);
  if (q.category) where.category = { slug: q.category };
  if (q.featured !== undefined) where.featured = toBool(q.featured);
  if (q.status) where.status = q.status;
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include }),
    prisma.product.count({ where })
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

exports.adminById = async id => {
  const item = await prisma.product.findUnique({ where: { id: Number(id) }, include });
  if (!item) throw new AppError('Product not found', 404);
  return item;
};

exports.create = async (data, imageUrls = []) => {
  validate(data);
  await ensureCategory(data.categoryId);
  await ensureUniqueSlug(data.slug);
  const priceVal = data.price !== undefined && data.price !== '' && data.price !== null
    ? Number(data.price)
    : null;
  return prisma.product.create({
    data: {
      categoryId: Number(data.categoryId),
      name: data.name.trim(),
      slug: data.slug.trim(),
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      reference: data.reference || null,
      price: priceVal,
      status: data.status || 'ACTIVE',
      featured: toBool(data.featured),
      images: {
        create: imageUrls.map((url, i) => ({ imageUrl: url, altText: data.name, displayOrder: i }))
      }
    },
    include
  });
};

exports.update = async (id, data, imageUrls = []) => {
  const existing = await exports.adminById(id);
  validate(data, true);
  if (data.categoryId) await ensureCategory(data.categoryId);
  if (data.slug) await ensureUniqueSlug(data.slug, existing.id);
  const priceVal = data.price === undefined
    ? undefined
    : (data.price === '' || data.price === null ? null : Number(data.price));

  const updated = await prisma.$transaction(async tx => {
    if (imageUrls.length) {
      await tx.productImage.deleteMany({ where: { productId: existing.id } });
      await tx.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          productId: existing.id,
          imageUrl: url,
          altText: data.name || existing.name,
          displayOrder: i
        }))
      });
    }
    return tx.product.update({
      where: { id: existing.id },
      data: clean({
        categoryId: data.categoryId === undefined ? undefined : Number(data.categoryId),
        name: data.name?.trim(),
        slug: data.slug?.trim(),
        shortDescription: data.shortDescription,
        description: data.description,
        reference: data.reference,
        price: priceVal,
        status: data.status,
        featured: data.featured === undefined ? undefined : toBool(data.featured)
      }),
      include
    });
  });
  if (imageUrls.length) existing.images.forEach(img => deleteFile(img.imageUrl));
  return updated;
};

exports.remove = async id => {
  const existing = await exports.adminById(id);
  await prisma.product.delete({ where: { id: existing.id } });
  existing.images.forEach(img => deleteFile(img.imageUrl));
  return existing;
};
