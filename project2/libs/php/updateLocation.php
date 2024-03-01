<?php
    // Example use from browser:
    // http://localhost/companydirectory/libs/php/updateLocation.php?id=<id>&name=<name>

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

    $id = $_POST['id'];
    $name = $_POST['name'];

    if (empty($id) || empty($name)) {
        $output = [
            'status' => [
                'code' => "400",
                'name' => "failure",
                'description' => "invalid input: some inputs are empty",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $query = $conn->prepare('UPDATE location SET name=? WHERE id=?');
    $query->bind_param("si", $name, $id);

    if ($query->execute()) {
        $output = [
            'status' => [
                'code' => "200",
                'name' => "ok",
                'description' => "success",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];
    } else {
        $output = [
            'status' => [
                'code' => "500",
                'name' => "failure",
                'description' => "error executing query",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];
    }

    mysqli_close($conn);
    echo json_encode($output);
?>
