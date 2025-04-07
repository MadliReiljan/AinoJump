<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$raw_data = file_get_contents("php://input");
error_log("Received data: " . $raw_data);

$data = json_decode($raw_data);

error_log("Parsed data: " . print_r($data, true));

if (
    isset($data->fullname) && 
    isset($data->email) && 
    isset($data->password) &&
    !empty($data->fullname) &&
    !empty($data->email) &&
    !empty($data->password)
) {

    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$data->email]);
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists."));
        exit();
    }

    $query = "INSERT INTO users SET
              fullname = :fullname,
              email = :email,
              password_hash = :password,
              role = 'customer'";

    $stmt = $db->prepare($query);

    $password_hash = password_hash($data->password, PASSWORD_DEFAULT);

    $stmt->bindParam(":fullname", $data->fullname);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", $password_hash);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "User registered successfully."));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to register user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Unable to register user. Data is incomplete.",
        "received" => $data
    ));
}