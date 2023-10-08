-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2023 at 01:29 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `brand` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`id`, `name`, `brand`, `description`, `image`, `price`, `stock`) VALUES
('19615ebb-cff5-4c90-b6c9-37f3ef28c3af', 'Ford Maverick', 'Ford', 'The blue-oval brand aimed the new vehicle at those who thought a mid-size pickup was too big for their needs. Maverick was not only smaller, but it was also lighter', 'maverick.png', 34000, 0),
('69703be3-a825-4fc2-b099-7a1f69507cbd', 'Ford GT40', 'Ford', 'The Ford GT40 is a high-performance endurance racing car commissioned by the Ford Motor Company.', 'fordgt40.png', 187000, 160),
('924a1cd4-5b7e-4551-a0ab-61adfd0f929f', 'Ford Ranger Wiltrak', 'Ford', 'The Ford Ranger Wildtrak is simple construction, rugged chassis, and fuel-efficient engines made it a great choice over its competitors.', 'rangerwildtrak.png', 63000, 418),
('a8ce7402-dd9f-4d5e-85ee-24eaa4969ce9', 'Ford Shelby GT350', 'Ford', 'Introduced in late 1964, Ford Mustang quickly found its way on the market and launched the pony-car era', 'mustanggt350.png', 53273, 150),
('b30514b2-cd91-49d9-a6db-df9ff172948d', 'Ford Mustang GT', 'Ford', 'The Ford Mustang is a series of American automobiles manufactured by Ford. In continuous production since 1964, the Mustang is currently the longest-produced Ford car nameplate', 'mustanggt.png', 23600, 520),
('b356bace-00e2-4662-b4d7-f39d60bc4467', 'Ford GT 2020', 'Ford', 'The Ford GT is a mid-engine two-seater sports car manufactured and marketed by American automobile manufacturer Ford for the 2005 model year in conjunction with the company\'s 2003 centenary', 'fordgt2020.png', 238000, 299),
('d954e946-d7c0-452d-a206-03b56943cd74', 'Ford Shelby GT500', 'Ford', 'The Shelby GT500 2007 is the second generation of the high performance variant of the Ford Mustang built by Shelby.', 'shelbygt500.png', 82000, 394);

-- --------------------------------------------------------

--
-- Table structure for table `carcheckout`
--

CREATE TABLE `carcheckout` (
  `id` varchar(191) NOT NULL,
  `id_checkout` varchar(191) NOT NULL,
  `id_car` varchar(191) NOT NULL,
  `price` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checkout`
--

CREATE TABLE `checkout` (
  `id` varchar(191) NOT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `user_id` varchar(191) NOT NULL,
  `total` int(11) NOT NULL,
  `status` enum('APPROVED','REJECTED','PENDING') NOT NULL,
  `provinsi` varchar(191) NOT NULL,
  `kota` varchar(191) NOT NULL,
  `alamat` varchar(191) NOT NULL,
  `kodepos` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `car_id` varchar(191) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carcheckout`
--
ALTER TABLE `carcheckout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CarCheckout_id_checkout_fkey` (`id_checkout`),
  ADD KEY `CarCheckout_id_car_fkey` (`id_car`);

--
-- Indexes for table `checkout`
--
ALTER TABLE `checkout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Checkout_user_id_fkey` (`user_id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Transaction_user_id_fkey` (`user_id`),
  ADD KEY `Transaction_car_id_fkey` (`car_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carcheckout`
--
ALTER TABLE `carcheckout`
  ADD CONSTRAINT `CarCheckout_id_car_fkey` FOREIGN KEY (`id_car`) REFERENCES `car` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `CarCheckout_id_checkout_fkey` FOREIGN KEY (`id_checkout`) REFERENCES `checkout` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `checkout`
--
ALTER TABLE `checkout`
  ADD CONSTRAINT `Checkout_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `Transaction_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `car` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
