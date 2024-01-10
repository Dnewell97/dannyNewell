<?php
if (!isset($_POST['lat']) || !isset($_POST['lon'])) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['error' => 'Latitude and longitude are required parameters.']);
    exit;
}

$lat = $_POST['lat'];
$lng = $_POST['lon'];
$username = 'dnewell97';

$url = "http://api.geonames.org/findNearByWeatherJSON?lat=" . $lat . "&lng=" . $lng . "&username=" . $username;

$executionStartTime = microtime(true);

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

if ($result === false) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$decode = json_decode($result, true);

$output = [
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms'
    ],
    'data' => $decode['weatherObservation'] ?? null
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>
