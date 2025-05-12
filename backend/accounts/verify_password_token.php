<?php
require_once '../config/database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(['valid' => false]);
    exit;
}

$now = date('Y-m-d H:i:s');
$stmt = $conn->prepare("SELECT * FROM password_resets WHERE token = ? AND expiry > ?");
$stmt->bind_param("ss", $token, $now);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['valid' => false]);
    exit;
}

echo json_encode(['valid' => true]);
?>