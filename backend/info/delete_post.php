<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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
    echo json_encode(["message" => "Sissepääs keelatud. Ainult omanikel on õigus postitusi kustutada."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        $query = "DELETE FROM post WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Postituse kustutamine õnnestus."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Postituse kustutamine nurjus."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Serveri viga tühistamise ajal."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Vale sisend. Postituse ID on vajalik."]);
}
?>