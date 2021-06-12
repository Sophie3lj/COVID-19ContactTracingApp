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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL),(2,NULL,NULL,NULL,NULL,NULL,NULL),(3,'\"+type+\"','\"+email+\"','\"+first_name+\"','\"+last_name+\"','\"+password+\"','\"+phone_number+\"'),(4,'\"+type+\"','\"+email+\"','\"+first_name+\"','\"+last_name+\"','\"+password+\"','\"+phone_number+\"'),(5,'USER','undefined','undefined','undefined','undefined','undefined'),(6,'USER','undefined','undefined','undefined','undefined','undefined'),(7,'USER','me@me.com','jer','pa','1234','000'),(8,'VENUE','me@me.com','-','-','1234','000'),(9,'VENUE','me@me.com','-','-','1234','000'),(10,'VENUE','me@me.com','-','-','1234','000'),(11,'VENUE','me@me.com','-','-','1234','000'),(12,'VENUE','me@me.com','-','-','1234','000'),(13,'VENUE','me@me.com','-','-','1234','000'),(14,'VENUE','me@me.com','-','-','1234','000'),(15,'VENUE','me@me.com','-','-','1234','000'),(16,'VENUE','me@me.com','-','-','1234','000'),(17,'VENUE','me@me.com','-','-','1234','000'),(18,'VENUE','me@me.com','-','-','1234','000'),(19,'VENUE','me@me.com','-','-','1234','000'),(20,'VENUE','me@me.com','-','-','1234','000'),(21,'VENUE','me@me.com','-','-','1234','000'),(22,'VENUE','me@me.com','-','-','1234','000'),(23,'VENUE','me@me.com','-','-','1234','000'),(24,'VENUE','me@me.com','-','-','[object Promise]','000'),(25,'VENUE','me@me.com','-','-','1234','000'),(26,'VENUE','me@me.com','-','-','1234','000'),(27,'USER','me@me.com','Hi','Me','1234','000'),(28,'USER','me@me.com','Hi','Me','$2b$10$F4s4lX9Lrf7kQxuA.TDLkuI2YydLD.DscupUdZWHl3LZELtyCdbrK','000'),(29,'USER','jeremy@gmail.com','Jeremy','Parkinson','$2b$10$ROWn6RJGJHe3bZb5OtJJ5.WyMa73aPJl5oi5c0nyeZ1x00m1PYFBi','0403000000'),(30,'USER','jeremy.parkinson.012@gmail.com','TheFallen018','undefined','-','-'),(31,'USER','Test@example.com','Test','Example','$2b$10$Q6lHdqSsa3HBIX3oKZKaAuak1z8.5FlCZE.x3Y/hwIY0Li9LTc3LS','00000000000'),(32,'VENUE','testvenue@example.com','-','-','$2b$10$MAbJN4x4a2kTFUxr7GV/W.yV7.a3DSr3pQlNK8ha6dGtBys9ZIPZ2','0000000000'),(33,'ADMIN','Admin@example.com','Admin','Example','$2b$10$hI5UGQ.QYIVvTyvOeILbVuTWPZjKosVxPOEQ8M0beq/Eyc9c5JQIm','000000000');
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
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `checkins_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`),
  CONSTRAINT `checkins_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkins`
--

LOCK TABLES `checkins` WRITE;
/*!40000 ALTER TABLE `checkins` DISABLE KEYS */;
INSERT INTO `checkins` VALUES (1,1,NULL,'2021-05-28 06:29:46'),(2,2,NULL,'2021-05-28 06:29:46'),(3,3,1,'2021-06-08 01:10:48');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `suburb_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suburbs`
--

LOCK TABLES `suburbs` WRITE;
/*!40000 ALTER TABLE `suburbs` DISABLE KEYS */;
INSERT INTO `suburbs` VALUES (1,'Unley'),(2,'Eastwood'),(3,'North Adelaide'),(4,'Burnside'),(5,'Pooraka'),(6,'example');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Dymocks',1,147,'King William Rd',1,5061,'SA'),(2,'Art To Art',2,69,'Glen Osmond Rd',2,5063,'SA'),(3,'Zambrero North Adelaide',2,32,'O\'Connell St',3,5006,'SA'),(4,'idk',23,18,'se',5,NULL,'SA'),(5,'idk',24,18,'se',5,5095,'SA'),(6,'idk',25,18,'se',5,5095,'SA'),(7,'idk',26,18,'se',5,5095,'SA');
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

-- Dump completed on 2021-06-10  0:25:30
