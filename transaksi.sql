-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 27, 2023 at 11:57 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `transaksi`
--

-- --------------------------------------------------------

--
-- Table structure for table `Car`
--

CREATE TABLE `Car` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `brand` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Car`
--

INSERT INTO `Car` (`id`, `name`, `brand`, `description`, `image`, `price`, `stock`) VALUES
('19615ebb-cff5-4c90-b6c9-37f3ef28c3af', 'Ford Maverick', 'Ford', 'The blue-oval brand aimed the new vehicle at those who thought a mid-size pickup was too big for their needs. Maverick was not only smaller, but it was also lighter', 'maverick.png', 34000, 0),
('69703be3-a825-4fc2-b099-7a1f69507cbd', 'Ford GT40', 'Ford', 'The Ford GT40 is a high-performance endurance racing car commissioned by the Ford Motor Company.', 'fordgt40.png', 187000, 160),
('924a1cd4-5b7e-4551-a0ab-61adfd0f929f', 'Ford Ranger Wiltrak', 'Ford', 'The Ford Ranger Wildtrak is simple construction, rugged chassis, and fuel-efficient engines made it a great choice over its competitors.', 'rangerwildtrak.png', 63000, 418),
('a8ce7402-dd9f-4d5e-85ee-24eaa4969ce9', 'Ford Shelby GT350', 'Ford', 'Introduced in late 1964, Ford Mustang quickly found its way on the market and launched the pony-car era', 'mustanggt350.png', 53273, 150),
('b30514b2-cd91-49d9-a6db-df9ff172948d', 'Ford Mustang GT', 'Ford', 'The Ford Mustang is a series of American automobiles manufactured by Ford. In continuous production since 1964, the Mustang is currently the longest-produced Ford car nameplate', 'mustanggt.png', 23600, 520),
('b356bace-00e2-4662-b4d7-f39d60bc4467', 'Ford GT 2020', 'Ford', 'The Ford GT is a mid-engine two-seater sports car manufactured and marketed by American automobile manufacturer Ford for the 2005 model year in conjunction with the company\'s 2003 centenary', 'fordgt2020.png', 238000, 299),
('d954e946-d7c0-452d-a206-03b56943cd74', 'Ford Shelby GT500', 'Ford', 'The Shelby GT500 2007 is the second generation of the high performance variant of the Ford Mustang built by Shelby.', 'shelbygt500.png', 82000, 394);

-- --------------------------------------------------------

--
-- Table structure for table `CarHistory`
--

CREATE TABLE `CarHistory` (
  `id` varchar(191) NOT NULL,
  `id_history` varchar(191) NOT NULL,
  `id_car` varchar(191) NOT NULL,
  `price` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `CarHistory`
--

INSERT INTO `CarHistory` (`id`, `id_history`, `id_car`, `price`, `amount`) VALUES
('3a19f081-2464-4024-800e-ab4386006ace', '0af6146b-885e-4df1-b6c4-b9dc9a850851', '69703be3-a825-4fc2-b099-7a1f69507cbd', 187000, 5);

-- --------------------------------------------------------

--
-- Table structure for table `History`
--

CREATE TABLE `History` (
  `id` varchar(191) NOT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `History`
--

INSERT INTO `History` (`id`, `tanggal`, `total`) VALUES
('0af6146b-885e-4df1-b6c4-b9dc9a850851', '2023-05-17 03:46:40.000', 935000),
('0c6e650a-eb14-4b40-a378-004996888bf5', '2023-04-05 03:20:49.000', 1870000),
('10e41a73-9756-486e-a940-e72e0be203ed', '2023-04-05 03:21:34.000', 1505000),
('322e0550-f43c-4c12-af69-0f0083b900cc', '2023-05-10 01:01:41.000', 612000),
('3a953d26-fbfd-4d78-9963-c2f56cdd069d', '2023-05-10 01:02:40.000', 0),
('667ccade-0316-49f2-9102-c43f87795ad6', '2023-04-05 03:26:18.000', 5525000),
('6e3cc766-b045-498d-9e7d-758fe6b1296f', '2023-05-16 23:20:09.000', 2756000),
('8f8b7d7d-8cb4-473a-8a0a-e756b8716733', '2023-04-05 02:32:20.000', 478273),
('b40127c4-46e0-4360-a20d-673eba958dd6', '2023-04-05 03:22:29.000', 1722000),
('da1f7bde-d974-420f-9f8e-e00da4714317', '2023-04-05 02:31:20.000', 2313000);

-- --------------------------------------------------------

--
-- Table structure for table `Transaction`
--

CREATE TABLE `Transaction` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `car_id` varchar(191) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Transaction`
--

INSERT INTO `Transaction` (`id`, `user_id`, `car_id`, `amount`) VALUES
('268e0135-e23c-4b71-bd2c-1f8d5f161d93', '9be5ae70-16f9-4463-88e2-fc60e486b498', 'b30514b2-cd91-49d9-a6db-df9ff172948d', 1),
('2be26141-5807-416f-b90c-4b59493182a2', '9be5ae70-16f9-4463-88e2-fc60e486b498', 'b356bace-00e2-4662-b4d7-f39d60bc4467', 2),
('e30af98f-f743-47d9-9231-d87b3bd2ec4d', '9be5ae70-16f9-4463-88e2-fc60e486b498', 'd954e946-d7c0-452d-a206-03b56943cd74', 1);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `username`, `password`, `role`, `email`, `phone`) VALUES
('4c0b78e0-5b88-4ba6-909e-caa57dd712ee', 'admin', '0192023a7bbd73250516f069df18b500', 'USER', 'admin@gmail.com', '1234567'),
('9be5ae70-16f9-4463-88e2-fc60e486b498', 'edsel', '19eb9259e637025015a877b413b54d2e', 'USER', 'edselmustapa@gmail.com', '0881036165129');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Car`
--
ALTER TABLE `Car`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `CarHistory`
--
ALTER TABLE `CarHistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CarHistory_id_history_fkey` (`id_history`),
  ADD KEY `CarHistory_id_car_fkey` (`id_car`);

--
-- Indexes for table `History`
--
ALTER TABLE `History`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Transaction`
--
ALTER TABLE `Transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Transaction_user_id_fkey` (`user_id`),
  ADD KEY `Transaction_car_id_fkey` (`car_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_phone_key` (`phone`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `CarHistory`
--
ALTER TABLE `CarHistory`
  ADD CONSTRAINT `CarHistory_id_car_fkey` FOREIGN KEY (`id_car`) REFERENCES `Car` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `CarHistory_id_history_fkey` FOREIGN KEY (`id_history`) REFERENCES `History` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `Transaction`
--
ALTER TABLE `Transaction`
  ADD CONSTRAINT `Transaction_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `Car` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
