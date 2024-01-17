<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryCode = $_REQUEST['countryCode']; 

$url = "https://newsdata.io/api/1/news?apikey=pub_36521bec52109a0d0069cc770a5c02ed71969&country=$countryCode"; 

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Set User-Agent Header
curl_setopt($ch, CURLOPT_USERAGENT, 'The Gazetter');

$result = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'cURL Error:' . curl_error($ch);
}

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn']
= intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>