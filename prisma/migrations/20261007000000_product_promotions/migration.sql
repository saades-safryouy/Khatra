ALTER TABLE `products`
  ADD COLUMN `promo` DECIMAL(5, 2) NULL,
  ADD COLUMN `promo_expires_at` DATETIME(3) NULL;
