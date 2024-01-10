<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $json = file_get_contents('../json/countryBorders.geo.json');
    $countryBorders = json_decode($json);

    $countries = [];
    foreach ($countryBorders->features as $country) {
        $countryData = (object)[
            'name' => $country->properties->name,
            'code' => $country->properties->iso_a2,
            'geometry' => $country->geometry
        ];
        array_push($countries, $countryData);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $countries;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>


