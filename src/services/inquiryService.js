const prisma = require('../config/database');
const { AppError, isEmail, pagination, clean } = require('../utils/helpers');
const inquiryEmailService = require('./inquiryEmailService');
const { effectivePrice, isPromotionActive } = require('../utils/pricing');
const validTypes = ['GENERAL','PARTNERSHIP','PRODUCT'];
const validStatuses = ['NEW','CONTACTED','CLOSED'];
function validateCreate(data, hasItems) {
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  if (!name || name.length > 200) throw new AppError('A valid inquiry name is required', 400);
  if (!isEmail(email) || email.length > 255) throw new AppError('Valid inquiry email is required', 400);
  if (data.company != null && String(data.company).length > 200) throw new AppError('Company name must be 200 characters or fewer', 400);
  if (data.phone != null && String(data.phone).length > 50) throw new AppError('Phone number must be 50 characters or fewer', 400);
  if (data.notes != null && String(data.notes).length > 2000) throw new AppError('Inquiry notes must be 2000 characters or fewer', 400);
  if (!hasItems && !String(data.message || '').trim()) throw new AppError('Inquiry message is required', 400);
  if (!validTypes.includes(data.type)) throw new AppError('Valid inquiry type is required', 400);
}

function money(cents) {
  const value = BigInt(cents);
  return `${value / 100n}.${String(value % 100n).padStart(2, '0')}`;
}

function priceToCents(value) {
  const [whole, fraction = ''] = String(value).split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}

function makeSummary(items, totalQuantity, totalCents, language = 'fr') {
  const labels = language === 'ar'
    ? { title: 'طلب منتجات خاترة', quantity: 'الكمية', unit: 'سعر الوحدة', original: 'السعر الأصلي', promotion: 'التخفيض', line: 'إجمالي المنتج', totalQuantity: 'الكمية الإجمالية', total: 'الإجمالي' }
    : { title: 'Demande de produits Khatra', quantity: 'Quantité', unit: 'Prix unitaire', original: 'Prix normal', promotion: 'Promotion', line: 'Total produit', totalQuantity: 'Quantité totale', total: 'Total' };
  return [
    labels.title,
    '',
    ...items.flatMap(item => [
      item.productName,
      `${labels.quantity} : ${item.quantity}`,
      ...(item.promo === null ? [] : [
        `${labels.original} : ${money(priceToCents(item.originalPrice))} MAD`,
        `${labels.promotion} : -${item.promo}%`,
      ]),
      `${labels.unit} : ${money(item.unitPriceCents)} MAD`,
      `${labels.line} : ${money(item.lineTotalCents)} MAD`,
      '',
    ]),
    '--------------------',
    `${labels.totalQuantity} : ${totalQuantity}`,
    `${labels.total} : ${money(totalCents)} MAD`,
  ].join('\n');
}

async function priceItems(tx, requestedItems, language = 'fr') {
  if (!Array.isArray(requestedItems) || requestedItems.length < 1 || requestedItems.length > 100) {
    throw new AppError('The cart must contain between 1 and 100 products', 400);
  }
  const seen = new Set();
  const normalized = requestedItems.map(item => {
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);
    if (!Number.isSafeInteger(productId) || productId < 1 || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000) {
      throw new AppError('Each cart product must have a valid product ID and quantity (1–10000)', 400);
    }
    if (seen.has(productId)) throw new AppError('Duplicate products are not allowed in the cart', 400);
    seen.add(productId);
    return { productId, quantity };
  });

  const products = await tx.product.findMany({
    where: { id: { in: normalized.map(item => item.productId) }, status: 'ACTIVE', category: { active: true } },
    include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
  });
  const byId = new Map(products.map(product => [product.id, product]));
  const pricingTime = new Date();
  const items = normalized.map(({ productId, quantity }) => {
    const product = byId.get(productId);
    if (!product) throw new AppError(`Product ${productId} is unavailable`, 400);
    if (product.price === null) throw new AppError(`${product.name} has no published price and cannot be added to the cart`, 400);
    const activePromotion = isPromotionActive(product, pricingTime);
    const unitPriceCents = priceToCents(effectivePrice(product, pricingTime));
    const lineTotalCents = unitPriceCents * BigInt(quantity);
    return {
      productId,
      productName: product.name,
      productImage: product.images[0]?.imageUrl || null,
      unitPrice: money(unitPriceCents),
      originalPrice: product.price.toString(),
      promo: activePromotion ? Number(product.promo) : null,
      promoExpiresAt: activePromotion ? product.promoExpiresAt : null,
      quantity,
      lineTotal: money(lineTotalCents),
      unitPriceCents,
      lineTotalCents,
    };
  });
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalCents = items.reduce((total, item) => total + item.lineTotalCents, 0n);
  return { items, totalQuantity, totalCents, summary: makeSummary(items, totalQuantity, totalCents, language) };
}

