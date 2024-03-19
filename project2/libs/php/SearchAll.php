<?php
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

$activeTab = isset($_GET['activeTab']) ? $_GET['activeTab'] : null;
$likeText = isset($_REQUEST['txt']) ? "%" . $_REQUEST['txt'] . "%" : "";

if ($activeTab === 'employee-tab') {
    $query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.firstName LIKE ? OR p.lastName LIKE ? OR p.email LIKE ? OR p.jobTitle LIKE ? OR d.name LIKE ? OR l.name LIKE ? ORDER BY p.lastName, p.firstName, d.name, l.name';
} elseif ($activeTab === 'department-tab') {
    $query = 'SELECT d.id, d.name as department, l.name as location FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE d.name LIKE ? OR l.name LIKE ? ORDER BY d.name, l.name';
} elseif ($activeTab === 'location-tab') {
    $query = 'SELECT l.id, l.name FROM location l WHERE l.name LIKE ? ORDER BY l.name'; 
} else {
    $query = ''; 
}

$stmt = $conn->prepare($query);

if (false === $stmt) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

if ($activeTab === 'employee-tab') {
    $stmt->bind_param("ssssss", $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);
} elseif ($activeTab === 'department-tab') {
    $stmt->bind_param("ss", $likeText, $likeText);
} elseif ($activeTab === 'location-tab') {
    $stmt->bind_param("s", $likeText);
}

$queryExecutionResult = $stmt->execute();

if (false === $queryExecutionResult) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$result = $stmt->get_result();

$found = [];

while ($row = mysqli_fetch_assoc($result)) {
    array_push($found, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['found'] = $found;

mysqli_close($conn);
echo json_encode($output);
?>
