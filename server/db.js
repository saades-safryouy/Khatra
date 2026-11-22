const mysql = require('mysql2/promise');
const fs = require('fs');

let pool = null;

function getPool() {
  if (pool) return pool;
  let ssl;
  if (process.env.DB_SSL === 'true') {
    ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' };
    if (process.env.DB_SSL_CA) ssl.ca = fs.readFileSync(process.env.DB_SSL_CA);
  }
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'khatra',
    waitForConnections: true,
    connectionLimit: 10,
    ...(ssl ? { ssl } : {}),
  });
  return pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image VARCHAR(512) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category_id INT NULL,
  reference VARCHAR(50) NULL,
  price DECIMAL(10,2) NULL,
  promo DECIMAL(5,2) NOT NULL DEFAULT 0,
  promo_expires_at DATETIME NULL,
  short_description TEXT NULL,
  description TEXT NULL,
  formats JSON NULL,
  features JSON NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Casablanca',
  location_id INT NULL,
  address TEXT NULL,
  hours VARCHAR(255) NULL,
  type VARCHAR(255) NULL,
  description TEXT NULL,
  phone VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  google_maps_url VARCHAR(512) NULL,
  image VARCHAR(512) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS franchises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  short_description TEXT NULL,
  description TEXT NULL,
  whatsapp_message TEXT NULL,
  image VARCHAR(512) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL DEFAULT 'GENERAL',
  channel VARCHAR(20) NULL,
  language VARCHAR(5) NOT NULL DEFAULT 'fr',
  name VARCHAR(255) NULL,
  company VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(100) NULL,
  notes TEXT NULL,
  message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS inquiry_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inquiry_id INT NOT NULL,
  product_id INT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
);
`;

async function initDb() {
  const p = getPool();
  const statements = SCHEMA.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
  for (const st of statements) await p.query(st);
}

module.exports = { getPool, initDb };
