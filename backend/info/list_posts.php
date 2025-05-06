<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT p.id, p.title, p.body, p.time, p.created_at, pr.full_name AS author
              FROM post p
              INNER JOIN user u ON p.user_id = u.id
              INNER JOIN person pr ON u.person_id = pr.id
              ORDER BY p.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($posts);
} catch (Exception $e) {
    error_log("Error fetching posts: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Internal server error."]);
}
?>