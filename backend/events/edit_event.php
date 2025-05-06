<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
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
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized - Invalid token."]);
    exit();
}

if ($user['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(["message" => "Access denied. Only owners can edit events."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->body) &&
    !empty($data->time) &&
    isset($data->max_capacity) &&
    isset($data->is_for_children)
) {
    try {
        $query = "UPDATE event
                  SET title = :title,
                      body = :body,
                      time = :time,
                      max_capacity = :max_capacity,
                      is_for_children = :is_for_children
                  WHERE id = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":id", $data->id, PDO::PARAM_INT);
        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":body", $data->body);
        $stmt->bindParam(":time", $data->time);
        $stmt->bindParam(":max_capacity", $data->max_capacity, PDO::PARAM_INT);
        $stmt->bindParam(":is_for_children", $data->is_for_children, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $query = "SELECT * FROM event WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $data->id, PDO::PARAM_INT);
            $stmt->execute();
            $updatedEvent = $stmt->fetch(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode($updatedEvent);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update event."]);
        }
    } catch (Exception $e) {
        error_log("Error updating event: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Internal server error."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input. Please provide all required fields."]);
}