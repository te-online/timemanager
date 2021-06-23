<?php

namespace OCA\TimeManager\Controller;

use OCA\TimeManager\Db\Client;
use OCA\TimeManager\Db\ClientMapper;
use OCA\TimeManager\Db\ProjectMapper;
use OCA\TimeManager\Db\TaskMapper;
use OCA\TimeManager\Db\TimeMapper;
use OCA\TimeManager\Db\CommitMapper;
use OCA\TimeManager\Db\storageHelper;
use OCA\TimeManager\Helper\Cleaner;
use OCA\TimeManager\Helper\UUID;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http;
use OCP\IRequest;

class TApiController extends ApiController {
	/** @var ClientMapper mapper for client entity */
	protected $clientMapper;
	/** @var ProjectMapper mapper for project entity */
	protected $projectMapper;
	/** @var TaskMapper mapper for task entity */
	protected $taskMapper;
	/** @var TimeMapper mapper for time entity */
	protected $timeMapper;
	/** @var ClientMapper mapper for client entity */
	protected $commitMapper;
	/** @var StorageHelper helper for working on the stored data */
	protected $storageHelper;
	/** @var string user ID */
	protected $userId;
	protected $cleaner;

	/**
	 * constructor of the controller
	 * @param string $appName the name of the app
	 * @param IRequest $request an instance of the request
	 * @param ClientMapper $clientMapper mapper for client entity
	 * @param ProjectMapper $projectMapper mapper for project entity
	 * @param TaskMapper $taskMapper mapper for task entity
	 * @param TimeMapper $timeMapper mapper for time entity
	 * @param CommitMapper $commitMapper mapper for commit entity
	 * @param string $userId user id
	 */
	function __construct(
		$appName,
		IRequest $request,
		ClientMapper $clientMapper,
		ProjectMapper $projectMapper,
		TaskMapper $taskMapper,
		TimeMapper $timeMapper,
		CommitMapper $commitMapper,
		$userId
	) {
		parent::__construct($appName, $request);
		$this->clientMapper = $clientMapper;
		$this->projectMapper = $projectMapper;
		$this->taskMapper = $taskMapper;
		$this->timeMapper = $timeMapper;
		$this->commitMapper = $commitMapper;
		$this->userId = $userId;
		$this->storageHelper = new StorageHelper(
			$this->clientMapper,
			$this->projectMapper,
			$this->taskMapper,
			$this->timeMapper,
			$this->commitMapper,
			$userId
		);
		$this->cleaner = new Cleaner();
	}

