const express = require('express');
const { getPool } = require('../db');
const {
  serializeCategory,
  serializeProduct,
  serializeStore,
  serializeLocation,
  serializeFranchise,
  effectivePrice,
  toNumberOrNull,
} = require('../serializers');

const router = express.Router();

function parsePage(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 12));
  return { page, limit, offset: (page - 1) * limit };
}

function listResponse(items, page, limit, total) {
  return { data: items, meta: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } };
}

async function loadProductImages(productId) {
  const [rows] = await getPool().query(
    'SELECT image_url AS imageUrl FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [productId]
  );
  return rows;
}

async function loadProductRow(idOrSlug) {
  const byId = /^\d+$/.test(String(idOrSlug));
  const [rows] = await getPool().query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE ${byId ? 'p.id = ?' : 'p.slug = ?'} LIMIT 1`,
    [idOrSlug]
  );
  return rows[0] || null;
}

async function fullProduct(row) {
  const images = await loadProductImages(row.id);
  return serializeProduct(row, images);
}

// ---------- Products ----------
router.get('/products', async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePage(req);
    const { category, search } = req.query;
    const where = [];
    const params = [];
    if (category) {
      where.push('c.slug = ?');
      params.push(category);
    }
    if (search) {
      where.push('(p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[{ total }]] = await getPool().query(
      `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON c.id = p.category_id ${whereSql}`,
      params
    );
    const [rows] = await getPool().query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       ${whereSql} ORDER BY p.featured DESC, p.id ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const items = [];
    for (const row of rows) items.push(await fullProduct(row));
    return res.json(listResponse(items, page, limit, total));
  } catch (err) { return next(err); }
});

router.get('/products/:slug', async (req, res, next) => {
  try {
    const row = await loadProductRow(req.params.slug);
    if (!row) return res.status(404).json({ error: 'Not found', message: 'Product not found' });
    return res.json({ data: await fullProduct(row) });
  } catch (err) { return next(err); }
});

// ---------- Categories ----------
router.get('/categories', async (_req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM categories ORDER BY id ASC');
    return res.json({ data: rows.map(serializeCategory) });
  } catch (err) { return next(err); }
});

router.get('/categories/:slug', async (req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found', message: 'Category not found' });
    return res.json({ data: serializeCategory(rows[0]) });
  } catch (err) { return next(err); }
});

// ---------- Stores ----------
router.get('/stores', async (_req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM stores ORDER BY id ASC');
    return res.json({ data: rows.map(serializeStore) });
  } catch (err) { return next(err); }
});

router.get('/stores/:id', async (req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM stores WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found', message: 'Store not found' });
    return res.json({ data: serializeStore(rows[0]) });
  } catch (err) { return next(err); }
});

// ---------- Locations ----------
router.get('/locations', async (_req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM locations ORDER BY id ASC');
    return res.json({ data: rows.map(serializeLocation) });
  } catch (err) { return next(err); }
});

router.get('/locations/:slug', async (req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM locations WHERE slug = ? LIMIT 1', [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found', message: 'Location not found' });
    return res.json({ data: serializeLocation(rows[0]) });
  } catch (err) { return next(err); }
});

// ---------- Franchises ----------
router.get('/franchises', async (_req, res, next) => {
  try {
    const [rows] = await getPool().query(
      'SELECT * FROM franchises ORDER BY display_order ASC, id ASC'
    );
    return res.json({ data: rows.map(serializeFranchise) });
  } catch (err) { return next(err); }
});

router.get('/franchises/:slug', async (req, res, next) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM franchises WHERE slug = ? LIMIT 1', [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found', message: 'Franchise not found' });
    return res.json({ data: serializeFranchise(rows[0]) });
  } catch (err) { return next(err); }
});

// ---------- Google reviews ----------
// Returns configured:false until GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID are set.
router.get('/reviews/google', async (_req, res, next) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    if (!apiKey || !placeId) {
      return res.json({ data: { configured: false, rating: null, reviewCount: 0, reviews: [] } });
    }
    try {
      const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
      const r = await fetch(url, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
      });
      if (!r.ok) throw new Error(`Places API ${r.status}`);
      const body = await r.json();
      const reviews = (body.reviews || []).map((rv) => ({
        rating: rv.rating ?? null,
        text: rv.text?.text || '',
        authorName: rv.authorAttribution?.displayName || '',
        authorPhotoUri: rv.authorAttribution?.photoUri || null,
        authorUri: rv.authorAttribution?.uri || null,
        publishTime: rv.publishTime || null,
      }));
      return res.json({
        data: {
          configured: true,
          rating: body.rating ?? null,
          reviewCount: body.userRatingCount ?? 0,
          reviews,
        },
      });
    } catch (e) {
      return res.json({ data: { configured: true, rating: null, reviewCount: 0, reviews: [] } });
    }
  } catch (err) { return next(err); }
});

// ---------- Inquiries / quote ----------
// POST /inquiries/quote — current prices (incl. active promos) for cart items.
router.post('/inquiries/quote', async (req, res, next) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const out = [];
    for (const it of items) {
      const row = await loadProductRow(it.productId);
      if (!row) continue;
      const images = await loadProductImages(row.id);
      const price = toNumberOrNull(row.price);
      out.push({
        productId: row.id,
        productName: row.name,
        productImage: images.length ? images[0].imageUrl : null,
        unitPrice: effectivePrice(row),
        originalPrice: price,
        promo: Number(row.promo || 0),
        promoExpiresAt: row.promo_expires_at ? new Date(row.promo_expires_at).toISOString() : null,
      });
    }
    return res.json({ data: { items: out } });
  } catch (err) { return next(err); }
});

// POST /inquiries — contact form and cart quote requests.
router.post('/inquiries', async (req, res, next) => {
  try {
    const b = req.body || {};
    const type = ['GENERAL', 'PRODUCT', 'PARTNERSHIP'].includes(b.type) ? b.type : 'GENERAL';
    const items = Array.isArray(b.items) ? b.items : [];

    const [result] = await getPool().query(
      `INSERT INTO inquiries (type, channel, language, name, company, email, phone, notes, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        b.channel || null,
        b.language || 'fr',
        b.name || null,
        b.company || null,
        b.email || null,
        b.phone || null,
        b.notes || null,
        b.message || null,
      ]
    );
    const inquiryId = result.insertId;
    for (const it of items) {
      await getPool().query(
        'INSERT INTO inquiry_items (inquiry_id, product_id, quantity) VALUES (?, ?, ?)',
        [inquiryId, it.productId || null, Number(it.quantity) || 1]
      );
    }

    // Plain-text recap (used as the WhatsApp message by the frontend).
    const lines = [`Nouvelle demande Khatra (${type})`];
    if (b.name) lines.push(`Nom: ${b.name}`);
    if (b.company) lines.push(`Entreprise: ${b.company}`);
    if (b.email) lines.push(`Email: ${b.email}`);
    if (b.phone) lines.push(`Téléphone: ${b.phone}`);
    if (items.length) {
      lines.push('Produits:');
      for (const it of items) {
        const row = await loadProductRow(it.productId);
        lines.push(`- ${row ? row.name : `#${it.productId}`} x${Number(it.quantity) || 1}`);
      }
    }
    if (b.notes) lines.push(`Notes: ${b.notes}`);
    if (b.message) lines.push(`Message: ${b.message}`);
    const summary = lines.join('\n');

    // Email sending is not configured (no SMTP_* env) — the frontend shows
    // "envoi par e-mail non configuré sur le serveur" in that case.
    const emailConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
    return res.status(201).json({
      data: {
        summary,
        inquiry: { id: inquiryId, message: summary },
        emailDelivery: { sent: false, configured: emailConfigured },
      },
    });
  } catch (err) { return next(err); }
});

// ---------- Translate ----------
// No provider configured: return the input texts unchanged (French fallback).
router.post('/translate', async (req, res, next) => {
  try {
    const texts = Array.isArray(req.body?.texts) ? req.body.texts : [];
    return res.json({ data: { translations: texts.map((t) => String(t)) } });
  } catch (err) { return next(err); }
});

module.exports = router;
