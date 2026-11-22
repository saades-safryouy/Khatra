const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { getPool } = require('../db');
const { requireAuth, requireAdmin } = require('../auth');
const {
  serializeCategory,
  serializeProduct,
  serializeStore,
  parseJson,
} = require('../serializers');

const router = express.Router();
router.use(requireAuth, requireAdmin);

const UPLOADS_ROOT = path.join(__dirname, '..', 'public', 'uploads');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_ROOT, 'products');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const storeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_ROOT, 'stores');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const uploadProducts = multer({ storage });
const uploadStore = multer({ storage: storeStorage });

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

async function loadProductRow(id) {
  const [rows] = await getPool().query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function fullProduct(row) {
  return serializeProduct(row, await loadProductImages(row.id));
}

function productFields(body) {
  const numOrNull = (v) => (v === undefined || v === '' || v === null ? null : Number(v));
  return {
    slug: body.slug || null,
    name: body.name || null,
    categoryId: body.categoryId ?? body.category_id ?? null,
    reference: body.reference || null,
    price: numOrNull(body.price),
    promo: Number(body.promo || 0),
    promoExpiresAt: body.promoExpiresAt || body.promo_expires_at || null,
    shortDescription: body.shortDescription || body.short_description || null,
    description: body.description || null,
    formats: Array.isArray(body.formats) ? body.formats : parseJson(body.formats, ['Standard']),
    features: Array.isArray(body.features) ? body.features : parseJson(body.features, []),
    featured: body.featured === true || body.featured === 'true' || body.featured === '1' ? 1 : 0,
    status: body.status || 'ACTIVE',
  };
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ---------- Admin products ----------
router.get('/products', async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePage(req);
    const [[{ total }]] = await getPool().query('SELECT COUNT(*) AS total FROM products');
    const [rows] = await getPool().query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.id ASC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const items = [];
    for (const row of rows) items.push(await fullProduct(row));
    return res.json(listResponse(items, page, limit, total));
  } catch (err) { return next(err); }
});

router.post('/products', uploadProducts.array('images', 10), async (req, res, next) => {
  try {
    const f = productFields(req.body);
    if (!f.name) return res.status(400).json({ error: 'Bad request', message: 'name is required' });
    const slug = f.slug || slugify(f.name);
    const [result] = await getPool().query(
      `INSERT INTO products (slug, name, category_id, reference, price, promo, promo_expires_at,
        short_description, description, formats, features, featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, f.name, f.categoryId, f.reference, f.price, f.promo, f.promoExpiresAt,
        f.shortDescription, f.description, JSON.stringify(f.formats), JSON.stringify(f.features),
        f.featured, f.status,
      ]
    );
    const productId = result.insertId;
    const files = req.files || [];
    for (let i = 0; i < files.length; i++) {
      await getPool().query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
        [productId, `/uploads/products/${files[i].filename}`, i]
      );
    }
    const row = await loadProductRow(productId);
    return res.status(201).json({ data: await fullProduct(row) });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Conflict', message: 'A product with this slug already exists' });
    }
    return next(err);
  }
});

router.put('/products/:id', uploadProducts.array('images', 10), async (req, res, next) => {
  try {
    const existing = await loadProductRow(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found', message: 'Product not found' });
    const f = productFields(req.body);
    const slug = f.slug || existing.slug;
    await getPool().query(
      `UPDATE products SET slug = ?, name = ?, category_id = ?, reference = ?, price = ?,
        promo = ?, promo_expires_at = ?, short_description = ?, description = ?,
        formats = ?, features = ?, featured = ?, status = ? WHERE id = ?`,
      [
        slug, f.name || existing.name, f.categoryId, f.reference, f.price, f.promo, f.promoExpiresAt,
        f.shortDescription, f.description, JSON.stringify(f.formats), JSON.stringify(f.features),
        f.featured, f.status, req.params.id,
      ]
    );
    const files = req.files || [];
    if (files.length) {
      await getPool().query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
      for (let i = 0; i < files.length; i++) {
        await getPool().query(
          'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
          [req.params.id, `/uploads/products/${files[i].filename}`, i]
        );
      }
    }
    const row = await loadProductRow(req.params.id);
    return res.json({ data: await fullProduct(row) });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Conflict', message: 'A product with this slug already exists' });
    }
    return next(err);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const existing = await loadProductRow(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found', message: 'Product not found' });
    await getPool().query('DELETE FROM products WHERE id = ?', [req.params.id]);
    return res.json({ data: { id: Number(req.params.id), deleted: true } });
  } catch (err) { return next(err); }
});

// ---------- Admin stores ----------
router.get('/stores', async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePage(req);
    const [[{ total }]] = await getPool().query('SELECT COUNT(*) AS total FROM stores');
    const [rows] = await getPool().query(
      'SELECT * FROM stores ORDER BY id ASC LIMIT ? OFFSET ?', [limit, offset]
    );
    return res.json(listResponse(rows.map(serializeStore), page, limit, total));
  } catch (err) { return next(err); }
});

function storeFields(body) {
  return {
    name: body.name || null,
    city: body.city || 'Casablanca',
    locationId: body.locationId ?? body.location_id ?? null,
    address: body.address || null,
    hours: body.hours || null,
    type: body.type || null,
    description: body.description || null,
    phone: body.phone || null,
    email: body.email || null,
    googleMapsUrl: body.googleMapsUrl || body.google_maps_url || null,
    latitude: body.latitude === undefined || body.latitude === '' ? null : Number(body.latitude),
    longitude: body.longitude === undefined || body.longitude === '' ? null : Number(body.longitude),
    active: body.active === false || body.active === 'false' || body.active === '0' ? 0 : 1,
  };
}

router.post('/stores', uploadStore.single('image'), async (req, res, next) => {
  try {
    const f = storeFields(req.body);
    if (!f.name) return res.status(400).json({ error: 'Bad request', message: 'name is required' });
    const image = req.file ? `/uploads/stores/${req.file.filename}` : (req.body.image || null);
    const [result] = await getPool().query(
      `INSERT INTO stores (name, city, location_id, address, hours, type, description, phone,
        email, google_maps_url, image, latitude, longitude, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        f.name, f.city, f.locationId, f.address, f.hours, f.type, f.description, f.phone,
        f.email, f.googleMapsUrl, image, f.latitude, f.longitude, f.active,
      ]
    );
    const [rows] = await getPool().query('SELECT * FROM stores WHERE id = ? LIMIT 1', [result.insertId]);
    return res.status(201).json({ data: serializeStore(rows[0]) });
  } catch (err) { return next(err); }
});

