<?php
// =========================================================================
// game/api/leaderboard.php — Top skor (JSON)
// Mengembalikan skor TERTINGGI per user (bukan tiap kali main),
// supaya satu user tidak menumpuk leaderboard.
// =========================================================================

session_start();
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

// Wajib login (biar leaderboard nggak bisa diintip publik)
if (!isset($_SESSION["email"])) {
  http_response_code(401);
  echo json_encode(["error" => "not_logged_in"]);
  exit();
}

include_once("../../config.php");

$limit = isset($_GET["limit"]) ? (int) $_GET["limit"] : 20;
if ($limit < 1)   $limit = 20;
if ($limit > 100) $limit = 100;

// Ambil skor tertinggi per email
$sql = "
  SELECT s.nama_lengkap AS nama, s.skor, s.tanggal
  FROM scores s
  INNER JOIN (
    SELECT email, MAX(skor) AS best
    FROM scores
    GROUP BY email
  ) b ON s.email = b.email AND s.skor = b.best
  GROUP BY s.email
  ORDER BY s.skor DESC, s.tanggal ASC
  LIMIT ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $limit);
$stmt->execute();
$res = $stmt->get_result();

$rows = [];
while ($r = $res->fetch_assoc()) {
  $rows[] = [
    "nama"    => $r["nama"],
    "skor"    => (int) $r["skor"],
    "tanggal" => $r["tanggal"],
  ];
}

echo json_encode($rows);
