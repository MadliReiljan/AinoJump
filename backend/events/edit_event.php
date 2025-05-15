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
if (!isset($headers['Authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$user = validateToken($db, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Autoriseerimine puudub - Vale tooken."]);
    exit();
}

if ($user['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(["message" => "Sissepääs keelatud. Ainult omanikel on õigus sündmusi redigeerida."]);
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
        $color = property_exists($data, 'color') ? $data->color : "#4caf50";

        $checkQuery = "SELECT * FROM event WHERE id = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":id", $data->id, PDO::PARAM_INT);
        $checkStmt->execute();
        $currentEvent = $checkStmt->fetch(PDO::FETCH_ASSOC);

        $query = "UPDATE event
                  SET title = :title,
                      body = :body,
                      time = :time,
                      max_capacity = :max_capacity,
                      is_for_children = :is_for_children,
                      color = :color
                  WHERE id = :id";
                  
        $stmt = $db->prepare($query);
 
        $id = (int)$data->id;
        $title = (string)$data->title;
        $body = (string)$data->body;
        $time = (string)$data->time;
        $max_capacity = (int)$data->max_capacity;
        $is_for_children = $data->is_for_children ? 1 : 0;

        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":title", $title, PDO::PARAM_STR);
        $stmt->bindParam(":body", $body, PDO::PARAM_STR);
        $stmt->bindParam(":time", $time, PDO::PARAM_STR);
        $stmt->bindParam(":max_capacity", $max_capacity, PDO::PARAM_INT);
        $stmt->bindParam(":is_for_children", $is_for_children, PDO::PARAM_INT);
        $stmt->bindParam(":color", $color, PDO::PARAM_STR);

        $stmt->execute();

        $update_all = property_exists($data, 'update_all') ? $data->update_all : false;
        $is_recurring = property_exists($data, 'is_recurring') ? $data->is_recurring : false;
        
        if ($currentEvent['is_recurring'] && $is_recurring && $update_all) {
            $title = $currentEvent['title'];
            $created_at = $currentEvent['created_at'];

            $updateAllQuery = "UPDATE event 
                              SET color = :color
                              WHERE title = :title 
                              AND created_at = :created_at 
                              AND id != :id";
            
            $updateAllStmt = $db->prepare($updateAllQuery);
            $updateAllStmt->bindParam(":color", $color, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":title", $title, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":created_at", $created_at, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":id", $id, PDO::PARAM_INT);
            $updateAllStmt->execute();
        }

        $selectQuery = "SELECT id, title, body, time, max_capacity, is_for_children, is_recurring, color 
                      FROM event 
                      WHERE id = :id";
                      
        $selectStmt = $db->prepare($selectQuery);
        $selectStmt->bindParam(":id", $id, PDO::PARAM_INT);
        $selectStmt->execute();
        $updatedEvent = $selectStmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($updatedEvent);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Serveri viga: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Vale sisend. Palun esitage kõik vajalikud väljad."]);
}