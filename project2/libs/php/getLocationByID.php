<?php
    // Example use from browser:
    // http://localhost/companydirectory/libs/php/getLocationByID.php?id=<id>


    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output = [
            'status' => [
                'code' => "300",
                'name' => "failure",
                'description' => "database unavailable",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $query = $conn->prepare('SELECT id, name FROM location WHERE id = ?');
    $query->bind_param("i", $_REQUEST['id']);
    $query->execute();

    if (false === $query) {
        $output = [
            'status' => [
                'code' => "400",
                'name' => "executed",
                'description' => "query failed",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];

        echo json_encode($output);
        mysqli_close($conn);
        exit;
    }

    $result = $query->get_result();
    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {
        array_push($data, $row);
    }

    $output = [
        'status' => [
            'code' => "200",
            'name' => "ok",
            'description' => "success",
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => $data
    ];

    echo json_encode($output);
    mysqli_close($conn);
?>
