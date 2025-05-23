<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
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
    echo json_encode(["message" => "Sissepääs keelatud. Ainult omanikel on õigus postitusi redigeerida."]);
    exit();
}

$isPut = $_SERVER['REQUEST_METHOD'] === 'PUT' || 
        ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT');

if (!$isPut) {
    http_response_code(405);
    echo json_encode(["message" => "Meetod ei ole lubatud."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;
    
    if (empty($data['id']) || empty($data['title']) || empty($data['body'])) {
        http_response_code(400);
        echo json_encode(["message" => "Vale sisend. Postituse ID, pealkiri ja sisu on vajalikud."]);
        exit();
    }

    try {
        $db->beginTransaction();

        $imagePath = null;
        $removeImage = isset($data['remove_image']) && $data['remove_image'] === '1';

        if ($removeImage) {
            $getImageQuery = "SELECT image_url FROM post WHERE id = :id";
            $imageStmt = $db->prepare($getImageQuery);
            $imageStmt->bindParam(":id", $data['id'], PDO::PARAM_INT);
            $imageStmt->execute();
            $currentImageUrl = $imageStmt->fetchColumn();
            
            if ($currentImageUrl) {
                $fullImagePath = __DIR__ . "/.." . $currentImageUrl;
                if (file_exists($fullImagePath)) {
                    unlink($fullImagePath);
                }
            }
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . "/../uploads/";
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = uniqid() . "_" . basename($_FILES['image']['name']);
            $targetFilePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
                $imagePath = "/uploads/" . $fileName;
            } else {
                throw new Exception("Pildi üleslaadimine nurjus.");
            }
        }

        $query = "UPDATE post SET title = :title, body = :body";

        if ($imagePath) {
            $query .= ", image_url = :image_url";
        } elseif ($removeImage) {
            $query .= ", image_url = NULL";
        }

        $query .= " WHERE id = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":id", $data['id'], PDO::PARAM_INT);
        $stmt->bindParam(":title", $data['title']);
        $stmt->bindParam(":body", $data['body']);

        if ($imagePath) {
            $stmt->bindParam(":image_url", $imagePath);
        }

        if ($stmt->execute()) {
            $query = "SELECT p.id, p.title, p.body, p.time, p.created_at, p.image_url, pr.full_name AS author
                      FROM post p
                      INNER JOIN user u ON p.user_id = u.id
                      INNER JOIN person pr ON u.person_id = pr.id
                      WHERE p.id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $data['id'], PDO::PARAM_INT);
            $stmt->execute();

            $updatedPost = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $db->commit();
            http_response_code(200);
            echo json_encode($updatedPost);
        } else {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(["message" => "Postituse uuendamine nurjus."]);
        }
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["message" => "Serveri viga: " . $e->getMessage()]);
    }
} else {
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
                echo json_encode(["message" => "Postituse uuendamine nurjus."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Serveri viga."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Vale sisend. Postituse ID, pealkiri ja sisu on vajalikud."]);
    }
}
?>