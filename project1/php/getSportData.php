<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = "";

if (isset($_REQUEST['selectCountryName']) && !empty($_REQUEST['selectCountryName'])) {
    $countryName = $_REQUEST['selectCountryName'];
    $url = "https://www.thesportsdb.com/api/v1/json/60130162/searchteams.php?t=" . urlencode($countryName);
} else {
    echo json_encode(['error' => 'No country name provided']);
    exit;
}


$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch); 

    curl_close($ch);

    $decode = json_decode($result,true);    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 

?>