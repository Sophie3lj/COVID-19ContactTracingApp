-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: ct_app
-- ------------------------------------------------------
-- Server version	8.0.19-0ubuntu5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ct_app`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ct_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ct_app`;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int AUTO_INCREMENT,
  `user_type` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL),(2,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkins`
--

DROP TABLE IF EXISTS `checkins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkins` (
  `id` int AUTO_INCREMENT,
  `venue_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `checkins_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`),
  CONSTRAINT `checkins_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkins`
--

LOCK TABLES `checkins` WRITE;
/*!40000 ALTER TABLE `checkins` DISABLE KEYS */;
INSERT INTO `checkins` VALUES (1,1,NULL,'2021-05-28 06:29:46'),(2,2,NULL,'2021-05-28 06:29:46');
/*!40000 ALTER TABLE `checkins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotspots`
--

DROP TABLE IF EXISTS `hotspots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotspots` (
  `id` int AUTO_INCREMENT,
  `suburb_id` int DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suburb_id` (`suburb_id`),
  CONSTRAINT `hotspots_ibfk_1` FOREIGN KEY (`suburb_id`) REFERENCES `suburbs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotspots`
--

LOCK TABLES `hotspots` WRITE;
/*!40000 ALTER TABLE `hotspots` DISABLE KEYS */;
INSERT INTO `hotspots` VALUES (1,3,NULL,NULL),(2,4,NULL,NULL);
/*!40000 ALTER TABLE `hotspots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suburbs`
--

DROP TABLE IF EXISTS `suburbs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suburbs` (
  `id` int AUTO_INCREMENT,
  `suburb_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suburbs`
--

LOCK TABLES `suburbs` WRITE;
/*!40000 ALTER TABLE `suburbs` DISABLE KEYS */;
INSERT INTO `suburbs` VALUES (1,'Unley'),(2,'Eastwood'),(3,'North Adelaide'),(4,'Burnside');
/*!40000 ALTER TABLE `suburbs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int AUTO_INCREMENT,
  `venue_name` varchar(50) DEFAULT NULL,
  `venue_owner` int DEFAULT NULL,
  `street_number` int DEFAULT NULL,
  `street_name` varchar(50) DEFAULT NULL,
  `suburb` int DEFAULT NULL,
  `postcode` int DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suburb` (`suburb`),
  KEY `venue_owner` (`venue_owner`),
  CONSTRAINT `venues_ibfk_1` FOREIGN KEY (`suburb`) REFERENCES `suburbs` (`id`),
  CONSTRAINT `venues_ibfk_2` FOREIGN KEY (`venue_owner`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Dymocks',1,147,'King William Rd',1,5061,'SA'),(2,'Art To Art',2,69,'Glen Osmond Rd',2,5063,'SA');
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-08  0:04:12
