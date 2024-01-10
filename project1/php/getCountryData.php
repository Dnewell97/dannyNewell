<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://world-geo-data.p.rapidapi.com/countries/" . $_REQUEST['country'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: world-geo-data.p.rapidapi.com",
		"X-RapidAPI-Key: 7a75433a41msh42e7810b3e4150dp1de573jsn8cb6c6adcc65"
	],
]);

$response = curl_exec($curl);
$statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

$err = curl_error($curl);

curl_close($curl);

if ($statusCode != 200){
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = null;
} else {
	$decode = json_decode($response, true);
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>