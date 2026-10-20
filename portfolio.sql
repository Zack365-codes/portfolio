-- ========================================================
-- Database Schema for ZackCodes Portfolio
-- Compatible with MySQL / MariaDB (XAMPP default)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `portfolio_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

-- --------------------------------------------------------
-- Table structure for table `messages`
-- Stores contact form submissions with prepared statement protection
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `projects`
-- Stores portfolio showcase projects rendered dynamically
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,          -- e.g., 'filter-web', 'filter-ui', 'filter-app'
  `category_name` VARCHAR(60) NOT NULL,     -- e.g., 'Website', 'UI Design', 'Application'
  `description` TEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `live_url` VARCHAR(255) DEFAULT '#',
  `github_url` VARCHAR(255) DEFAULT '#',
  `display_order` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Seed Initial Data for `projects`
-- --------------------------------------------------------
INSERT INTO `projects` (`id`, `title`, `category`, `category_name`, `description`, `image`, `live_url`, `github_url`, `display_order`, `is_featured`) VALUES
(1, 'Responsive Fruit Shopping Website', 'filter-web', 'Website', 'Modern responsive ecommerce fruit store website built with HTML5, CSS3, and Bootstrap.', 'assets/img/portfolio/ecom.png', 'https://zack365-codes.github.io/E-commerce-website/', 'https://github.com/Zack365-codes/E-commerce-website', 1, 1),
(2, 'Notes Return Counter', 'filter-ui', 'UI Design', 'Clean cash return counter interface focused on financial usability and responsive UX.', 'assets/img/portfolio/counter.png', 'https://zack365-codes.github.io/counter/', 'https://github.com/Zack365-codes/counter', 2, 1),
(3, 'Responsive Health Center Website', 'filter-app', 'Application', 'Interactive healthcare web portal developed with modular frontend technologies and booking flow.', 'assets/img/portfolio/health.png', 'https://zack365-codes.github.io/health-center/', 'https://github.com/Zack365-codes/health-center', 3, 1),
(4, 'Sticky Notes System', 'filter-web', 'Website', 'Professional interactive sticky notes workflow designed for quick thoughts and business organization.', 'assets/img/portfolio/stickynotes.png', 'https://zack365-codes.github.io/sticky-notes-system/', 'https://github.com/Zack365-codes/sticky-notes-system', 4, 1),
(5, 'Dashboard Interface & Tic-Tac-Toe', 'filter-ui', 'UI Design', 'Structured interactive web game and dashboard interface with crisp visual hierarchy and state handling.', 'assets/img/portfolio/tictaktoe.png', 'https://zack365-codes.github.io/tic-tac-toe/', 'https://github.com/Zack365-codes/tic-tac-toe', 5, 1),
(6, 'Interactive Elixir Web Experience', 'filter-app', 'Application', 'Dynamic interactive frontend experience featuring responsive components, smooth animations, and rich UI.', 'assets/img/portfolio/elixir.png', 'https://zack365-codes.github.io/Elixir/', 'https://github.com/Zack365-codes/Elixir', 6, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
