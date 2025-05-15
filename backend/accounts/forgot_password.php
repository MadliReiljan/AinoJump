<?php
ini_set('display_errors', 0); 
error_reporting(E_ALL);

$logFile = __DIR__ . '/password_reset_debug.log';
file_put_contents($logFile, "Script started: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

ob_start();

try {
    file_put_contents($logFile, "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
        http_response_code(200);
        exit;
    }

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Authorization, Accept');

    $configFile = __DIR__ . '/../database.php';
    file_put_contents($logFile, "Config file path: $configFile\n", FILE_APPEND);
    file_put_contents($logFile, "Config file exists: " . (file_exists($configFile) ? 'Yes' : 'No') . "\n", FILE_APPEND);
    
    if (!file_exists($configFile)) {
        throw new Exception('Database configuration file not found');
    }

    require_once $configFile;
    file_put_contents($logFile, "Database class loaded\n", FILE_APPEND);

    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        file_put_contents($logFile, "Database connection failed\n", FILE_APPEND);
        throw new Exception('Database connection failed');
    }
    
    file_put_contents($logFile, "Database connected successfully\n", FILE_APPEND);

    $input = file_get_contents("php://input");
    file_put_contents($logFile, "Raw input: $input\n", FILE_APPEND);
    
    $data = json_decode($input);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents($logFile, "JSON decode error: " . json_last_error_msg() . "\n", FILE_APPEND);
        throw new Exception('Invalid JSON input: ' . json_last_error_msg());
    }

    if (!isset($data->email)) {
        echo json_encode(['success' => false, 'message' => 'Email on kohustuslik']);
        exit;
    }

    $email = $data->email;
    file_put_contents($logFile, "Processing email: $email\n", FILE_APPEND);

    $stmt = $conn->prepare("SELECT id FROM user WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $userId = $user['id'];

        $removeStmt = $conn->prepare("DELETE FROM password_reset_tokens WHERE user_id = :user_id");
        $removeStmt->bindParam(':user_id', $userId);
        $removeStmt->execute();

        $insertStmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, expires) VALUES (:user_id, :token, :expires)");
        $insertStmt->bindParam(':user_id', $userId);
        $insertStmt->bindParam(':token', $token);
        $insertStmt->bindParam(':expires', $expires);
        $insertStmt->execute();

        $frontendUrl = "http://localhost:3000";
        $resetLink = "$frontendUrl/reset_password?token=$token";

        $subject = "Parooli uuendamine - AinoJump";
        $message = "Tere,\n\n";
        $message .= "Olete palunud oma parooli uuendada. Uue parooli määramiseks klõpsake allolevale lingile:\n\n";
        $message .= $resetLink . "\n\n";
        $message .= "See link aegub 24 tunni pärast.\n\n";
        $message .= "Kui te ei palunud parooli uuendada, palun ignoreerige seda e-kirja.\n\n";
        $message .= "Lugupidamisega,\nAinoJump Meeskond";
        
        $headers = "From: noreply@ainojump.com\r\n";
        $headers .= "Reply-To: noreply@ainojump.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        $mailSent = mail($email, $subject, $message, $headers);
        
        if ($mailSent) {
            file_put_contents($logFile, "Reset email sent to: $email\n", FILE_APPEND);
        } else {
            file_put_contents($logFile, "Failed to send reset email to: $email\n", FILE_APPEND);

            file_put_contents($logFile, "Email details:\nTo: $email\nSubject: $subject\nContent: $message\n", FILE_APPEND);

            if (isset($_SERVER['SERVER_NAME']) && ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1')) {
                file_put_contents($logFile, "Reset link for development: $resetLink\n", FILE_APPEND);
            }
        }
        
        file_put_contents($logFile, "Reset token generated for user $userId: $token\n", FILE_APPEND);
    }

    echo json_encode(['success' => true, 'message' => 'If your email is in our system, you will receive a reset link.']);
    
} catch (Exception $e) {
    file_put_contents($logFile, "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    file_put_contents($logFile, "Stack trace: " . $e->getTraceAsString() . "\n", FILE_APPEND);

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred processing your request']);
}

ob_end_flush();
file_put_contents($logFile, "Script ended: " . date('Y-m-d H:i:s') . "\n\n", FILE_APPEND);
?>