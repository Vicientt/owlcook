-- OwlCook Database Schema
-- Apply with: mysql -u <user> -p <database> < docs/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255)        NOT NULL,
  password_hash VARCHAR(255)        NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255),
  description TEXT,
  time        VARCHAR(100),
  cost        VARCHAR(100),
  servings    VARCHAR(100),
  difficulty  VARCHAR(100),
  ingredients JSON,
  steps       JSON,
  calories    VARCHAR(100),
  protein     VARCHAR(100),
  carbs       VARCHAR(100),
  fat         VARCHAR(100),
  user_id     INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
