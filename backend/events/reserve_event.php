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

error_reporting(E_ALL);
ini_set('display_errors', 1);

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$eventId = $data['eventId'] ?? null;
if (!$eventId) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing event ID."]);
    exit();
}

$authorizationHeader = getallheaders()['Authorization'] ?? '';
if (!$authorizationHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authorizationHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
$token = str_replace('Bearer ', '', $authorizationHeader);

$user = validateToken($db, $token);

if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized - Invalid token"]);
    exit();
}

$personId = $user['person_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $query = "SELECT * FROM reservations WHERE person_id = :personId AND event_id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $personId);
        $stmt->bindParam(':eventId', $eventId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "You have already reserved a spot for this event."]);
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
            echo json_encode(["message" => "Event not found"]);
            exit();
        }

        if ($event['reserved_count'] >= $event['max_capacity']) {
            http_response_code(400);
            echo json_encode(["message" => "Event is fully booked"]);
            exit();
        }

        $query = "INSERT INTO reservations (person_id, event_id, created_at) VALUES (:personId, :eventId, NOW())";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $personId, PDO::PARAM_INT);
        $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(["message" => "Reservation successful"]);

    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            "message" => "Internal server error during reservation", 
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            "message" => "Internal server error", 
            "error" => $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $query = "DELETE FROM reservations WHERE person_id = :personId AND event_id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $personId);
        $stmt->bindParam(':eventId', $eventId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Reservation canceled successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No reservation found to cancel"]);
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            "message" => "Internal server error during cancellation", 
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Internal server error"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>