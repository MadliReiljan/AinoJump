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

$raw_data = file_get_contents("php://input");
$data = json_decode($raw_data);

if (
    isset($data->fullname) && 
    isset($data->email) && 
    isset($data->password) &&
    !empty($data->fullname) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    try {
        $check_query = "SELECT id FROM user WHERE email = ?";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->execute([$data->email]);
        
        if ($check_stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Email juba eksisteerib."));
            exit();
        }

        $person_query = "INSERT INTO person (full_name) VALUES (:fullname)";
        $person_stmt = $db->prepare($person_query);
        $person_stmt->bindParam(":fullname", $data->fullname);
        $person_stmt->execute();

        $person_id = $db->lastInsertId();

        $user_query = "INSERT INTO user (email, password_hash, role, person_id) 
                       VALUES (:email, :password, 'customer', :person_id)";
        $user_stmt = $db->prepare($user_query);

        $password_hash = password_hash($data->password, PASSWORD_DEFAULT);

        $user_stmt->bindParam(":email", $data->email);
        $user_stmt->bindParam(":password", $password_hash);
        $user_stmt->bindParam(":person_id", $person_id);

        if (!$user_stmt->execute()) {
            http_response_code(500);
            echo json_encode(array("message" => "Andmebaasi viga."));
            exit();
        }

        http_response_code(201);
        echo json_encode(array("message" => "Kasutaja registreerimine õnnestus."));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Serveri viga."));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Registreerimine ebaõnnestus. Andmed on puudulikud.",
        "received" => $data
    ));
}