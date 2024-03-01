<?php
    // http://localhost/companydirectory/libs/php/deleteLocationByID.php?id=<id>


    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $locationId = $_REQUEST['id'];

    // Check for dependencies
    $checkQuery = $conn->prepare('SELECT COUNT(*) as count FROM department WHERE locationID = ?');
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
    }

    $query = $conn->prepare('DELETE FROM location WHERE id = ?');
    $query->bind_param("i", $locationId);
    $query->execute();
    
    if (false === $query) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";    
        $output['data'] = [];

        mysqli_close($conn);
        echo json_encode($output); 
        exit;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    
    mysqli_close($conn);
    echo json_encode($output); 
?>
