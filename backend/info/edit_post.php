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
    echo json_encode(["message" => "Unauthorized - Invalid token."]);
    exit();
}

if ($user['role'] !== 'owner') {
    http_response_code(403);
    echo json_encode(["message" => "Access denied. Only owners can edit posts."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->title) && !empty($data->body)) {
    try {
        $query = "UPDATE post
                  SET title = :title, body = :body";

        if (!empty($data->image_url)) {
            $query .= ", image_url = :image_url";
        }

        $query .= " WHERE id = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":id", $data->id, PDO::PARAM_INT);
        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":body", $data->body);

        if (!empty($data->image_url)) {
            $stmt->bindParam(":image_url", $data->image_url);
        }

        if ($stmt->execute()) {
            $query = "SELECT p.id, p.title, p.body, p.time, p.created_at, p.image_url, pr.full_name AS author
                      FROM post p
                      INNER JOIN user u ON p.user_id = u.id
                      INNER JOIN person pr ON u.person_id = pr.id
                      WHERE p.id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $data->id, PDO::PARAM_INT);
            $stmt->execute();

            $updatedPost = $stmt->fetch(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode($updatedPost);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update post."]);
        }
    } catch (Exception $e) {
        error_log("Error updating post: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Internal server error."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input. Post ID, title, and body are required."]);
}
?>