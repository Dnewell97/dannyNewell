<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    $locationId = $_POST['id'];

    // Query to get department name and personnel count
        // Check for dependencies
    // Check for dependencies
    $checkQuery = $conn->prepare('SELECT COUNT(id) as count FROM department WHERE locationID = ?');
    $checkQuery->bind_param("i", $locationId);
    $checkQuery->execute();
    $checkResult = $checkQuery->get_result();
    $row = $checkResult->fetch_assoc();

    if ($row['count'] > 0) {
        $output['status']['code'] = "409";
        $output['status']['name'] = "conflict";
        $output['status']['description'] = "Cannot delete location as it has assigned departments";
        $output['data'] = [];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    } else {
        // No dependencies, can delete
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Location can be deleted";
        $output['data'] = [];
    }

echo json_encode($output);



    $conn->close();
?>