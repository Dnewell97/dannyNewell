<?php
$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code' => "300",
            'name' => "failure",
            'description' => "database unavailable",
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    mysqli_close($conn);
    exit;
}

$departmentFilter = isset($_GET['department']) && $_GET['department'] !== 'all' ? $_GET['department'] : null;
$locationFilter = isset($_GET['location']) && $_GET['location'] !== 'all' ? $_GET['location'] : null;
$lastChanged = isset($_GET['lastChanged']) ? $_GET['lastChanged'] : null;

$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID)';

$params = [];
$types = '';
$whereClauses = [];

if ($lastChanged == 'department' && $departmentFilter) {
    $whereClauses[] = 'd.id = ?';
    $params[] = &$departmentFilter;
    $types .= 's';
} elseif ($lastChanged == 'location' && $locationFilter) {
    $whereClauses[] = 'l.id = ?';
    $params[] = &$locationFilter;
    $types .= 's';
}

if (!empty($whereClauses)) {
    $query .= ' WHERE ' . implode(' AND ', $whereClauses);
}
$query .= ' ORDER BY p.lastName, p.firstName';

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        'status' => [
            'code' => "400",
            'name' => "failed",
            'description' => "Failed to prepare the query: " . mysqli_error($conn),
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    mysqli_close($conn);
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

if (!$stmt->execute()) {
    echo json_encode([
        'status' => [
            'code' => "400",
            'name' => "failed",
            'description' => "Failed to execute the query: " . mysqli_error($conn),
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    mysqli_close($conn);
    exit;
}

$result = $stmt->get_result();

$found = [];
while ($row = mysqli_fetch_assoc($result)) {
    $found[] = $row;
}

echo json_encode([
    'status' => [
        'code' => "200",
        'name' => "ok",
        'description' => "success",
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ],
    'data' => ['found' => $found]
]);

mysqli_close($conn);
?>