	/**
	 * Convert Item objects to their array representation. Item[] to array[]
	 *
	 * @param Item[] $items items that should be converted
	 * @return array[] items mapped to their array representation
	 */
	private function itemsToArray(array $clients) {
		$clients = array_map(function (Client $client) {
			return $client->toArray();
		}, $clients);
		return $clients;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $name the name of the item
	 * @param string $note the note of the item
	 * @return DataResponse
	 */
	function post($name, $note) {
		$client = new Client();
		$client->setName($name);
		$client->setNote($note);
		$client->setUserId($this->userId);

		$client = $this->clientMapper->insert($client);
		return new DataResponse($client->toArray());
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @CORS
	 *
	 * @param json $data
	 * @return DataResponse
	 */
	function updateObjects($data, $lastCommit) {
		$logger = \OC::$server->getLogger();
		// $logger->error("New API request:", ['app' => 'timemanager']);
		// $logger->error(json_encode($data), ['app' => 'timemanager']);
		$logger->info("API Request with commit: " . $lastCommit, ["app" => "timemanager"]);
		// return new JSONResponse(array('test' => "Hallo Welt"));
		$entities = ["clients", "projects", "tasks", "times"];

		if (!$data && !$lastCommit) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}
		// if(empty($lastCommit)) {
		// 	return new DataResponse(json_encode(["error" => "Commit is mandatory."]), Http::STATUS_NOT_ACCEPTABLE);
		// }
		if (empty($data)) {
			return new DataResponse(json_encode(["error" => "Data is mandatory."]), Http::STATUS_NOT_ACCEPTABLE);
		}

		$noData = true;

		foreach ($entities as $entity) {
			if (
				$data[$entity] == null ||
				!is_array($data[$entity]["created"]) ||
				!is_array($data[$entity]["updated"]) ||
				!is_array($data[$entity]["deleted"])
			) {
				return new DataResponse(
					$data[$entity]["created"] .
						"Error, " .
						$entity .
						" with created, updated and deleted subarrays is mandatory.",
					Http::STATUS_NOT_ACCEPTABLE
				);
			}
			if (
				count($data[$entity]["created"]) > 0 ||
				count($data[$entity]["updated"]) > 0 ||
				count($data[$entity]["deleted"]) > 0
			) {
				$noData = false;
			}
		}

		$clientCommit = $lastCommit;
		$missions = [];

		if (!$noData) {
			$commit = UUID::v4();
			// $commit = "afafwafafawfaw";
			// $commit = UUID.v4(); // TODO

			foreach ($entities as $entity) {
				// For all entities take the created objects
				$created = $data[$entity]["created"];
				// try to create object, if object already present -> move it to the changed array
				foreach ($created as $object) {
					// mark with current commit
					$object["commit"] = $commit;
					// Add or update object here.
					$this->storageHelper->addOrUpdateObject($object, $entity);
				}
				// For all entities take the changed objects
				$updated = $data[$entity]["updated"];
				// if current object commit <= last commit delivered by client
				foreach ($updated as $object) {
					// mark with current commit
					$object["commit"] = $clientCommit;
					$object["desiredCommit"] = $commit;
					// Add or update object here.
					$this->storageHelper->addOrUpdateObject($object, $entity);
				}
				// For all entities take the deleted objects
				$deleted = $data[$entity]["deleted"];
				// if current object commit <= last commit delivered by client
				foreach ($deleted as $object) {
					// mark with current commit
					$object["commit"] = $clientCommit;
					$object["desiredCommit"] = $commit;
					// Add or update object here.
					$this->storageHelper->maybeDeleteObject($object, $entity);
				}
			}
		}

		$results = [];

		foreach ($entities as $entity) {
			$results[] = $this->storageHelper->getObjectsAfterCommit($entity, $clientCommit);
		}

		$lastCommit = $this->storageHelper->getLatestCommit();
		$response = ["data" => []];

		$index = 0;
		foreach ($entities as $entity) {
			$response["data"][$entity] = $results[$index];
			$index++;
		}

		if (!$noData) {
			$response["commit"] = $commit;
			$this->storageHelper->insertCommit($commit);
		} else {
			$response["commit"] = $lastCommit;
		}

		// $logger->error("Sending response... " . json_encode($response), ['app' => 'timemanager']);
		$logger->info("Sending response [omitted] and commit " . $lastCommit, ["app" => "timemanager"]);

		return new JSONResponse($response);
		// $response->addHeader('Test-Header', 'te-online');
		// $response->addHeader('Content-Type', 'application/json');

		// .catch(function(err) {
		// 	console.error(err.stack);
		// 	res.status(500).send(JSON.stringify([{ "error": err.error }], null, 2));
		// });
	}

	/**
	 * @NoAdminRequired
	 */
	function getHoursInPeriodStats($start, $end, string $group_by = "none") {
		// Get all time entries for time period
		$times = $this->timeMapper->getActiveObjectsByDateRange($start, $end);
		$sum = 0;

		// Calculate sum
		$grouped = [];
		foreach ($times as $time) {
			// Group by date
			if ($group_by === "day") {
				$day = $time->getStartFormatted("Y-m-D");
				if (!isset($grouped[$day])) {
					$grouped[$day] = 0;
				}
				$grouped[$day] += $time->getDurationInHours();
			} elseif ($group_by === "week") {
				$week = $time->getStartFormatted("Y-W");
				if (!isset($grouped[$week])) {
					$grouped[$week] = 0;
				}
				$grouped[$week] += $time->getDurationInHours();
			} elseif ($group_by === "month") {
				$month = $time->getStartFormatted("Y-m");
				if (!isset($grouped[$month])) {
					$grouped[$month] = 0;
				}
				$grouped[$month] += $time->getDurationInHours();
			} else {
				// Legacy: No grouping
				$sum += $time->getDurationInHours();
			}
		}

		return new DataResponse(["total" => $group_by === "none" ? $sum : $grouped]);
	}
}