router.put('/stores/:id', uploadStore.single('image'), async (req, res, next) => {
  try {
    const [existing] = await getPool().query('SELECT * FROM stores WHERE id = ? LIMIT 1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Not found', message: 'Store not found' });
    const f = storeFields(req.body);
    const image = req.file
      ? `/uploads/stores/${req.file.filename}`
      : (req.body.image !== undefined ? req.body.image : existing[0].image);
    await getPool().query(
      `UPDATE stores SET name = ?, city = ?, location_id = ?, address = ?, hours = ?, type = ?,
        description = ?, phone = ?, email = ?, google_maps_url = ?, image = ?,
        latitude = ?, longitude = ?, active = ? WHERE id = ?`,
      [
        f.name || existing[0].name, f.city, f.locationId, f.address, f.hours, f.type,
        f.description, f.phone, f.email, f.googleMapsUrl, image,
        f.latitude, f.longitude, f.active, req.params.id,
      ]
    );
    const [rows] = await getPool().query('SELECT * FROM stores WHERE id = ? LIMIT 1', [req.params.id]);
    return res.json({ data: serializeStore(rows[0]) });
  } catch (err) { return next(err); }
});

router.delete('/stores/:id', async (req, res, next) => {
  try {
    const [existing] = await getPool().query('SELECT * FROM stores WHERE id = ? LIMIT 1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Not found', message: 'Store not found' });
    await getPool().query('DELETE FROM stores WHERE id = ?', [req.params.id]);
    return res.json({ data: { id: Number(req.params.id), deleted: true } });
  } catch (err) { return next(err); }
});

// ---------- Admin categories (read-only) ----------
router.get('/categories', async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePage(req);
    const [[{ total }]] = await getPool().query('SELECT COUNT(*) AS total FROM categories');
    const [rows] = await getPool().query(
      'SELECT * FROM categories ORDER BY id ASC LIMIT ? OFFSET ?', [limit, offset]
    );
    return res.json(listResponse(rows.map(serializeCategory), page, limit, total));
  } catch (err) { return next(err); }
});

module.exports = router;
