<?php

$executionStartTime = microtime(true);

// Load GeoJSON data
$filePath = "../json/countryBorders.geo.json";
$countryBorders = json_decode(file_get_contents($filePath), true);

$geometry = null;
if (isset($_REQUEST['countryCode'])) {
    foreach ($countryBorders['features'] as $country) {
        if ($country['properties']['iso_a2'] === $_REQUEST['countryCode']) {
            $geometry = $country['geometry'];
            break;
        }
    }
}

$output = ['status' => ['code' => '200', 'name' => 'ok', 'description' => 'success']];
if ($geometry) {
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = [
        "type" => "FeatureCollection",
        "features" => [
            ["type" => "Feature", "geometry" => $geometry]
        ]
    ];
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "No matching country found";
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>
