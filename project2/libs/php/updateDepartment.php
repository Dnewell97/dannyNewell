<?php
    // Example use from browser
    // http://localhost/companydirectory/libs/php/updateDepartment.php?name=New%20Department&locationID=<id>&id=<id>

    // Remove next two lines for production
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    
    // Include the login details
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

    $dept_name = $_REQUEST['name']; 
    $location_id = $_REQUEST['locationID'];
    $id = $_REQUEST['id'];

    // Check if department name exists for a different ID
    $checkQuery = $conn->prepare('SELECT id FROM department WHERE name = ? AND id != ?');
    $checkQuery->bind_param("si", $dept_name, $id);
    $checkQuery->execute();
    $result = $checkQuery->get_result();

    if ($result->num_rows > 0) {
        // Department name already exists
        $output['status']['code'] = "409"; // Conflict
        $output['status']['name'] = "conflict";
        $output['status']['description'] = "Department name already exists";
        $output['data'] = [];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    // Proceed with the update
    $query = $conn->prepare('UPDATE department SET name=?, locationID=? WHERE id=?');
    $query->bind_param("sii", $dept_name, $location_id, $id);
    $query->execute();
    
    if (false === $query) {
        // Query failed
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed"; 
        $output['data'] = [];
    } else {
        // Update successful
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "update successful";
        $output['data'] = [];
    }
    
    mysqli_close($conn);
    echo json_encode($output);
?>
