-- =========================================================
-- KHATRA B2B PLATFORM DATABASE
-- MySQL / MariaDB
-- =========================================================

-- ---------------------------------------------------------
-- 1. CREATE DATABASE
-- ---------------------------------------------------------

CREATE DATABASE IF NOT EXISTS khatra_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE khatra_db;


-- =========================================================
-- 2. USERS
-- Admin dashboard authentication
-- =========================================================

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,

    role ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN',

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_users_email (email),

    INDEX idx_users_active (active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 3. CATEGORIES
-- Product categories
-- =========================================================

CREATE TABLE categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,

    description TEXT NULL,

    image VARCHAR(500) NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_categories_slug (slug),

    INDEX idx_categories_active (active),
    INDEX idx_categories_display_order (display_order)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 4. PRODUCTS
-- B2B product catalogue
-- =========================================================

CREATE TABLE products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    category_id INT UNSIGNED NOT NULL,

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,

    short_description VARCHAR(500) NULL,
    description TEXT NULL,

    reference VARCHAR(100) NULL,

    status ENUM('ACTIVE', 'INACTIVE')
        NOT NULL DEFAULT 'ACTIVE',

    featured BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_products_slug (slug),

    UNIQUE KEY uq_products_reference (reference),

    INDEX idx_products_category (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_featured (featured),

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 5. PRODUCT IMAGES
-- Multiple images per product
-- =========================================================

CREATE TABLE product_images (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    product_id INT UNSIGNED NOT NULL,

    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_product_images_product (product_id),
    INDEX idx_product_images_order (display_order),

    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 6. STORES / POINTS DE VENTE
-- Includes map coordinates
-- =========================================================

DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(200) NOT NULL,

    city VARCHAR(100) NOT NULL,
    region VARCHAR(150) NULL,

    address VARCHAR(500) NOT NULL,

    -- Coordinates used directly by the React map
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,

    -- Spatial point
    coordinates POINT NULL,

    phone VARCHAR(50) NULL,

    google_maps_url VARCHAR(1000) NULL,

    image VARCHAR(500) NULL,

    description TEXT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_stores_city (city),
    INDEX idx_stores_region (region),
    INDEX idx_stores_active (active),
    INDEX idx_stores_coordinates (latitude, longitude),

    SPATIAL INDEX idx_stores_geo (coordinates)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 7. FRANCHISE CONCEPTS
--
-- Exactly two concepts:
-- 1. Khatra Coffee Shop
-- 2. Khatra Market
--
-- This table is intentionally simple.
-- No franchise tracking/application management.
-- WhatsApp is used for direct discussion.
-- =========================================================

CREATE TABLE franchise_concepts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,

    short_description VARCHAR(500) NULL,

    description TEXT NULL,

    image VARCHAR(500) NULL,

    whatsapp_message TEXT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_franchise_slug (slug),

    INDEX idx_franchise_active (active),
    INDEX idx_franchise_display_order (display_order)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 8. INQUIRIES
-- General B2B contact / partnership inquiries
-- =========================================================

CREATE TABLE inquiries (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    type ENUM(
        'GENERAL',
        'PARTNERSHIP',
        'PRODUCT'
    ) NOT NULL DEFAULT 'GENERAL',

    name VARCHAR(200) NOT NULL,

    company VARCHAR(200) NULL,

    email VARCHAR(255) NOT NULL,

    phone VARCHAR(50) NULL,

    message TEXT NOT NULL,

    status ENUM(
        'NEW',
        'CONTACTED',
        'CLOSED'
    ) NOT NULL DEFAULT 'NEW',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_inquiries_type (type),
    INDEX idx_inquiries_status (status),
    INDEX idx_inquiries_created (created_at)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 9. FRANCHISE INITIAL DATA
-- Exactly two franchise concepts
-- =========================================================

INSERT INTO franchise_concepts (
    name,
    slug,
    short_description,
    description,
    whatsapp_message,
    active,
    display_order
)
VALUES
(
    'Khatra Coffee Shop',
    'coffee-shop',
    'Join the Khatra Coffee Shop franchise concept.',
    'Discover the Khatra Coffee Shop franchise opportunity and contact our team to discuss the concept and partnership details.',
    'Bonjour Khatra, je suis intéressé par la franchise Khatra Coffee Shop et je souhaite avoir plus d’informations.',
    TRUE,
    1
),
(
    'Khatra Market',
    'khatra-market',
    'Join the Khatra Market franchise concept.',
    'Discover the Khatra Market franchise opportunity and contact our team to discuss the concept and partnership details.',
    'Bonjour Khatra, je suis intéressé par la franchise Khatra Market et je souhaite avoir plus d’informations.',
    TRUE,
    2
);


-- =========================================================
-- 10. OPTIONAL INITIAL CATEGORIES
--
-- These are examples only.
-- You can remove this section if you want the admin
-- dashboard to start with an empty catalogue.
-- =========================================================

INSERT INTO categories (
    name,
    slug,
    description,
    active,
    display_order
)
VALUES
(
    'Coffee',
    'coffee',
    'Khatra coffee products.',
    TRUE,
    1
),
(
    'Tea',
    'tea',
    'Khatra tea products.',
    TRUE,
    2
),
(
    'Retail Products',
    'retail-products',
    'Khatra products intended for retail distribution.',
    TRUE,
    3
);


-- =========================================================
-- 11. CHECK DATABASE
-- =========================================================

SHOW TABLES;

-- =========================================================
-- END OF DATABASE
-- =========================================================