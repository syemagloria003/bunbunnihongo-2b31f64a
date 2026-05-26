<?php
// =========================================================================
// game/index.php — GUARD LOGIN
// Cek apakah user sudah login lewat /login.php. Kalau belum, redirect.
// Kalau sudah, sajikan file game.html (hasil build React).
// =========================================================================

session_start();

if (!isset($_SESSION["email"])) {
  // Sesuaikan path ini kalau login.php-mu tidak di root domain.
  header("Location: ../login.php");
  exit();
}

// Cek juga masa aktif langganan (opsional, sama seperti dashboard.php).
// Hapus blok ini kalau tidak perlu.
include_once("../config.php");
$today = date("Y-m-d");
$stmt = $conn->prepare("SELECT status, expired_date FROM users WHERE email = ?");
$stmt->bind_param("s", $_SESSION["email"]);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
  if ($row["status"] !== "aktif" || $row["expired_date"] < $today) {
    session_destroy();
    header("Location: ../login.php?expired=1");
    exit();
  }
}

// Sajikan game React (hasil build, di-rename dari index.html → game.html).
$html = file_get_contents(__DIR__ . "/game.html");
if ($html === false) {
  http_response_code(500);
  echo "Game belum di-upload. File game.html tidak ditemukan.";
  exit();
}

header("Content-Type: text/html; charset=utf-8");
echo $html;
