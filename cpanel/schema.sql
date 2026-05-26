-- =========================================================================
-- schema.sql — Tabel untuk simpan skor murid
-- Jalankan ini SEKALI di phpMyAdmin → pilih database yang sama dengan login.php
-- =========================================================================

CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  skor INT NOT NULL,
  level_id VARCHAR(50) DEFAULT NULL,
  level_name VARCHAR(100) DEFAULT NULL,
  tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_skor (skor DESC),
  INDEX idx_email (email),
  INDEX idx_tanggal (tanggal DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
