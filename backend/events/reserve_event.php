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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $eventId = $data['eventId'] ?? null;
    if (isset($data['action']) && $data['action'] === 'remove') {
        try {
            $childId = $data['childId'] ?? null;
            $query = "SELECT is_for_children FROM event WHERE id = :eventId";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
            $stmt->execute();
            $event = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($event && !empty($event['is_for_children']) && $childId) {
                $childQuery = "SELECT id FROM person WHERE id = :childId AND parent_id = :parentId";
                $childStmt = $db->prepare($childQuery);
                $childStmt->bindParam(':childId', $childId, PDO::PARAM_INT);
                $childStmt->bindParam(':parentId', $personId, PDO::PARAM_INT);
                $childStmt->execute();
                if ($childStmt->rowCount() === 0) {
                    http_response_code(403);
                    echo json_encode(["message" => "See laps ei kuulu sellele kontole."]);
                    exit();
                }
                $unreservePersonId = $childId;
            } else {
                $unreservePersonId = $personId;
            }
            $query = "DELETE FROM reservations WHERE person_id = :personId AND event_id = :eventId";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':personId', $unreservePersonId);
            $stmt->bindParam(':eventId', $eventId);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(["message" => "Reservatsioon tühistatud edukalt"]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Reservatsiooni tühistamine nurjus. Kontrollige, kas see on olemas."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "message" => "Serveri viga tühistamise ajal",
                "error" => $e->getMessage()
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Serveri viga"]);
        }
        return;
    }
    if (!$eventId) {
        http_response_code(400);
        echo json_encode(["message" => "Vale või puuduv ürituse ID."]);
        exit();
    }

    try {
        $query = "SELECT * FROM event WHERE id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
        $stmt->execute();
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$event) {
            http_response_code(404);
            echo json_encode(["message" => "Üritust ei leitud"]);
            exit();
        }

        if (!empty($event['is_for_children'])) {
            $childId = $data['childId'] ?? null;
            if (!$childId) {
                http_response_code(400);
                echo json_encode(["message" => "Puudub ID laste ürituse jaoks."]);
                exit();
            }

            $childQuery = "SELECT id FROM person WHERE id = :childId AND parent_id = :parentId";
            $childStmt = $db->prepare($childQuery);
            $childStmt->bindParam(':childId', $childId, PDO::PARAM_INT);
            $childStmt->bindParam(':parentId', $personId, PDO::PARAM_INT);
            $childStmt->execute();
            if ($childStmt->rowCount() === 0) {
                http_response_code(403);
                echo json_encode(["message" => "See laps ei kuulu sellele kontole."]);
                exit();
            }
            $reservationPersonId = $childId;
        } else {
            $reservationPersonId = $personId;
        }

        $query = "SELECT * FROM reservations WHERE person_id = :personId AND event_id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $reservationPersonId);
        $stmt->bindParam(':eventId', $eventId);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Te olete juba selle ürituse jaoks koha broneerinud."]);
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
            echo json_encode(["message" => "Üritust ei leitud"]);
            exit();
        }

        if ($event['reserved_count'] >= $event['max_capacity']) {
            http_response_code(400);
            echo json_encode(["message" => "Üritus on täis broneeritud"]);
            exit();
        }

        $query = "INSERT INTO reservations (person_id, event_id, created_at) VALUES (:personId, :eventId, NOW())";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $reservationPersonId, PDO::PARAM_INT);
        $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(["message" => "Reservatsioon edukalt loodud"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "message" => "Serveri viga reservatsiooni ajal",
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "message" => "Serveri viga",
            "error" => $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $deleteData = json_decode(file_get_contents("php://input"), true);
    $eventId = $deleteData['eventId'] ?? $_GET['eventId'] ?? null;
    $childId = $deleteData['childId'] ?? $_GET['childId'] ?? null;
    if (!$eventId) {
        http_response_code(400);
        echo json_encode(["message" => "Vale või puuduv ürituse ID."]);
        exit();
    }
    try {
        $query = "SELECT is_for_children FROM event WHERE id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
        $stmt->execute();
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($event && !empty($event['is_for_children']) && $childId) {
            $childQuery = "SELECT id FROM person WHERE id = :childId AND parent_id = :parentId";
            $childStmt = $db->prepare($childQuery);
            $childStmt->bindParam(':childId', $childId, PDO::PARAM_INT);
            $childStmt->bindParam(':parentId', $personId, PDO::PARAM_INT);
            $childStmt->execute();
            if ($childStmt->rowCount() === 0) {
                http_response_code(403);
                echo json_encode(["message" => "See laps ei kuulu sellele kontole."]);
                exit();
            }
            $unreservePersonId = $childId;
        } else {
            $unreservePersonId = $personId;
        }
        $query = "DELETE FROM reservations WHERE person_id = :personId AND event_id = :eventId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':personId', $unreservePersonId);
        $stmt->bindParam(':eventId', $eventId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Reservatsioon tühistatud edukalt"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Reservatsiooni tühistamine nurjus. Kontrollige, kas see on olemas."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "message" => "Serveri viga tühistamise ajal",
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Serveri viga"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Meetod ei ole lubatud"]);
}
?>