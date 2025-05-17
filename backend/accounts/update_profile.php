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
    echo json_encode(array("message" => "Authorization header missing"));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

$userData = validateToken($db, $token);
if (!$userData) {
    http_response_code(401);
    echo json_encode(array("message" => "Invalid or expired token"));
    exit();
}

try {
    $userId = $userData['user_id'];

    $userQuery = "SELECT person_id FROM user WHERE id = ?";
    $userStmt = $db->prepare($userQuery);
    $userStmt->execute([$userId]);
    
    if ($userStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(array("message" => "User not found"));
        exit();
    }
    
    $userRow = $userStmt->fetch(PDO::FETCH_ASSOC);
    $personId = $userRow['person_id'];

    $data = json_decode(file_get_contents("php://input"));
    
    if (isset($data->phone)) {
        $updateQuery = "UPDATE person SET phone = ? WHERE id = ?";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->execute([$data->phone, $personId]);
        
        http_response_code(200);
        echo json_encode(array("message" => "Profile updated successfully"));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing phone number"));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Server error: " . $e->getMessage()));
}
?>