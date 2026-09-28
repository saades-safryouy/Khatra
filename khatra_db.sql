-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2026 at 08:34 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `khatra_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `active`, `display_order`, `created_at`, `updated_at`) VALUES
(2, 'Caf�', 'cafe', 'Grains d�exception et blends signatures.', '/uploads/categories/1789501981389-527252371.jpg', 1, 1, '2026-09-15 19:53:01.421', '2026-09-16 14:39:14.945'),
(3, 'Sirops', 'sirops', 'Sirops gourmands et concentr�s.', NULL, 1, 2, '2026-09-16 14:36:41.424', '2026-09-16 14:39:14.952'),
(4, 'Bubbles', 'bubbles', 'Perles de fruits �clatantes.', NULL, 1, 3, '2026-09-16 14:36:41.439', '2026-09-16 14:39:14.960');

-- --------------------------------------------------------

--
-- Table structure for table `franchise_concepts`
--

CREATE TABLE `franchise_concepts` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `whatsapp_message` varchar(1000) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `franchise_concepts`
--

INSERT INTO `franchise_concepts` (`id`, `name`, `slug`, `short_description`, `description`, `image`, `whatsapp_message`, `active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Khatra Coffee Shop', 'coffee-shop', 'L�exp�rience du caf� de sp�cialit�, baristas form�s et espace de vie chaleureux.', 'D�couvrez le concept de franchise Khatra Coffee Shop.', NULL, 'Bonjour Khatra, je suis int�ress� par la franchise Khatra Coffee Shop.', 1, 1, '2026-09-15 00:50:42.011', '2026-09-16 14:39:14.932'),
(2, 'Khatra Market', 'khatra-market', 'Boutique gourmande d�di�e au caf�, sirops artisanaux et accessoires barista.', 'D�couvrez le concept de franchise Khatra Market.', NULL, 'Bonjour Khatra, je suis int�ress� par la franchise Khatra Market.', 1, 2, '2026-09-15 00:50:42.021', '2026-09-16 14:39:14.939');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('GENERAL','PARTNERSHIP','PRODUCT') NOT NULL DEFAULT 'GENERAL',
  `name` varchar(200) NOT NULL,
  `company` varchar(200) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('NEW','CONTACTED','CLOSED') NOT NULL DEFAULT 'NEW',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `type`, `name`, `company`, `email`, `phone`, `message`, `status`, `created_at`, `updated_at`) VALUES
(2, 'GENERAL', 'Test User', 'Test Cafe', 'test@khatra.ma', '+212600000000', 'Test inquiry message', 'NEW', '2026-09-16 14:40:11.865', '2026-09-16 14:40:11.865'),
(3, 'GENERAL', 'Integration Test', NULL, 'test@example.com', NULL, 'Testing full stack connect', 'NEW', '2026-09-16 14:51:05.084', '2026-09-16 16:54:43.396'),
(4, 'PRODUCT', 'SAAD ES-SAFRYOUY', 'srgharh', 'saadessafryouy@gmail.com', '+212644796181', 'Bonjour, je souhaite obtenir un devis professionnel pour le produit : Bubbles Passion Fruit saaaad.', 'CLOSED', '2026-09-16 22:58:09.303', '2026-09-20 21:55:32.930'),
(5, 'PRODUCT', 'aymen', 'aymen buisness', 'saadessafryouy@gmail.com', '+212644796181', 'Bonjour, je souhaite obtenir un devis professionnel pour le produit : Grain de Café Khatra.any', 'NEW', '2026-09-20 15:14:55.006', '2026-09-20 15:14:55.006');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `city` varchar(120) NOT NULL,
  `region` varchar(120) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `slug`, `city`, `region`, `description`, `active`, `created_at`, `updated_at`) VALUES
