require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getPool, initDb } = require('./db');
const { hashPassword } = require('./auth');

async function main() {
  await initDb();
  const pool = getPool();
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf8'));

  // Categories
  const [[{ catCount }]] = await pool.query('SELECT COUNT(*) AS catCount FROM categories');
  if (catCount === 0) {
    for (const c of data.categories) {
      await pool.query('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)', [
        c.name, c.slug, c.image || null,
      ]);
    }
    console.log(`Seeded ${data.categories.length} categories`);
  } else {
    console.log('Categories already seeded, skipping');
  }

  const [cats] = await pool.query('SELECT id, slug FROM categories');
  const catBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // Products (price NULL = "Prix sur demande"; set prices via the admin API)
  const [[{ prodCount }]] = await pool.query('SELECT COUNT(*) AS prodCount FROM products');
  if (prodCount === 0) {
    for (const p of data.products) {
      const categoryId = catBySlug[p.categorySlug] || null;
      const [r] = await pool.query(
        `INSERT INTO products (slug, name, category_id, reference, price, promo,
          promo_expires_at, short_description, description, formats, features, featured, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.slug, p.name, categoryId, p.reference || null, null, 0, null,
          p.shortDescription || null, p.description || null,
          JSON.stringify(p.formats || ['Standard']), JSON.stringify(p.features || []),
          p.featured ? 1 : 0, 'ACTIVE',
        ]
      );
      for (let i = 0; i < (p.images || []).length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
          [r.insertId, p.images[i], i]
        );
      }
    }
    console.log(`Seeded ${data.products.length} products`);
  } else {
    console.log('Products already seeded, skipping');
  }

  // Stores
  const [[{ storeCount }]] = await pool.query('SELECT COUNT(*) AS storeCount FROM stores');
  if (storeCount === 0) {
    for (const s of data.stores) {
      await pool.query(
        `INSERT INTO stores (name, city, address, hours, type, description, phone, email,
          google_maps_url, image, latitude, longitude, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.name, s.city, s.address, s.hours, s.type,
          s.description || `${s.type}|${s.hours}`,
          s.phone || '+212 5 22 00 00 00', s.email || 'contact@khatra.ma',
          s.googleMapsUrl || null, s.image || null, s.latitude, s.longitude, 1,
        ]
      );
    }
    console.log(`Seeded ${data.stores.length} stores`);
  } else {
    console.log('Stores already seeded, skipping');
  }

  // Locations (derived from store cities)
  const [[{ locCount }]] = await pool.query('SELECT COUNT(*) AS locCount FROM locations');
  if (locCount === 0) {
    for (const l of data.locations) {
      await pool.query('INSERT INTO locations (slug, name, city) VALUES (?, ?, ?)', [
        l.slug, l.name, l.city,
      ]);
    }
    console.log(`Seeded ${data.locations.length} locations`);
  } else {
    console.log('Locations already seeded, skipping');
  }

  // Franchises
  const [[{ frCount }]] = await pool.query('SELECT COUNT(*) AS frCount FROM franchises');
  if (frCount === 0) {
    for (let i = 0; i < data.franchises.length; i++) {
      const f = data.franchises[i];
      await pool.query(
        `INSERT INTO franchises (slug, name, short_description, description,
          whatsapp_message, image, active, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          f.slug, f.name, f.shortDescription || null, f.description || null,
          f.whatsappMessage || null, f.image || null, 1, i,
        ]
      );
    }
    console.log(`Seeded ${data.franchises.length} franchises`);
  } else {
    console.log('Franchises already seeded, skipping');
  }

  // Admin user — from env only. Never a hardcoded password.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@khatra.ma';
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [adminEmail]);
  if (existing.length === 0) {
    let hash = process.env.ADMIN_PASSWORD_HASH || null;
    if (!hash && process.env.ADMIN_PASSWORD) {
      hash = await hashPassword(process.env.ADMIN_PASSWORD);
    }
    if (hash) {
      await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [adminEmail, hash, 'ADMIN']
      );
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log('No ADMIN_PASSWORD or ADMIN_PASSWORD_HASH set — admin user NOT created.');
      console.log('Set ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) in the env and re-run the seed.');
    }
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  await pool.end();
  console.log('Seed done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
