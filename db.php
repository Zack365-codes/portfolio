<?php
/**
 * db.php - Secure PDO Database Connection Script
 * ZackCodes Portfolio
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get or initialize PDO database connection
 * 
 * @return PDO|null Returns PDO instance or null on failure
 */
function getDbConnection() {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Use native prepared statements
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET . " COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log detailed error privately to server log, never reveal raw credentials to visitors
        error_log("[Portfolio DB Error] " . $e->getMessage());
        return null;
    }
}

// Global handle for direct usage
$pdo = getDbConnection();
?>
