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

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(401);
    echo json_encode(array("message" => "Invalid credentials."));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        $query = "SELECT u.id, u.email, u.password_hash, u.role, p.full_name 
                  FROM user u 
                  INNER JOIN person p ON u.person_id = p.id 
                  WHERE u.email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$data->email]);
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($data->password, $row['password_hash'])) {
                $token = $row['id']; 

                http_response_code(200);
                echo json_encode(array(
                    "id" => $row['id'],
                    "fullname" => $row['full_name'],
                    "email" => $row['email'],
                    "role" => $row['role'],
                    "token" => $token 
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Invalid credentials."));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid credentials."));
        }
    } catch (Exception $e) {
        error_log("Error during login: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Internal server error."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}