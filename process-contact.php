<?php
/**
 * process-contact.php - Contact Form Handler
 * Handles AJAX & standard POST submissions with PDO prepared statements
 */

// Disable direct output of PHP warnings to prevent breaking JSON/text response
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// 1. Collect & trim inputs
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Optional honeypot field for bot spam prevention
if (!empty($_POST['website_hp'])) {
    // Hidden honeypot triggered by a bot
    echo 'OK';
    exit;
}

// 2. Strict Validations
$errors = [];

if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors[] = 'Please enter a valid name (2 to 100 characters).';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($subject) || mb_strlen($subject) < 3 || mb_strlen($subject) > 200) {
    $errors[] = 'Please enter a subject (3 to 200 characters).';
}

if (empty($message) || mb_strlen($message) < 5 || mb_strlen($message) > 5000) {
    $errors[] = 'Please enter your message (5 to 5,000 characters).';
}

// Return errors if any
if (!empty($errors)) {
    http_response_code(400);
    exit(implode('<br>', $errors));
}

// 3. Sanitize inputs for secure storage & display
$safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail   = filter_var($email, FILTER_SANITIZE_EMAIL);
$safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
$userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN', 0, 255);

// 4. Save into MySQL Database using Prepared Statements
$db = getDbConnection();

if ($db === null) {
    // If DB is offline, log error and return clean fallback message
    error_log("[Portfolio Contact] Database connection failed while saving message from $safeEmail");
    http_response_code(500);
    exit('Database service is temporarily unavailable. Please try again shortly or email directly.');
}

try {
    $sql = "INSERT INTO messages (name, email, subject, message, ip_address, user_agent)
            VALUES (:name, :email, :subject, :message, :ip_address, :user_agent)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':name'       => $safeName,
        ':email'      => $safeEmail,
        ':subject'    => $safeSubject,
        ':message'    => $safeMessage,
        ':ip_address' => $ipAddress,
        ':user_agent' => $userAgent
    ]);

    // BootstrapMade validate.js expects literal string 'OK' on success
    echo 'OK';
    exit;

} catch (PDOException $e) {
    error_log("[Portfolio Contact Error] " . $e->getMessage());
    http_response_code(500);
    exit('Failed to save message due to a server error. Please try again.');
}
?>
