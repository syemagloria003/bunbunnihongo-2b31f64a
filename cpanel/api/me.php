<?php
// =========================================================================
// game/api/me.php — Return data user yang sedang login (JSON)
// Game React fetch ke endpoint ini untuk tampilkan "Halo, [Nama]!"
// =========================================================================

session_start();
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

if (!isset($_SESSION["email"])) {
  http_response_code(401);
  echo json_encode(["error" => "not_logged_in"]);
  exit();
}

echo json_encode([
  "email" => $_SESSION["email"],
  "nama"  => $_SESSION["nama_lengkap"] ?? $_SESSION["email"],
]);
