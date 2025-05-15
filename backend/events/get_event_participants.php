<?php
require_once '../database.php';
require_once '../validate_token.php';

$database = new Database();
$pdo = $database->getConnection();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: authorization, content-type, x-requested-with");
    }
    header("Access-Control-Allow-Origin: " . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
    exit(0);
}

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    }
    http_response_code(405);
    echo json_encode(["message" => "Ainult GET lubatud."]);
    exit();
}

$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if (!isset($headers['authorization'])) {
    http_response_code(401);
    echo json_encode(["message" => "Autoriseerimine puudub."]);
    exit();
}

$token = str_replace('Bearer ', '', $headers['authorization']);
$userData = validateToken($pdo, $token);
if (!$userData) {
    http_response_code(401);
    echo json_encode(["message" => "Vigane või aegunud token."]);
    exit();
}

if (!isset($_GET['eventId'])) {
    http_response_code(400);
    echo json_encode(["message" => "eventId puudub."]);
    exit();
}

$eventId = intval($_GET['eventId']);

try {
    $stmt = $pdo->prepare("
        SELECT r.id, u.email, p.full_name
        FROM reservations r
        JOIN user u ON r.person_id = u.person_id
        JOIN person p ON u.person_id = p.id
        WHERE r.event_id = :eventId

        UNION ALL

        SELECT r.id, NULL as email, p.full_name
        FROM reservations r
        JOIN person p ON r.person_id = p.id
        WHERE r.event_id = :eventId AND p.parent_id IS NOT NULL
    ");
    $stmt->execute(['eventId' => $eventId]);
    $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($participants);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Serveri viga."
    ]);
}
