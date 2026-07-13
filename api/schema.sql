-- Esquema de la base de datos para Instituciones Conectadas
-- Compatible con MySQL / MariaDB (Hostinger y XAMPP)

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
  id          VARCHAR(64)  NOT NULL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  programa    VARCHAR(255) NOT NULL,
  color       VARCHAR(16)  NOT NULL DEFAULT '#5273C2',
  event_date  DATE         NOT NULL,
  event_time  VARCHAR(32)  NOT NULL,
  location    VARCHAR(255) NOT NULL,
  image       TEXT         NULL,
  form_url    TEXT         NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
