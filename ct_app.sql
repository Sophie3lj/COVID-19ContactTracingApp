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
  `id` int NOT NULL AUTO_INCREMENT,
  `user_type` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'ADMIN','Admin@example.com','Admin','Example','$2b$10$hI5UGQ.QYIVvTyvOeILbVuTWPZjKosVxPOEQ8M0beq/Eyc9c5JQIm','000000000'),(2,'VENUE','dumplings@email.com',NULL,NULL,'$2b$10$1NyT975/X9qeWxFTuJdvBOtHf8hdO00ybUZ0sl/lSXcsuM/LdlDEC','12345677'),(3,'USER','user1@example.com','Joe','Marshall','$2b$10$ojPI6DIONfSD2jHCdTuyQemDT2I2NVXoR0tgbOUie1xPoG1KpG9km','0123456789'),(4,'VENUE','seafood@yum.com','','','$2b$10$.mPhF0zzcban7JokvYselOCp6DHvKmbWuVR.R1wgdArhL1p8OWcny','12345678'),(5,'VENUE','teefshurty@email.com','','','$2b$10$7AWNcF3J1New3HIVNVNIiemurLt4aDgPW4DRjL7Tn0X0nptuhwo8y','230'),(6,'USER','user2@example.com','User2','Example','$2b$10$n5v9rStf4zK4S80E2Gmtq.r59QoBlnSw/uO527LDDJWgs4KFJU/3G','0123456789'),(7,'VENUE','beers@please.com','','','$2b$10$e1RrmQDI.Q8VraBcPZHJ3Ouchh5QBFsMZh5H7Bad11PiYdku1MUQK','1300655506'),(8,'USER','user3@example.com','Elon','Musk','$2b$10$YUowWtueYNd6rp80x2byS.Io.OVnSvw0vAoCSOe/y7jOav2Ne0m2q','0123456789'),(9,'USER','jeremy.parkinson.012@gmail.com','TheFallen018',' ','-','-'),(10,'ADMIN','Daddy.Ian@WDC.com','Daddy','Ian','$2b$10$PYm62IFFozp9QWl5bc6ymODNgu468Xp6oSWuc4wjndJOjs3iA2Bz2','0123456789'),(11,'ADMIN','bloke@place.com','Admin','2','$2b$10$RY0F8GxKZuD6V6cwqnapC.O.W2mtQkozBUsXCS5aN2Ws4aIqqjAJO','0451');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkins`
--

DROP TABLE IF EXISTS `checkins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `date_time` datetime DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `checkins_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`),
  CONSTRAINT `checkins_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkins`
--

LOCK TABLES `checkins` WRITE;
/*!40000 ALTER TABLE `checkins` DISABLE KEYS */;
INSERT INTO `checkins` VALUES (1,100001,3,'2021-06-14 12:47:22',NULL,NULL),(2,100003,3,'2021-06-14 12:47:28',NULL,NULL),(3,100000,3,'2021-06-14 12:47:32',NULL,NULL),(4,100001,3,'2021-06-14 12:47:35',NULL,NULL),(5,NULL,3,'2021-06-14 12:47:39',-34.9891,138.565),(6,100002,3,'2021-06-14 12:47:43',NULL,NULL),(7,100002,6,'2021-06-14 12:48:49',NULL,NULL),(8,100000,6,'2021-06-14 12:48:54',NULL,NULL),(9,NULL,6,'2021-06-14 12:48:57',-34.989,138.565),(10,NULL,6,'2021-06-14 12:49:00',-34.989,138.565),(11,100000,8,'2021-06-14 12:49:34',NULL,NULL),(12,100000,8,'2021-06-14 12:49:36',NULL,NULL),(13,100000,8,'2021-06-14 12:49:37',NULL,NULL),(14,100000,8,'2021-06-14 12:49:38',NULL,NULL),(15,100001,8,'2021-06-14 12:49:42',NULL,NULL),(16,100003,8,'2021-06-14 12:49:45',NULL,NULL),(17,100002,8,'2021-06-14 12:49:48',NULL,NULL),(18,100002,8,'2021-06-14 12:49:49',NULL,NULL),(19,100002,8,'2021-06-14 12:49:51',NULL,NULL),(20,NULL,3,'2021-06-14 13:29:47',-34.97,138.749),(21,100000,3,'2021-06-14 13:35:16',NULL,NULL),(22,NULL,3,'2021-06-14 13:35:21',-34.97,138.749);
/*!40000 ALTER TABLE `checkins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotspots`
--

DROP TABLE IF EXISTS `hotspots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotspots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `suburb_id` int DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suburb_id` (`suburb_id`),
  CONSTRAINT `hotspots_ibfk_1` FOREIGN KEY (`suburb_id`) REFERENCES `suburbs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotspots`
--

LOCK TABLES `hotspots` WRITE;
/*!40000 ALTER TABLE `hotspots` DISABLE KEYS */;
INSERT INTO `hotspots` VALUES (2,2,NULL,NULL),(3,4,NULL,NULL);
/*!40000 ALTER TABLE `hotspots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suburbs`
--

DROP TABLE IF EXISTS `suburbs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suburbs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `suburb_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suburbs`
--

LOCK TABLES `suburbs` WRITE;
/*!40000 ALTER TABLE `suburbs` DISABLE KEYS */;
INSERT INTO `suburbs` VALUES (1,'Park Holme'),(2,'Woodville'),(3,'Adelaide'),(4,'Glenunga'),(5,'Glenunga ');
/*!40000 ALTER TABLE `suburbs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=100004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (100000,'Dumpling King',2,319,'Oaklands Rd',1,5043,'SA'),(100001,'Barnacle Bills',4,922,'Port Rd',2,5011,'SA'),(100002,'Adams Dental',5,45,'Grenfell St',3,5000,'SA'),(100003,'Dan Murphys Glenunga',7,537,'Portrush Rd',4,5064,'SA');
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

-- Dump completed on 2021-06-14 13:42:24
