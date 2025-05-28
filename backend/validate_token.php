<?php
function validateToken($db, $token) {
    if (empty($token)) {
        return false;
    }

    $query = "SELECT u.id AS user_id, t.person_id, p.full_name, u.email, u.role, t.created_at, t.expires_at
              FROM tokens t
              INNER JOIN person p ON t.person_id = p.id
              INNER JOIN user u ON p.id = u.person_id
              WHERE t.token = :token
              ORDER BY t.created_at DESC
              LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (isset($user['expires_at'])) {
            if (strtotime($user['expires_at']) < time()) {
                return false;
            }
        } else {
            $tokenAge = time() - strtotime($user['created_at']);
            $tokenExpiry = 3600; 
            if ($tokenAge > $tokenExpiry) {
                return false;
            }
        }
    }

    return $user ?: false;
}