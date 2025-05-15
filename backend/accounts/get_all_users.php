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

if ($userData['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(array("message" => "Sissepääs keelatud. Ainult omanikud saavad kõiki kasutajaid vaadata."));
    exit();
}

try {
    $query = "SELECT u.id, p.full_name, u.email, u.role, p.phone
              FROM user u
              JOIN person p ON u.person_id = p.id
              ORDER BY u.id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $users = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $nameParts = explode(' ', $row['full_name'], 2);
        $firstName = $nameParts[0];
        $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
        $users[] = array(
            "id" => $row['id'],
            "firstName" => $firstName,
            "lastName" => $lastName,
            "fullName" => $row['full_name'],
            "email" => $row['email'],
            "role" => $row['role'],
            "phone" => $row['phone']
        );
    }
    http_response_code(200);
    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Serveri viga: " . $e->getMessage()));
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Serveri viga: " . $e->getMessage()));
}