<?php
require_once '../database.php';
require_once '../validate_token.php';

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: authorization, content-type, x-requested-with");
    }
    header("Access-Control-Allow-Origin: " . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
    exit(0);
}

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Ainult POST lubatud."]);
    exit();
}

$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if (!isset($headers['authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $headers['authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
$authHeader = $headers['authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);
if (!$token) {
    http_response_code(401);
    echo json_encode(["message" => "Autoriseerimine puudub."]);
    exit();
}

$database = new Database();
$pdo = $database->getConnection();
$userData = validateToken($pdo, $token);
if (!$userData) {
    http_response_code(401);
    echo json_encode(["message" => "Vigane või aegunud token."]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['reservationId'])) {
    http_response_code(400);
    echo json_encode(["message" => "reservationId puudub."]);
    exit();
}
$reservationId = intval($input['reservationId']);


if ($userData['role'] !== 'owner' && $userData['role'] !== 'admin') {
    http_response_code(403);
     echo json_encode(["message" => "Pole piisavalt õigusi."]);
     exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM reservations WHERE id = :reservationId");
    $stmt->bindParam(':reservationId', $reservationId, PDO::PARAM_INT);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Broneeringut ei leitud."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Serveri viga."]);
}
