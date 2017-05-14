<?php

namespace OCA\TimeManager\Helper;

class Cleaner {

	private $clientsStruct;
	private $projectsStruct;
	private $tasksStruct;
	private $timesStruct;
	private $entities;

	/**
	 * sets the correct interval for this timed job
	 */
	function __construct() {
		$this->clientsStruct = ["changed", "city", "commit", "created", "email", "name", "note", "phone", "postcode", "street", "uuid", "web"];
		$this->projectsStruct = ["changed", "client_uuid", "color", "commit", "created", "name", "note", "uuid"];
		$this->tasksStruct = ["changed", "commit", "created", "name", "project_uuid", "uuid"];
		$this->timesStruct = ["changed", "commit", "created", "end", "note", "start", "task_uuid", "uuid"];

		$this->entities = ["clients", "projects", "tasks", "times"];
	}

	// Cast the database version of the object to the API version of the object.
	function clean($results) {
		// $logger = \OC::$server->getLogger();

		$index = 0;
		foreach($this->entities as $entity) {
			// $logger->error(implode(',', $results), ['app' => 'timemanager']);
			$results[$index] = array_map(function($key, $result) {
				return array_map(function($key, $item) {
						$struct;
						if($entity == "clients") {
							$struct = $clientsStruct;
						}
						if($entity == "projects") {
							$struct = $projectsStruct;
						}
						if($entity == "tasks") {
							$struct = $tasksStruct;
						}
						if($entity == "times") {
							$struct = $timesStruct;
						}

						$newItem = [];

						array_map($struct, function($structItem) {
							$newItem[$structItem] = $item[$structItem];
						});

						return $newItem;
					}, $result);
			}, ((!empty($results[$index])) ? $results[$index] : array()));

			$index++;
		}

		return $results;
	}
}