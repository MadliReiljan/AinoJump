<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $query = "SELECT id, fullname, email, password_hash, role FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$data->email]);
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($data->password, $row['password_hash'])) {
            http_response_code(200);
            echo json_encode(array(
                "id" => $row['id'],
                "fullname" => $row['fullname'],
                "email" => $row['email'],
                "role" => $row['role']
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid credentials."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid credentials."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}