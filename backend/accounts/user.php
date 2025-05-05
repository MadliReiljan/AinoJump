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
if (!isset($headers['Authorization'])) {
    error_log("Authorization header is missing.");
    http_response_code(401);
    echo json_encode(array("message" => "Authorization header missing."));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);
error_log("Token received: " . $token);

$user = validateToken($db, $token);
if (!$user) {
    error_log("Invalid or expired token.");
    http_response_code(401);
    echo json_encode(array("message" => "Invalid or expired token."));
    exit();
}

try {
    http_response_code(200);
    echo json_encode(array(
        "email" => $user['email'],
        "role" => $user['role'],
        "fullname" => $user['full_name']
    ));
} catch (Exception $e) {
    error_log("Error fetching user data: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Internal server error."));
}