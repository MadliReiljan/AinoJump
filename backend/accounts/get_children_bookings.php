<?php
require_once __DIR__ . '/../validate_token.php';
require_once __DIR__ . '/../database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getAuthorizationHeader() {
    $headers = [];
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            return $headers['authorization'];
        }
    }
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if (function_exists('apache_request_headers')) {
        $apacheHeaders = apache_request_headers();
        if (isset($apacheHeaders['Authorization'])) {
            return $apacheHeaders['Authorization'];
        } elseif (isset($apacheHeaders['authorization'])) {
            return $apacheHeaders['authorization'];
        }
    }
    return null;
}

$database = new Database();
$pdo = $database->getConnection();

$authHeader = getAuthorizationHeader();
if (!$authHeader) {
    http_response_code(401);
    echo json_encode(["error" => "Autoriseerimine puudub."]);
    exit;
}
$token = str_replace('Bearer ', '', $authHeader);

try {
    $user = validateToken($pdo, $token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Keelatud"]);
        exit;
    }
    $parent_id = $user['person_id'];

    $sql = "SELECT id, full_name FROM person WHERE parent_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$parent_id]);
    $children = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($children as $child) {
        $sql2 = "SELECT r.id, r.event_id, e.title, e.time, r.created_at AS reservation_time
                 FROM reservations r
                 JOIN event e ON r.event_id = e.id
                 WHERE r.person_id = ?
                 ORDER BY e.time DESC";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->execute([$child['id']]);
        $bookings = array_map(function($booking) {
            return [
                'id' => $booking['id'],
                'event_id' => $booking['event_id'],
                'title' => $booking['title'],
                'time' => $booking['time'],
                'reservation_time' => $booking['reservation_time']
            ];
        }, $stmt2->fetchAll(PDO::FETCH_ASSOC));
        $result[] = [
            "child" => [
                "id" => $child['id'],
                "full_name" => $child['full_name']
            ],
            "bookings" => $bookings
        ];
    }
    echo json_encode($result);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Serveri viga", "details" => $e->getMessage()]);
    exit;
}