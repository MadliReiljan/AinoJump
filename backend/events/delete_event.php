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
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Autoriseerimine puudub - Vale tooken."]);
    exit();
}

if ($user['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(["message" => "Sissepääs keelatud. Ainult omanikel on õigus sündmusi kustutada."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$eventId = $data['eventId'] ?? null;
if (!$eventId) {
    http_response_code(400);
    echo json_encode(["message" => "Vale või puuduv sündmuse ID."]);
    exit();
}

$reservationDeleteQuery = "DELETE FROM reservations WHERE event_id = :eventId";
$reservationDeleteStmt = $db->prepare($reservationDeleteQuery);
$reservationDeleteStmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
$reservationDeleteStmt->execute();

$query = "DELETE FROM event WHERE id = :eventId";
$stmt = $db->prepare($query);
$stmt->bindParam(":eventId", $eventId, PDO::PARAM_INT);

if ($stmt->execute()) {
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(["message" => "Sündmus kustutatud edukalt."]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Sündmust ei leitud antud ID-ga."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["message" => "Sündmuse kustutamine ebaõnnestus."]);
}