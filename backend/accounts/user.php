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
    echo json_encode(array("message" => "Authoriseerimine puudub."));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(array("message" => "Vale või aegunud tooken."));
    exit();
}

try {
    $firstName = null;
    $lastName = null;
    if (!empty($user['full_name'])) {
        $nameParts = explode(' ', $user['full_name'], 2);
        $firstName = $nameParts[0];
        $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
    }
    http_response_code(200);
    echo json_encode(array(
        "email" => $user['email'],
        "role" => $user['role'],
        "full_name" => $user['full_name'],
        "first_name" => $firstName,
        "last_name" => $lastName
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Serveri viga."));
}