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

        $is_recurring = property_exists($data, 'is_recurring') ? ($data->is_recurring ? 1 : 0) : $currentEvent['is_recurring'];

        $query = "UPDATE event
                  SET title = :title,
                      body = :body,
                      time = :time,
                      max_capacity = :max_capacity,
                      is_for_children = :is_for_children,
                      color = :color,
                      is_recurring = :is_recurring
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
        $stmt->bindParam(":is_recurring", $is_recurring, PDO::PARAM_INT);

        $stmt->execute();

        $update_all = property_exists($data, 'update_all') ? $data->update_all : false;
        $was_recurring = $currentEvent['is_recurring'];
        $is_recurring_flag = property_exists($data, 'is_recurring') ? $data->is_recurring : false;
        
        if (!$was_recurring && $is_recurring_flag) {
            $currentDate = new DateTime($time);
            $endDate = (new DateTime($time))->modify('+3 months');
            while ($currentDate < $endDate) {
                $currentDate->modify('+1 week');
                if ($currentDate->format('Y-m-d H:i:s') === $time) continue;
                $query = "INSERT INTO event (title, body, time, max_capacity, is_for_children, is_recurring, color, created_at) VALUES (:title, :body, :time, :max_capacity, :is_for_children, :is_recurring, :color, NOW())";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":title", $title, PDO::PARAM_STR);
                $stmt->bindParam(":body", $body, PDO::PARAM_STR);
                $stmt->bindParam(":time", $currentDate->format('Y-m-d H:i:s'), PDO::PARAM_STR);
                $stmt->bindParam(":max_capacity", $max_capacity, PDO::PARAM_INT);
                $stmt->bindParam(":is_for_children", $is_for_children, PDO::PARAM_INT);
                $stmt->bindParam(":is_recurring", $is_recurring, PDO::PARAM_INT);
                $stmt->bindParam(":color", $color, PDO::PARAM_STR);
                $stmt->execute();
            }
        }

        $is_recurring = property_exists($data, 'is_recurring') ? $data->is_recurring : false;
        
        if ($currentEvent['is_recurring'] && $is_recurring && $update_all) {
            $series_title = $currentEvent['title'];
            $series_created_at = $currentEvent['created_at'];

            $updateAllQuery = "UPDATE event 
                              SET title = :new_title,
                                  body = :new_body,
                                  max_capacity = :new_max_capacity,
                                  is_for_children = :new_is_for_children,
                                  color = :new_color
                              WHERE title = :series_title 
                              AND created_at = :series_created_at 
                              AND id != :id";
            
            $updateAllStmt = $db->prepare($updateAllQuery);
            $updateAllStmt->bindParam(":new_title", $title, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":new_body", $body, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":new_max_capacity", $max_capacity, PDO::PARAM_INT);
            $updateAllStmt->bindParam(":new_is_for_children", $is_for_children, PDO::PARAM_INT);
            $updateAllStmt->bindParam(":new_color", $color, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":series_title", $series_title, PDO::PARAM_STR);
            $updateAllStmt->bindParam(":series_created_at", $series_created_at, PDO::PARAM_STR);
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