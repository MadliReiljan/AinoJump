<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../database.php';
include_once '../validate_token.php';

$database = new Database();
$db = $database->getConnection();

$headers = getallheaders();
if (!isset($headers['Authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Keelatud - Token on vale."]);
    exit();
}

$parentId = $user['person_id']; 
if (!$parentId) {
    http_response_code(401);
    echo json_encode(["message" => "Token on vale."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->childName) || !trim($data->childName)) {
    http_response_code(400);
    echo json_encode(["message" => "Lapse nimi on kohustuslik."]);
    exit();
}

$childName = htmlspecialchars(strip_tags($data->childName));

try {
    $insert = "INSERT INTO person (full_name, parent_id) VALUES (:name, :parentId)";
    $stmt = $db->prepare($insert);
    $stmt->bindValue(":name", $childName, PDO::PARAM_STR);
    $stmt->bindValue(":parentId", $parentId, PDO::PARAM_INT);

    if ($stmt->execute()) { 
        http_response_code(201);
        echo json_encode(["message" => "Laps lisatud."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Lapse lisamine ebaõnnestus."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Serveri viga."]);
}