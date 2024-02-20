<?php

// example use from browser
// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

// remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// this includes the login details
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Check if any of the inputs are empty
if (empty($_POST['firstName']) || empty($_POST['lastName'])  || empty($_POST['email']) || empty($_POST['departmentID'])) {

    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Referential integrity compromised: one or more input values are empty";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Check if the values already exist in the database
$query_check = $conn->prepare('SELECT * FROM personnel WHERE firstName = ? AND lastName = ? AND jobTitle = ? AND email = ? AND departmentID = ?');
$query_check->bind_param("ssssi", $_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $_POST['departmentID']);
$query_check->execute();

if ($query_check->fetch()) {

    $output['status']['code'] = "1062";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Duplicate entries: values already exist in the database";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// If all checks pass, execute the insert query
$query_insert = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?,?,?,?,?)');
$query_insert->bind_param("ssssi", $_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $_POST['departmentID']);
$query_insert->execute();

if (false === $query_insert) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Return success message
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);

echo json_encode($output);

?>
