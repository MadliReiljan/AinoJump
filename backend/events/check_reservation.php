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
    return;
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
    return;
}


$eventQuery = "SELECT is_for_children FROM event WHERE id = :eventId";
$eventStmt = $db->prepare($eventQuery);
$eventStmt->bindParam(':eventId', $eventId);
$eventStmt->execute();
$eventData = $eventStmt->fetch(PDO::FETCH_ASSOC);
$isForChildren = $eventData && isset($eventData['is_for_children']) && $eventData['is_for_children'] == 1;

if ($isForChildren) {
    $childrenQuery = "SELECT id FROM person WHERE parent_id = :parentId";
    $childrenStmt = $db->prepare($childrenQuery);
    $childrenStmt->bindParam(':parentId', $personId);
    $childrenStmt->execute();
    $childrenIds = $childrenStmt->fetchAll(PDO::FETCH_COLUMN);
    $reservedChildIds = [];
    if (!empty($childrenIds)) {
        $inQuery = implode(',', array_fill(0, count($childrenIds), '?'));
        $reservationQuery = "SELECT person_id FROM reservations WHERE event_id = ? AND person_id IN ($inQuery)";
        $reservationStmt = $db->prepare($reservationQuery);
        $reservationStmt->execute(array_merge([$eventId], $childrenIds));
        $reservedChildIds = $reservationStmt->fetchAll(PDO::FETCH_COLUMN);
    }
    http_response_code(200);
    echo json_encode([
        "reservedChildIds" => array_map('intval', $reservedChildIds)
    ]);
    return;
} else {
    $query = "SELECT * FROM reservations WHERE person_id = :personId AND event_id = :eventId";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':personId', $personId);
    $stmt->bindParam(':eventId', $eventId);
    $stmt->execute();
    $isReserved = $stmt->rowCount() > 0;
    http_response_code(200);
    echo json_encode(["isReserved" => $isReserved]);
    return;
}
?>