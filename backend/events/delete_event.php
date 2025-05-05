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
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized - Invalid token."]);
    exit();
}

if ($user['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(["message" => "Access denied. Only owners can delete events."]);
    exit();
}

$query = "DELETE FROM event WHERE id = :eventId";
$stmt = $db->prepare($query);
$stmt->bindParam(":eventId", $eventId, PDO::PARAM_INT);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Event deleted successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete the event."]);
}