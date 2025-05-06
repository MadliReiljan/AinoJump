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

if ($user['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(array("message" => "Access denied. Only owners can create events."));
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"));

    if (
        !empty($data->title) &&
        !empty($data->body) &&
        !empty($data->time) &&
        isset($data->max_capacity)
    ) {
        $db->beginTransaction();

        $isForChildren = isset($data->is_for_children) ? $data->is_for_children : false;
        $isRecurring = isset($data->is_recurring) ? $data->is_recurring : false;

        $query = "INSERT INTO event (title, body, time, max_capacity, is_for_children, is_recurring, created_at)
                  VALUES (:title, :body, :time, :max_capacity, :is_for_children, :is_recurring, NOW())";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":body", $data->body);
        $stmt->bindParam(":time", $data->time);
        $stmt->bindParam(":max_capacity", $data->max_capacity, PDO::PARAM_INT);
        $stmt->bindParam(":is_for_children", $isForChildren, PDO::PARAM_BOOL);
        $stmt->bindParam(":is_recurring", $isRecurring, PDO::PARAM_BOOL);

        if (!$stmt->execute()) {
            throw new Exception("Failed to create the initial event.");
        }

        if ($isRecurring) {
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
                $stmt->bindParam(":is_for_children", $isForChildren, PDO::PARAM_BOOL);
                $stmt->bindParam(":is_recurring", $isRecurring, PDO::PARAM_BOOL);

                if (!$stmt->execute()) {
                    throw new Exception("Failed to create a recurring event.");
                }
            }
        }

        $db->commit();
        http_response_code(201);
        echo json_encode(array("message" => "Event created successfully."));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid input. Please provide all required fields."));
    }
} catch (Exception $e) {
    $db->rollBack();
    error_log("Error creating event: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Internal server error."));
}