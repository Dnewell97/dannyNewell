<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    $departmentId = $_POST['id'];

    // Query to get department name and personnel count
        // Check for dependencies
        $deptId = $_REQUEST['id'];
$checkQuery = $conn->prepare('SELECT d.name, COUNT(p.id) as count FROM department d LEFT JOIN personnel p ON d.id = p.departmentID WHERE d.id = ? GROUP BY d.id');
$checkQuery->bind_param("i", $deptId);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();
$row = $checkResult->fetch_assoc();

if ($row && $row['count'] > 0) {
    $output['status']['code'] = "409";
    $output['status']['name'] = "conflict";
    $output['status']['description'] = "Cannot delete department as it has assigned personnel";
    $output['data'] = ['departmentName' => $row['name'], 'personnelCount' => $row['count']];
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Department can be deleted";
    $output['data'] = ['departmentName' => $row['name'], 'personnelCount' => 0];
}

echo json_encode($output);



    $conn->close();
?>