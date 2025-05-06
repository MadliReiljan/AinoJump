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
    echo json_encode(["message" => "Access denied. Only owners can create posts."]);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->title) && !empty($data->body)) {
        $db->beginTransaction();

        $query = "INSERT INTO post (title, body, time, created_at, user_id)
                  VALUES (:title, :body, NOW(), NOW(), :user_id)";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":body", $data->body);
        $stmt->bindParam(":user_id", $user['user_id'], PDO::PARAM_INT);

        if (!$stmt->execute()) {
            throw new Exception("Failed to create the post.");
        }

        $postId = $db->lastInsertId();

        $query = "SELECT p.id, p.title, p.body, p.time, p.created_at, pr.full_name AS author
                  FROM post p
                  INNER JOIN user u ON p.user_id = u.id
                  INNER JOIN person pr ON u.person_id = pr.id
                  WHERE p.id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $postId, PDO::PARAM_INT);
        $stmt->execute();

        $createdPost = $stmt->fetch(PDO::FETCH_ASSOC);

        $db->commit();
        http_response_code(201);
        echo json_encode($createdPost); 
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid input. Please provide all required fields."]);
    }
} catch (Exception $e) {
    $db->rollBack();
    error_log("Error creating post: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Internal server error."]);
}
?>