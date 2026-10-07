SET @product_price_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'price'
);
SET @migration_statement = IF(
  @product_price_exists = 0,
  'ALTER TABLE `products` ADD COLUMN `price` DECIMAL(10, 2) NULL',
  'SELECT 1'
);
PREPARE khatra_migration_stmt FROM @migration_statement;
EXECUTE khatra_migration_stmt;
DEALLOCATE PREPARE khatra_migration_stmt;

SET @inquiry_quantity_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'total_quantity'
);
SET @migration_statement = IF(
  @inquiry_quantity_exists = 0,
  'ALTER TABLE `inquiries` ADD COLUMN `total_quantity` INTEGER NULL',
  'SELECT 1'
);
PREPARE khatra_migration_stmt FROM @migration_statement;
EXECUTE khatra_migration_stmt;
DEALLOCATE PREPARE khatra_migration_stmt;

SET @inquiry_cart_total_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'cart_total'
);
SET @migration_statement = IF(
  @inquiry_cart_total_exists = 0,
  'ALTER TABLE `inquiries` ADD COLUMN `cart_total` DECIMAL(18, 2) NULL',
  'SELECT 1'
);
PREPARE khatra_migration_stmt FROM @migration_statement;
EXECUTE khatra_migration_stmt;
DEALLOCATE PREPARE khatra_migration_stmt;

CREATE TABLE IF NOT EXISTS `inquiry_items` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `inquiry_id` INTEGER UNSIGNED NOT NULL,
  `product_id` INTEGER UNSIGNED NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `product_image` VARCHAR(500) NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `quantity` INTEGER NOT NULL,
  `line_total` DECIMAL(18, 2) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `inquiry_items_inquiry_id_idx`(`inquiry_id`),
  INDEX `inquiry_items_product_id_idx`(`product_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `inquiry_items`
  ADD CONSTRAINT `inquiry_items_inquiry_id_fkey`
  FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiry_items_product_id_fkey`
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