(2, 'Casablanca Centre', 'casablanca', 'Casablanca', NULL, NULL, 1, '2026-09-16 14:39:14.966', '2026-09-16 14:39:14.966'),
(3, 'Rabat Agdal', 'rabat', 'Rabat', NULL, NULL, 1, '2026-09-16 14:39:14.974', '2026-09-16 14:39:14.974'),
(4, 'Marrakech Gu�liz', 'marrakech', 'Marrakech', NULL, NULL, 1, '2026-09-16 14:39:14.988', '2026-09-16 14:39:14.988'),
(5, 'Tanger Malabata', 'tanger', 'Tanger', NULL, NULL, 1, '2026-09-16 14:39:14.994', '2026-09-16 14:39:14.994');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `short_description`, `description`, `reference`, `status`, `featured`, `created_at`, `updated_at`, `price`) VALUES
(2, 2, 'Espresso Arabicawdgjnqyhjk', 'espresso-arabica', 'le Meilleur café grain', 'le Meilleur café grain dans le maroc', '', 'ACTIVE', 1, '2026-09-15 19:56:16.100', '2026-09-20 15:13:20.768', 120.00),
(3, 2, 'Grain de Caf� Khatra', 'grain-khatra', 'S�lection de grains de caf� premium pour professionnels et coffee shops.', 'S�lection rigoureuse de grains de caf� d�origine pour les professionnels exigeants. Torr�faction sur-mesure garantissant une crema onctueuse et une stabilit� parfaite.', 'KHT-COF-001', 'ACTIVE', 1, '2026-09-16 14:39:15.039', '2026-09-16 14:39:15.039', NULL),
(4, 2, 'Khatra 360� Signature', 'cafe-360', 'L�assemblage signature Khatra con�u pour un �quilibre parfait en tasse.', 'Le blend signature de Khatra. Un profil aromatique complexe m�lant chocolat noir, noisette grill�e et une subtile touche d�agrumes.', 'KHT-COF-002', 'ACTIVE', 1, '2026-09-16 14:39:15.047', '2026-09-16 14:39:15.047', NULL),
(5, 3, 'Sirop Gourmet Biscuit', 'sirop-biscuit', 'Saveur biscuit dor�e et croustillante pour cr�ations chaudes et froides.', 'Un sirop gourmand aux notes authentiques de sabl� artisanal. Apporte de la texture et un parfum r�confortant � vos boissons signatures.', 'KHT-SYR-001', 'ACTIVE', 1, '2026-09-16 14:39:15.060', '2026-09-16 14:39:15.060', NULL),
(6, 3, 'Sirop Caramel Beurre Sal�', 'sirop-caramel', 'L�incontournable des coffee shops : caramel onctueux avec pointe de sel.', 'La r�f�rence ind�tr�nable de la carte des boissons. Texture sirupeuse, �quilibre sucr�-sal� ma�tris�.', 'KHT-SYR-002', 'ACTIVE', 1, '2026-09-16 14:39:15.067', '2026-09-16 14:39:15.067', NULL),
(7, 3, 'Sirop Noisette Grill�e', 'sirop-noisette', 'Notes chaudes et toast�es pour cappuccinos et latte art.', 'Toute la rondeur de la noisette fra�chement torr�fi�e. Se marie particuli�rement bien avec les expressos cors�s.', 'KHT-SYR-003', 'ACTIVE', 0, '2026-09-16 14:39:15.076', '2026-09-20 18:13:26.619', 17777.00),
(8, 3, 'Sirop Toffee Nut Intense', 'sirop-toffee', 'Association gourmande de caramel au beurre et noisettes croquantes.', 'Un profil festif et r�confortant tr�s pl�biscit� par les clients des coffee shops modernes en automne et hiver.', 'KHT-SYR-004', 'ACTIVE', 0, '2026-09-16 14:39:15.081', '2026-09-16 14:39:15.081', NULL),
(9, 4, 'Bubbles Popping Fraise', 'bubbles-fraise', 'Perles de jus de fraise qui �clatent en bouche pour bubble teas et mocktails.', 'Perles translucides remplies d�un jus concentr� � la fraise. Enveloppe fine en alginate qui lib�re instantan�ment une saveur fruit�e intense.', 'KHT-BUB-001', 'ACTIVE', 1, '2026-09-16 14:39:15.087', '2026-09-16 14:39:15.087', NULL),
(10, 4, 'Bubbles Popping Mangue', 'bubbles-mangue', 'Perles exotiques � la mangue m�re pour th�s glac�s et cr�ations estivales.', 'L�explosion tropicale de la mangue m�re. Parfaites pour dynamiser votre carte de boissons fra�ches avec des couleurs vibrantes.', 'KHT-BUB-002', 'ACTIVE', 0, '2026-09-16 14:39:15.093', '2026-09-16 22:56:16.438', 150.00);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `display_order`, `created_at`) VALUES
(3, 2, '/uploads/products/1789917200664-396323253.jpg', 'Espresso Arabicawdgjnqyhjk', 0, '2026-09-20 15:13:20.748'),
(4, 7, '/uploads/products/1789928006402-769628067.jpg', 'Sirop Noisette Grill�e', 0, '2026-09-20 18:13:26.607');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(10) UNSIGNED NOT NULL,
  `location_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `address` varchar(500) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `google_maps_url` varchar(1000) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `location_id`, `name`, `address`, `latitude`, `longitude`, `phone`, `google_maps_url`, `image`, `description`, `active`, `created_at`, `updated_at`) VALUES
(2, 2, 'Khatra Flagship Hay Sadri', 'Boulevard Mohamed Bouziane, Hay Sadri, Casablanca', NULL, NULL, '+212 5 22 10 20 30', 'https://maps.google.com/?q=Hay+Sadri+Casablanca', NULL, 'Coffee Shop & Showroom | Lun - Dim: 07h00 - 23h00', 1, '2026-09-16 14:39:15.006', '2026-09-16 14:39:15.006'),
(3, 2, 'Khatra Coffee Maarif', 'Rue Jean Jaur�s, Maarif, Casablanca', NULL, NULL, '+212 5 22 20 30 40', 'https://maps.google.com/?q=Maarif+Casablanca', NULL, 'Coffee Shop | Lun - Dim: 07h30 - 23h30', 1, '2026-09-16 14:39:15.014', '2026-09-16 14:39:15.014'),
(5, 4, 'Khatra Gu�liz', 'Boulevard Mohamed V, Gu�liz, Marrakech', NULL, NULL, '+212 5 24 40 50 60', 'https://maps.google.com/?q=Gueliz+Marrakech', NULL, 'Coffee Shop | Lun - Dim: 08h00 - 00h00', 1, '2026-09-16 14:39:15.027', '2026-09-16 14:39:15.027'),
(7, 2, 'khatra market 9ri3a', 'HC74+9V Casablanca', NULL, NULL, '+212644796181', 'https://www.google.com/maps/place/Khatra+Market/@33.5634218,-7.5928591,17z/data=!3m1!4b1!4m6!3m5!1s0xda6330bc02425b1:0x2bf915c5e06f7ff7!8m2!3d33.5634218!4d-7.5928591!16s%2Fg%2F11nvw19kg1?entry=ttu&g_ep=EgoyMDI2MDkyMC4wIKXMDSoASAFQAw%3D%3D', '/uploads/stores/1790173337113-249524041.png', 'any', 1, '2026-09-23 14:22:17.151', '2026-09-23 14:22:17.151');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN') NOT NULL DEFAULT 'ADMIN',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Khatra', 'Admin', 'admin@khatra.ma', '$2a$12$YL5ai0f7gaD9.qsvO4Ych.mupTT3L.tgZZbJAs6Hh5U85YgO7ybr6', 'ADMIN', 1, '2026-09-15 00:50:41.973', '2026-09-16 14:39:14.920');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('410f33cb-d764-46ea-b11c-a0407ef21bb9', 'cb4e3a636680b66bc2d5618756044bdd5e24d893bc1d08aac68e12d6bf3e4bb5', '2026-09-15 00:50:37.996', '20260915005037_init', NULL, NULL, '2026-09-15 00:50:37.504', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_key` (`slug`);

--
-- Indexes for table `franchise_concepts`
--
ALTER TABLE `franchise_concepts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `franchise_concepts_slug_key` (`slug`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `locations_slug_key` (`slug`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_key` (`slug`),
  ADD KEY `products_category_id_fkey` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_fkey` (`product_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stores_location_id_fkey` (`location_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `franchise_concepts`
--
ALTER TABLE `franchise_concepts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