exports.quote = async data => {
  if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data.items)) {
    throw new AppError('Cart items must be provided as a list', 400);
  }
  const language = data.language || 'fr';
  if (!['fr', 'ar'].includes(language)) throw new AppError('Language must be fr or ar', 400);
  const priced = await priceItems(prisma, data.items, language);
  return {
    items: priced.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      unitPrice: Number(item.unitPrice),
      originalPrice: Number(item.originalPrice),
      promo: item.promo,
      promoExpiresAt: item.promoExpiresAt,
      quantity: item.quantity,
      lineTotal: Number(item.lineTotal),
    })),
    totalQuantity: priced.totalQuantity,
    cartTotal: Number(money(priced.totalCents)),
    summary: priced.summary,
  };
};

exports.create = async data => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new AppError('Inquiry data must be provided as an object', 400);
  }
  if (data.items !== undefined && !Array.isArray(data.items)) {
    throw new AppError('Cart items must be provided as a list', 400);
  }
  const hasItems = Array.isArray(data.items);
  validateCreate(data, hasItems);
  if (!hasItems) {
    return prisma.inquiry.create({
      data: {
        type: data.type, name: String(data.name).trim(), company: data.company == null ? null : String(data.company).trim() || null,
        email: String(data.email).trim(), phone: data.phone == null ? null : String(data.phone).trim() || null, message: String(data.message).trim(),
      },
    });
  }

  if (data.type !== 'PRODUCT') throw new AppError('Product cart inquiries must use type PRODUCT', 400);
  if (data.channel !== undefined && !['whatsapp', 'email'].includes(data.channel)) {
    throw new AppError('Inquiry channel must be whatsapp or email', 400);
  }
  const language = data.language || 'fr';
  if (!['fr', 'ar'].includes(language)) throw new AppError('Language must be fr or ar', 400);

  const created = await prisma.$transaction(async tx => {
    const priced = await priceItems(tx, data.items, language);
    const extraMessage = String(data.notes || '').trim();
    const notesLabel = language === 'ar' ? 'رسالة' : 'Message';
    const message = `${priced.summary}${extraMessage ? `\n\n${notesLabel} :\n${extraMessage}` : ''}`;
    const inquiry = await tx.inquiry.create({
      data: {
        type: 'PRODUCT', name: String(data.name).trim(), company: data.company == null ? null : String(data.company).trim() || null,
        email: String(data.email).trim(), phone: data.phone == null ? null : String(data.phone).trim() || null, message,
        totalQuantity: priced.totalQuantity, cartTotal: money(priced.totalCents),
        items: {
          create: priced.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
        },
      },
    });
    return { inquiry, summary: priced.summary };
  });

  let emailDelivery = { configured: false, sent: false };
  if (data.channel === 'email') {
    try {
      emailDelivery = await inquiryEmailService.sendInquiry(created.inquiry);
    } catch (error) {
      console.error('Inquiry email delivery failed', error);
      emailDelivery = { configured: true, sent: false };
    }
  }
  return { ...created, emailDelivery };
};
exports.adminList = async q => { const { page, limit, skip } = pagination(q); const where = {}; if (q.status) where.status = q.status; if (q.type) where.type = q.type; if (q.search) where.OR = [{ name: { contains: q.search } }, { company: { contains: q.search } }, { email: { contains: q.search } }, { message: { contains: q.search } }]; const [items,total] = await Promise.all([prisma.inquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }), prisma.inquiry.count({ where })]); return { items, meta: { page, limit, total, pages: Math.ceil(total/limit) } }; };
exports.adminById = async id => { const item = await prisma.inquiry.findUnique({ where: { id: Number(id) }, include: { items: true } }); if (!item) throw new AppError('Inquiry not found',404); return item; };
exports.update = async (id,data) => { await exports.adminById(id); if (data.status && !validStatuses.includes(data.status)) throw new AppError('Invalid inquiry status',400); return prisma.inquiry.update({ where: { id: Number(id) }, data: clean({ status: data.status }) }); };
exports.remove = async id => { await exports.adminById(id); return prisma.inquiry.delete({ where: { id: Number(id) } }); };
