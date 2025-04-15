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

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT id, title, body, time, max_capacity, is_for_children FROM event";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode($events);
} catch (Exception $e) {
    error_log("Error fetching events: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Internal server error."));
}