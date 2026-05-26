<?php
// =========================================================================
// game/api/save-score.php — Simpan skor murid ke tabel `scores`
// Hanya user yang sudah login yang bisa simpan. Aman dari SQL injection.
// =========================================================================

session_start();
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

if (!isset($_SESSION["email"])) {
  http_response_code(401);
  echo json_encode(["error" => "not_logged_in"]);
  exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["error" => "method_not_allowed"]);
  exit();
}

include_once("../../config.php");

// Baca JSON body
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["error" => "invalid_json"]);
  exit();
}

$score     = isset($data["score"])     ? (int) $data["score"]               : 0;
$levelId   = isset($data["levelId"])   ? substr((string) $data["levelId"], 0, 50)   : "";
$levelName = isset($data["levelName"]) ? substr((string) $data["levelName"], 0, 100) : "";

// Validasi range skor wajar (cegah spam absurd)
if ($score < 0 || $score > 999999) {
  http_response_code(400);
  echo json_encode(["error" => "invalid_score"]);
  exit();
}

$email = $_SESSION["email"];
$nama  = $_SESSION["nama_lengkap"] ?? $email;

$stmt = $conn->prepare(
  "INSERT INTO scores (email, nama_lengkap, skor, level_id, level_name) VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssiss", $email, $nama, $score, $levelId, $levelName);

if ($stmt->execute()) {
  echo json_encode(["ok" => true, "id" => $stmt->insert_id]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "db_error", "detail" => $stmt->error]);
}
