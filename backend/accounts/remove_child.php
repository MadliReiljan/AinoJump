<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Autoriseerimine puudub."));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

$userData = validateToken($db, $token);
if (!$userData) {
    http_response_code(401);
    echo json_encode(array("message" => "Token on vale või aegunud."));
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input['childId'])) {
    http_response_code(400);
    echo json_encode(["message" => "Lapse ID on kohustuslik."]);
    exit();
}
$childId = intval($input['childId']);

try {
    $email = $userData['email'];

    $stmt = $db->prepare("SELECT u.person_id FROM user u WHERE u.email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(500);
        echo json_encode(["message" => "Kasutaja info leidmine ebaõnnestus."]);
        exit();
    }
    
    $userPersonId = $user['person_id'];

    $stmt = $db->prepare("SELECT * FROM person WHERE id = ? AND parent_id = ?");
    $stmt->execute([$childId, $userPersonId]);
    
    $child = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$child) {
        http_response_code(403);
        echo json_encode(["message" => "Puuduvad õigused selle lapse eemaldamiseks või lapsi ei leitud."]);
        exit();
    }

    $stmt = $db->prepare("DELETE FROM reservations WHERE person_id = ?");
    $stmt->execute([$childId]);

    $stmt = $db->prepare("DELETE FROM person WHERE id = ?");
    $stmt->execute([$childId]);
    
    http_response_code(200);
    echo json_encode(["message" => "Laps edukalt eemaldatud."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Serveri viga: " . $e->getMessage()]);
}