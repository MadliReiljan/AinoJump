<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
    echo json_encode(["message" => "Autoriseerimine puudub."]);
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Token on vale või aegunud."]);
    exit();
}

$personId = $user['person_id'];

try {
    $query = "SELECT e.id AS event_id, e.title, e.time, e.created_at, r.created_at AS reservation_time
              FROM reservations r
              INNER JOIN event e ON r.event_id = e.id
              WHERE r.person_id = :personId
              ORDER BY e.time DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':personId', $personId, PDO::PARAM_INT);
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode($bookings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Serveri viga: " . $e->getMessage()]);
}
