<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Autoriseerimine puudub."));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

$userData = validateToken($db, $token);
if (!$userData) {
    http_response_code(401);
    echo json_encode(array("message" => "Token on vale või aegunud."));
    exit();
}

if ($userData['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(array("message" => "Sissepääs keelatud. Ainult omanikud saavad kasutajaid kustutada."));
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Kasutaja ID on kohustuslik."]);
    exit();
}
$userId = intval($input['id']);

try {
    
    $stmt = $db->prepare("SELECT person_id FROM user WHERE id = ?");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(["message" => "Kasutajat ei leitud."]);
        exit();
    }
    $personId = $row['person_id'];

    
    $stmt = $db->prepare("DELETE FROM user WHERE id = ?");
    $stmt->execute([$userId]);

    http_response_code(200);
    echo json_encode(["message" => "Kasutaja kustutatud."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Serveri viga: " . $e->getMessage()]);
}
