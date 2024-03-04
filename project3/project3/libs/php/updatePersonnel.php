<?php

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output = [
            'status' => [
                'code' => "300",
                'name' => "failure",
                'description' => "Database unavailable",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $id = $_REQUEST['id'];
    $first_name = $_REQUEST['firstName'];
    $last_name = $_REQUEST['lastName'];
    $job_title = $_REQUEST['jobTitle'];
    $email = $_REQUEST['email'];
    $dept_id = $_REQUEST['departmentID'];

    if (empty($id) || empty($first_name) || empty($last_name) || empty($email) || empty($dept_id)) {
        $output = [
            'status' => [
                'code' => "400",
                'name' => "failure",
                'description' => "Invalid input: Some inputs are empty",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $query_check = $conn->prepare('SELECT * FROM personnel WHERE firstName = ? AND lastName = ? AND jobTitle = ? AND email = ? AND departmentID = ? AND id != ?');
    $query_check->bind_param("ssssii", $first_name, $last_name, $job_title, $email, $dept_id, $id);
    $query_check->execute();
    $result_check = $query_check->get_result();

    if ($result_check->num_rows > 0) {
        $output = [
            'status' => [
                'code' => "1062",
                'name' => "failure",
                'description' => "Duplicate entries in the database",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];

        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $query = $conn->prepare('UPDATE personnel SET firstName=?, lastName=?, jobTitle=?, email=?, departmentID=? WHERE id=?');
    $query->bind_param("ssssii", $first_name, $last_name, $job_title, $email, $dept_id, $id);

    if (!$query->execute()) {
        $output = [
            'status' => [
                'code' => "500",
                'name' => "failure",
                'description' => "Error in executing update query: " . $query->error,
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];
    } else {
        $output = [
            'status' => [
                'code' => $query->affected_rows > 0 ? "200" : "204",
                'name' => "ok",
                'description' => $query->affected_rows > 0 ? "Update successful" : "No rows updated",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ];
    }

    mysqli_close($conn);
    echo json_encode($output);
?>
