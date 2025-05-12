<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$headers = getallheaders();
if (!isset($headers['Authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}

include_once '../database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT e.id, e.title, e.body, e.time, e.max_capacity, e.is_for_children, e.is_recurring,
                e.color,
                (SELECT COUNT(*) FROM reservations r WHERE r.event_id = e.id) AS reserved_count 
          FROM event e";
              
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