<?php

if(isset($_GET['from']) && isset($_GET['to']) && isset($_GET['amount'])) {
    $fromCurrency = $_GET['from'];
    $toCurrency = $_GET['to'];
    $amount = $_GET['amount'];

    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://currency-converter18.p.rapidapi.com/api/v1/convert?from=".$fromCurrency."&to=".$toCurrency."&amount=".$amount,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "X-RapidAPI-Host: currency-converter18.p.rapidapi.com",
            "X-RapidAPI-Key: 1401cc59famsh392358666a35ac1p12f289jsn4e81726e7814" 
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
} else {
    echo "Missing parameters";
}
?>
