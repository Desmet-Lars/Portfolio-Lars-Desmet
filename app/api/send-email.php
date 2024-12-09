<?php
// Prevent PHP errors from being displayed in the response
error_reporting(0);
ini_set('display_errors', 0);

// Ensure we're sending JSON response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed', 405);
    }

    // Get POST data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data', 400);
    }

    if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
        throw new Exception('Missing required fields', 400);
    }

    $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($data['message'], FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address', 400);
    }

    // Email details
    $to = 'desmetlars5@gmail.com';
    $subject = "Portfolio Contact from $name";
    $headers = [
        'From' => $email,
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8'
    ];

    $emailBody = "Name: $name\n";
    $emailBody .= "Email: $email\n\n";
    $emailBody .= "Message:\n$message";

    // Send email
    $success = mail($to, $subject, $emailBody, $headers);

    if (!$success) {
        throw new Exception('Failed to send email', 500);
    }

    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);

} catch (Exception $e) {
    $code = $e->getCode() ?: 500;
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'code' => $code
    ]);
}
