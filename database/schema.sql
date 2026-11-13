-- Digital Fishery Records Management System - MySQL schema
-- Run once:  mysql -u root -p < database/schema.sql
-- (Spring Boot with ddl-auto=update will also create/alter tables automatically.)

CREATE DATABASE IF NOT EXISTS fishery_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fishery_db;

CREATE TABLE IF NOT EXISTS users (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,           -- BCrypt hash
  full_name  VARCHAR(100) NOT NULL,
  role       VARCHAR(20)  NOT NULL            -- ADMIN (Fishery Personnel) | STAFF (Authorized Staff)
);

CREATE TABLE IF NOT EXISTS fishery_records (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
  -- Fisher / Fisherfolk Registration
  first_name            VARCHAR(60)  NOT NULL,
  middle_name           VARCHAR(60),
  surname               VARCHAR(60)  NOT NULL,
  address               VARCHAR(200),
  contact_number        VARCHAR(30),
  registration_date     DATE         NOT NULL,
  -- Permit Information
  permit_number         VARCHAR(50)  UNIQUE,
  permit_expiry         DATE,
  -- Fishing Boat
  boat_name             VARCHAR(80),
  boat_registration_no  VARCHAR(50),
  boat_type             VARCHAR(50),
  -- Fishing Gear
  fishing_gear          VARCHAR(100),
  -- Fishing Activity
  fishing_activity      VARCHAR(100),
  fishing_area          VARCHAR(100),
  INDEX idx_surname (surname)
);
