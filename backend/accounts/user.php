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

$database = new Database();
$db = $database->getConnection();

function validateToken($token) {
    if (is_numeric($token)) {
        return intval($token); 
    }
    return false;
}

$headers = getallheaders();
error_log("Headers: " . print_r($headers, true)); 

if (!isset($headers['Authorization'])) {
    error_log("Authorization header is missing.");
    http_response_code(401);
    echo json_encode(array("message" => "Authorization header missing."));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);
error_log("Token received: " . $token); 

$userId = validateToken($token);
if (!$userId) {
    error_log("Invalid or expired token."); 
    http_response_code(401);
    echo json_encode(array("message" => "Invalid or expired token."));
    exit();
}

try {
    $query = "SELECT u.email, u.role, p.full_name
              FROM user u
              INNER JOIN person p ON u.person_id = p.id
              WHERE u.id = :userId";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("User data fetched: " . print_r($user, true)); 
        http_response_code(200);
        echo json_encode(array(
            "email" => $user['email'],
            "role" => $user['role'],
            "fullname" => $user['full_name']
        ));
    } else {
        error_log("User not found for ID: " . $userId); 
        http_response_code(404);
        echo json_encode(array("message" => "User not found."));
    }
} catch (Exception $e) {
    error_log("Error fetching user data: " . $e->getMessage()); 
    http_response_code(500);
    echo json_encode(array("message" => "Internal server error."));
}