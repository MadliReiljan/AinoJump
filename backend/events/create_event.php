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

$database = new Database();
$db = $database->getConnection();

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Authorization header missing."));
    exit();
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

// Validate the token and get the user ID and role
function validateToken($token) {
    // For simplicity, assume the token is the user ID
    return is_numeric($token) ? intval($token) : false;
}

$userId = validateToken($token);
if (!$userId) {
    http_response_code(401);
    echo json_encode(array("message" => "Invalid or expired token."));
    exit();
}

// Check if the user is an owner
try {
    $query = "SELECT role FROM user WHERE id = :userId";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || $user['role'] !== 'owner') {
        http_response_code(403);
        echo json_encode(array("message" => "Access denied. Only owners can create events."));
        exit();
    }
} catch (Exception $e) {
    error_log("Error validating user role: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Internal server error."));
    exit();
}

// Get event data from the request
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->title) &&
    !empty($data->body) &&
    !empty($data->time) &&
    isset($data->max_capacity) &&
    isset($data->is_for_children)
) {
    try {
        $query = "INSERT INTO event (title, body, time, max_capacity, is_for_children, created_at)
                  VALUES (:title, :body, :time, :max_capacity, :is_for_children, NOW())";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":body", $data->body);
        $stmt->bindParam(":time", $data->time);
        $stmt->bindParam(":max_capacity", $data->max_capacity, PDO::PARAM_INT);
        $stmt->bindParam(":is_for_children", $data->is_for_children, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Event created successfully."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to create event."));
        }
    } catch (Exception $e) {
        error_log("Error creating event: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Internal server error."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid input. Please provide all required fields."));
}