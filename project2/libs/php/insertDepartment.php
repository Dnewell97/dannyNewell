<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>


	$executionStartTime = microtime(true);

	
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
		// check if any inputs are empty
		if(empty($_REQUEST['name']) || empty($_REQUEST['locationID'])){
			$output['status']['code'] = "500";
			$output['status']['name'] = "failure";
			$output['status']['description'] = "referential integrity compromised";
			$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
			$output['data'] = [];
	
			mysqli_close($conn);
	
			echo json_encode($output);
	
			exit;
		}
	
		// check if values already exist in the database
		$query = $conn->prepare('SELECT * FROM department WHERE name=? AND locationID=?');
		$query->bind_param("si", $_REQUEST['name'], $_REQUEST['locationID']);
		$query->execute();
		$result = $query->get_result();
	
		if($result->num_rows > 0){
			$output['status']['code'] = "1062";
			$output['status']['name'] = "failure";
			$output['status']['description'] = "duplicate entries";
			$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
			$output['data'] = [];
	
			mysqli_close($conn);
	
			echo json_encode($output);
	
			exit;
		}

	$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)');

	$query->bind_param("si", $_REQUEST['name'], $_REQUEST['locationID']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>