-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2019 at 03:04 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(40) NOT NULL,
  `postid` int(40) NOT NULL,
  `ownerid` int(40) NOT NULL,
  `content` varchar(4000) NOT NULL,
  `time` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `like_of_comment`
--

CREATE TABLE `like_of_comment` (
  `id` int(40) NOT NULL,
  `ownerid` int(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `like_of_post`
--

CREATE TABLE `like_of_post` (
  `id` int(40) NOT NULL,
  `ownerid` int(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--

-- --------------------------------------------------------

-- Table structure for table `post`
--

CREATE TABLE `post` (
  `post_id` int(40) NOT NULL,
  `description` text DEFAULT NULL,
  `ownerid` int(40) NOT NULL,
  `filename` text NOT NULL,
  `privacy` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `user_id` int(40) NOT NULL,
  `name` text DEFAULT NULL,
  `email` varchar(40) NOT NULL,
  `password` text NOT NULL,
  `mainAdmin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`,`postid`,`ownerid`),
  ADD KEY `postid` (`postid`),
  ADD KEY `ownerid` (`ownerid`);

--
-- Indexes for table `like_of_comment`
--
ALTER TABLE `like_of_comment`
  ADD UNIQUE KEY `id` (`id`,`ownerid`),
  ADD KEY `ownerid` (`ownerid`);

--
-- Indexes for table `like_of_post`
--
ALTER TABLE `like_of_post`
  ADD UNIQUE KEY `id` (`id`,`ownerid`),
  ADD KEY `ownerid` (`ownerid`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`post_id`),
  ADD UNIQUE KEY `id` (`post_id`,`ownerid`),
  ADD KEY `ownerid` (`ownerid`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `id` (`user_id`,`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `post_id` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `user_id` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`postid`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`ownerid`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `like_of_comment`
--
ALTER TABLE `like_of_comment`
  ADD CONSTRAINT `like_of_comment_ibfk_2` FOREIGN KEY (`id`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `like_of_comment_ibfk_3` FOREIGN KEY (`ownerid`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `like_of_post`
--
ALTER TABLE `like_of_post`
  ADD CONSTRAINT `like_of_post_ibfk_1` FOREIGN KEY (`id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `like_of_post_ibfk_2` FOREIGN KEY (`ownerid`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`ownerid`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
