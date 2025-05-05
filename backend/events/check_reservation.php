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

$data = json_decode(file_get_contents("php://input"));

$authorizationHeader = getallheaders()['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authorizationHeader);

$user = validateToken($db, $token);
if (!$user) {
    error_log("Invalid token: " . $token);
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized - Invalid token"]);
    exit();
}

$personId = $user['person_id'];
$eventId = $data->eventId;

$query = "SELECT * FROM reservations WHERE person_id = :personId AND event_id = :eventId";
$stmt = $db->prepare($query);
$stmt->bindParam(':personId', $personId);
$stmt->bindParam(':eventId', $eventId);
$stmt->execute();

$isReserved = $stmt->rowCount() > 0;

http_response_code(200);
echo json_encode(["isReserved" => $isReserved]);
?>