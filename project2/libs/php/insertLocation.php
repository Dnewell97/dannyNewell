<?php

    // example use from browser
    // http://localhost/companydirectory/libs/php/insertLocation.php?name=New%20Location


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

    if (empty($_REQUEST['name'])) {

        $output['status']['code'] = "500";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "referential integrity compromised";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }

    $query = $conn->prepare('SELECT id FROM location WHERE name=?');

    $query->bind_param("s", $_REQUEST['name']);

    $query->execute();

    $result = $query->get_result();

    if ($result->num_rows > 0) {

        $output['status']['code'] = "1062";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "duplicate entry";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }

    $query = $conn->prepare('INSERT INTO location (name) VALUES(?)');

    $query->bind_param("s", $_REQUEST['name']);

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
