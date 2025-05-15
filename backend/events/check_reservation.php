<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../database.php';
include_once '../validate_token.php';

$database = new Database();
$db = $database->getConnection();

$authorizationHeader = getallheaders()['Authorization'] ?? '';
if (!$authorizationHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authorizationHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
$token = str_replace('Bearer ', '', $authorizationHeader);

$user = validateToken($db, $token);

if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Autoriseerimine puudub - Vale tooken"]);
    exit();
}

$personId = $user['person_id'];

$eventId = null;
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $eventId = isset($_GET['eventId']) ? $_GET['eventId'] : null;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $eventId = $data->eventId ?? null;
}

if (!$eventId) {
    http_response_code(400);
    echo json_encode(["message" => "Event ID on vajalik"]);
    exit();
}

$query = "SELECT * FROM reservations WHERE person_id = :personId AND event_id = :eventId";
$stmt = $db->prepare($query);
$stmt->bindParam(':personId', $personId);
$stmt->bindParam(':eventId', $eventId);
$stmt->execute();

$isReserved = $stmt->rowCount() > 0;

http_response_code(200);
echo json_encode(["isReserved" => $isReserved]);
?>