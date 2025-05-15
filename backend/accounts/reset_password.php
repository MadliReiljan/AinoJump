<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');

$logFile = __DIR__ . '/password_reset_debug.log';
file_put_contents($logFile, "Reset script started: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ob_start();

try {

    $configFile = __DIR__ . '/../database.php';
    file_put_contents($logFile, "Config file path: $configFile\n", FILE_APPEND);
    
    if (!file_exists($configFile)) {
        throw new Exception('Andmebaasi ühendus nurjus');
    }
    
    require_once $configFile;
    file_put_contents($logFile, "Database class loaded\n", FILE_APPEND);

    $database = new Database();
    $conn = $database->getConnection();

    $input = file_get_contents("php://input");
    file_put_contents($logFile, "Raw input: $input\n", FILE_APPEND);
    
    $data = json_decode($input);
    
    if (!isset($data->token) || !isset($data->password)) {
        echo json_encode(['success' => false, 'message' => 'Tooken ja parool on vajalikud']);
        exit;
    }

    $token = $data->token;
    $password = $data->password;
    file_put_contents($logFile, "Processing token: $token\n", FILE_APPEND);

    $validSince = date('Y-m-d H:i:s', strtotime('-24 hours'));
    $stmt = $conn->prepare("SELECT user_id FROM password_reset_tokens WHERE token = :token AND expires >= :valid_since");
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':valid_since', $validSince);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        file_put_contents($logFile, "Invalid or expired token\n", FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Vale või aegunud link']);
        exit;
    }

    $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);
    $userId = $tokenData['user_id'];
    file_put_contents($logFile, "Valid token for user ID: $userId\n", FILE_APPEND);

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $updateStmt = $conn->prepare("UPDATE user SET password_hash = :password WHERE id = :user_id");
    $updateStmt->bindParam(':password', $hashedPassword);
    $updateStmt->bindParam(':user_id', $userId);
    $success = $updateStmt->execute();

    if (!$success) {
        file_put_contents($logFile, "Failed to update password\n", FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Parooli uuendamine ebaõnnestus']);
        exit;
    }

    $deleteStmt = $conn->prepare("DELETE FROM password_reset_tokens WHERE token = :token");
    $deleteStmt->bindParam(':token', $token);
    $deleteStmt->execute();
    file_put_contents($logFile, "Password updated and token deleted\n", FILE_APPEND);

    echo json_encode(['success' => true, 'message' => 'Parooli uuendamine õnnestus']);

} catch (Exception $e) {

    file_put_contents($logFile, "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    file_put_contents($logFile, "Stack trace: " . $e->getTraceAsString() . "\n", FILE_APPEND);

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Serveri viga']);
}

ob_end_flush();
file_put_contents($logFile, "Script ended: " . date('Y-m-d H:i:s') . "\n\n", FILE_APPEND);
?>