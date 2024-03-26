<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for connection error
if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];
    echo json_encode($output);
    mysqli_close($conn);
    exit;
}

// Department ID from request
$deptId = $_REQUEST['id'];

// SQL statement for deletion
$query = $conn->prepare('DELETE FROM department WHERE id = ?');
$query->bind_param("i", $deptId);
$success = $query->execute();

// Check if the query was successful
if (!$success) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed: " . $query->error;
    $output['data'] = [];
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = [];
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
echo json_encode($output);
mysqli_close($conn);
?>
