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
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized - Invalid token."]);
    exit();
}

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

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->title) &&
    !empty($data->body) &&
    !empty($data->time) &&
    isset($data->max_capacity) &&
    isset($data->is_for_children) &&
    isset($data->is_recurring) 
) {
    try {
        $db->beginTransaction(); 

        $query = "INSERT INTO event (title, body, time, max_capacity, is_for_children, is_recurring, created_at)
                  VALUES (:title, :body, :time, :max_capacity, :is_for_children, :is_recurring, NOW())";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":body", $data->body);
        $stmt->bindParam(":time", $data->time);
        $stmt->bindParam(":max_capacity", $data->max_capacity, PDO::PARAM_INT);
        $stmt->bindParam(":is_for_children", $data->is_for_children, PDO::PARAM_BOOL);
        $stmt->bindParam(":is_recurring", $data->is_recurring, PDO::PARAM_BOOL);

        if (!$stmt->execute()) {
            throw new Exception("Failed to create the initial event.");
        }

        if ($data->is_recurring) {
            $currentDate = new DateTime($data->time);
            $endDate = (new DateTime($data->time))->modify('+3 months');

            while ($currentDate < $endDate) {
                $currentDate->modify('+1 week');

                $query = "INSERT INTO event (title, body, time, max_capacity, is_for_children, is_recurring, created_at)
                          VALUES (:title, :body, :time, :max_capacity, :is_for_children, :is_recurring, NOW())";
                $stmt = $db->prepare($query);

                $stmt->bindParam(":title", $data->title);
                $stmt->bindParam(":body", $data->body);
                $stmt->bindParam(":time", $currentDate->format('Y-m-d H:i:s'));
                $stmt->bindParam(":max_capacity", $data->max_capacity, PDO::PARAM_INT);
                $stmt->bindParam(":is_for_children", $data->is_for_children, PDO::PARAM_BOOL);
                $stmt->bindParam(":is_recurring", $data->is_recurring, PDO::PARAM_BOOL);

                if (!$stmt->execute()) {
                    throw new Exception("Failed to create a recurring event.");
                }
            }
        }

        $db->commit(); 
        http_response_code(201);
        echo json_encode(array("message" => "Event created successfully."));
    } catch (Exception $e) {
        $db->rollBack(); 
        error_log("Error creating event: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Internal server error."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid input. Please provide all required fields."));
}