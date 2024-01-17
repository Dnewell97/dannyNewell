<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $json = file_get_contents('../json/countryBorders.geo.json');

    if ($json === false) {
        // Error handling if the file is not found or cannot be read
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Error reading JSON file";
        $output['data'] = [];
    } else {
        $countryBorders = json_decode($json);

        if ($countryBorders === null) {
            // Error handling if the JSON cannot be decoded
            $output['status']['code'] = "400";
            $output['status']['name'] = "error";
            $output['status']['description'] = "Invalid JSON format";
            $output['data'] = [];
        } else {
            $countries            = [];
            foreach ($countryBorders->features as $country) {
                $countryData = (object)[
                    'name' => $country->properties->name,
                    'code' => $country->properties->iso_a2
                ];
                array_push($countries, $countryData);
            }

            // Sort the countries array in alphabetical order based on the name
            usort($countries, function($a, $b) {
                return strcmp($a->name, $b->name);
            });

            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "success";
            $output['data'] = $countries;
        }
    }

    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
?>




