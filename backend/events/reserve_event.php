<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
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
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized - Invalid token"]);
    exit();
}

$userEmail = $user['email'];
$personId = $user['person_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $eventId = $data->eventId;

    $query = "SELECT * FROM reservations WHERE person_id = :personId AND event_id = :eventId";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':personId', $personId);
    $stmt->bindParam(':eventId', $eventId);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "You have already reserved a spot for this event."));
        exit();
    }

    $query = "
        SELECT 
            e.id, 
            e.title, 
            e.max_capacity, 
            (SELECT COUNT(*) FROM reservations r WHERE r.event_id = e.id) AS reserved_count 
        FROM event e 
        WHERE e.id = :eventId";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':eventId', $eventId);
    $stmt->execute();

    $event = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$event) {
        http_response_code(404);
        echo json_encode(array("message" => "Event not found"));
        exit();
    }

    if ($event['reserved_count'] >= $event['max_capacity']) {
        http_response_code(400);
        echo json_encode(array("message" => "Event is fully booked"));
        exit();
    }

    try {
        $query = "INSERT INTO reservations (person_id, event_id, created_at) VALUES (:personId, :eventId, NOW())";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $personId);
        $stmt->bindParam(':eventId', $eventId);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(array("message" => "Reservation successful"));
    } catch (Exception $e) {
        error_log("Error reserving event: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Internal server error"));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $eventId = $data->eventId;

    try {
        $query = "DELETE FROM reservations WHERE person_id = :personId AND event_id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $personId);
        $stmt->bindParam(':eventId', $eventId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Unreservation successful"));
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No reservation found to unreserve"));
        }
    } catch (Exception $e) {
        error_log("Error unreserving event: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Internal server error"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}
?>