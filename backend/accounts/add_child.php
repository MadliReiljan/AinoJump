<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../database.php';

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["message" => "Authorization header missing."]);
    exit();
}

$token = str_replace('Bearer ', '', $headers['Authorization']);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid token."]);
    exit();
}
$parentId = is_numeric($token) ? intval($token) : null;
if (!$parentId) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid token."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->childName) || !trim($data->childName)) {
    http_response_code(400);
    echo json_encode(["message" => "Child name is required."]);
    exit();
}

$childName = htmlspecialchars(strip_tags($data->childName));

try {
    $database = new Database();
    $db = $database->getConnection();

    $insert = "INSERT INTO person (full_name, parent_id) VALUES (:name, :parentId)";
    $stmt = $db->prepare($insert);
    $stmt->bindValue(":name", $childName, PDO::PARAM_STR);
    $stmt->bindValue(":parentId", $parentId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Child added successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add child."]);
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Internal server error."]);
}
