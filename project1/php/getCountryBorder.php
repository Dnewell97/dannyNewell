<?php
    ini_set('display_errors' , 'On');
    error_reporting(E_ALL);
    $filePath = "../json/countryBorders.geo.json";
    var_dump(file_exists($filePath));

    $executionStartTime = microtime(true);
	$countryBorders = json_decode(file_get_contents('../json/countryBorders.geo.json', true));
	

    $geometry = null;
$geometry;
foreach($countryBorders->features as $country) {
   if($country->properties->iso_a2 == $_REQUEST['countryCode']){
       $geometry = $country;
   };
}


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $geometry;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);