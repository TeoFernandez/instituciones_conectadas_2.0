-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2026 at 07:40 PM
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
-- Database: `ic_conectadas`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `programa` varchar(255) NOT NULL,
  `color` varchar(16) NOT NULL DEFAULT '#5273C2',
  `event_date` date NOT NULL,
  `event_time` varchar(32) NOT NULL,
  `location` varchar(255) NOT NULL,
  `image` text DEFAULT NULL,
  `form_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `programa`, `color`, `event_date`, `event_time`, `location`, `image`, `form_url`, `created_at`, `updated_at`) VALUES
('evt-1783899380-4ef3f6', 'Justin', 'Conciertos', '#5273C2', '2026-07-13', '10:00', 'Polideportivo', 'http://localhost/AWENTECH/institucionesconectadas/api/uploads/evt-20260713-4aeaf57a117b.webp', 'https://forms.gle/qj92cDGKua3oVA65A', '2026-07-12 23:36:20', '2026-07-12 23:39:41'),
('evt-seed-1', 'Torneo de Iniciación Deportiva', 'Pasitos', '#2EC4B6', '2026-07-11', '10:00 hs', 'Polideportivo Norte', NULL, NULL, '2026-07-12 23:09:06', '2026-07-12 23:09:06'),
('evt-seed-2', 'Jornada de Formación Dirigencial', 'La Universidad en tu Club', '#5273C2', '2026-07-18', '18:00 hs', 'Sede Central', NULL, NULL, '2026-07-12 23:09:06', '2026-07-12 23:09:06'),
('evt-seed-3', 'Huerta Comunitaria', 'Enraizando', '#22C55E', '2026-07-25', '9:30 hs', 'Plaza San Martín', '/img-instituciones/enraizando.png', NULL, '2026-07-12 23:09:06', '2026-07-12 23:09:06'),
('evt-seed-4', 'Jornada Recreativa', 'Ruta de Sonrisas', '#F43F5E', '2026-08-01', '15:00 hs', 'Club Los Andes', '/img-instituciones/sonrisas1.png', NULL, '2026-07-12 23:09:06', '2026-07-12 23:09:06'),
('evt-seed-5', 'Inicio Clases de Apoyo · 2do cuatrimestre', 'Hoja de Ruta', '#FF9F1C', '2026-08-08', '16:00 hs', 'Centro Comunitario', NULL, NULL, '2026-07-12 23:09:06', '2026-07-12 23:09:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$L.l0.4VjTZrbFvGboULZRugYaDFQmEKSe9mgIC7KASeXjKULu2qoO', '2026-07-13 00:08:37', '2026-07-13 00:09:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_date` (`event_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
