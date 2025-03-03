<?php

namespace OCA\TimeManager\Controller;

use OCA\TimeManager\Db\Client;
use OCA\TimeManager\Db\ClientMapper;
use OCA\TimeManager\Db\ProjectMapper;
use OCA\TimeManager\Db\TaskMapper;
use OCA\TimeManager\Db\TimeMapper;
use OCA\TimeManager\Db\CommitMapper;
use OCA\TimeManager\Db\ShareMapper;
use OCA\TimeManager\Db\StorageHelper;
use OCA\TimeManager\Helper\UUID;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http;
use OCP\IRequest;
use OCP\IConfig;
use Psr\Log\LoggerInterface;

class TApiController extends ApiController {
	/** @var ClientMapper mapper for client entity */
	protected $clientMapper;
	/** @var ProjectMapper mapper for project entity */
	protected $projectMapper;
	/** @var TaskMapper mapper for task entity */
	protected $taskMapper;
	/** @var TimeMapper mapper for time entity */
	protected $timeMapper;
	/** @var CommitMapper mapper for client entity */
	protected $commitMapper;
	/** @var ShareMapper mapper for client entity */
	protected $shareMapper;
	/** @var StorageHelper helper for working on the stored data */
	protected $storageHelper;
	/** @var string user ID */
	protected $userId;
	/** @var IConfig */
	private $config;
	/** @var LoggerInterface logger */
	private $logger;

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
		$userId,
		IRequest $request,
		ClientMapper $clientMapper,
		ProjectMapper $projectMapper,
		TaskMapper $taskMapper,
		TimeMapper $timeMapper,
		CommitMapper $commitMapper,
		ShareMapper $shareMapper,
		IConfig $config,
		LoggerInterface $logger
	) {
		parent::__construct($appName, $request);
		$this->clientMapper = $clientMapper;
		$this->projectMapper = $projectMapper;
		$this->taskMapper = $taskMapper;
		$this->timeMapper = $timeMapper;
		$this->commitMapper = $commitMapper;
		$this->shareMapper = $shareMapper;
		$this->config = $config;
		$this->userId = $userId;
		$this->logger = $logger;
		$this->storageHelper = new StorageHelper(
			$this->clientMapper,
			$this->projectMapper,
			$this->taskMapper,
			$this->timeMapper,
			$this->commitMapper,
			$this->shareMapper,
			$this->config,
			$this->logger,
			$userId
		);
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
	 *
	 * @param json $data
	 * @return DataResponse
	 */
	function updateObjectsFromWeb($data, $lastCommit) {
		return $this->updateObjects($data, $lastCommit);
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
		$this->logger->debug("New API request:", ["app" => "timemanager"]);
		$this->logger->debug(json_encode($data), ["app" => "timemanager"]);
		$this->logger->info("API Request with commit: " . $lastCommit, ["app" => "timemanager"]);
		$entities = ["clients", "projects", "tasks", "times"];

		if (!$data && !$lastCommit) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}
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
		$commit = UUID::v4();

		if (!$noData) {
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

		$response = ["data" => []];

		$index = 0;
		foreach ($entities as $entity) {
			$response["data"][$entity] = $results[$index];
			$index++;
		}

		if (!$noData) {
			$response["commit"] = $commit;
			$this->storageHelper->insertCommit($commit);
			$this->logger->info("Sending response [omitted] and commit " . $commit, ["app" => "timemanager"]);
		} else {
			$lastCommit = $this->storageHelper->getLatestCommit();
			$response["commit"] = $lastCommit;
			$this->logger->info("Sending response [omitted] and commit " . $lastCommit, ["app" => "timemanager"]);
		}

		$this->logger->debug("Sending response... " . json_encode($response), ["app" => "timemanager"]);

		return new JSONResponse($response);
	}

	/**
	 * @NoAdminRequired
	 */
	function getHoursInPeriodStats(
		$start,
		$end,
		string $group_by = "none",
		string $clients = null,
		string $projects = null,
		string $tasks = null,
		string $status = null,
		$shared = false,
		string $userFilter = "",
		string $timezone = "UTC"
	) {
		// Get possible task ids to filters for
		$filter_tasks = $this->storageHelper->getTaskListFromFilters($clients, $projects, $tasks, $shared);

		$includedAuthors = $userFilter && strlen($userFilter) > 0 ? explode(",", $userFilter) : [];

		// Get all time entries for time period
		$times = $this->timeMapper->findForReport($start, $end, $status, $filter_tasks, $shared, $timezone);
		$times = array_filter($times, function ($time) use ($includedAuthors) {
			// Find details for parents of time entry. If it doesn't exist, we should filter out time entry
			$task = $this->taskMapper->getActiveObjectById($time->getTaskUuid(), true);

			if (!$task) {
				return false;
			}

			// Filter for author
			if ($includedAuthors && is_array($includedAuthors) && !in_array($time->getUserId(), $includedAuthors)) {
				return false;
			}

			return true;
		});
		$sum = 0;

		// Calculate sum
		$grouped = [];
		$js_date_format = "";

		foreach ($times as $time) {
			$duration = $time->getDurationInHours();

			// Group by date
			if ($group_by === "day") {
				$day = $time->getStartFormatted("Y-m-d", $timezone);
				if (!isset($grouped[$day])) {
					$grouped[$day] = 0;
				}
				$grouped[$day] += $duration;
			} elseif ($group_by === "week") {
				$week = $time->getStartFormatted("Y-W", $timezone);
				if (!isset($grouped[$week])) {
					$grouped[$week] = 0;
				}
				$grouped[$week] += $duration;
			} elseif ($group_by === "month") {
				$month = $time->getStartFormatted("Y-m", $timezone);
				if (!isset($grouped[$month])) {
					$grouped[$month] = 0;
				}
				$grouped[$month] += $duration;
			} elseif ($group_by === "year") {
				$year = $time->getStartFormatted("Y", $timezone);
				if (!isset($grouped[$year])) {
					$grouped[$year] = 0;
				}
				$grouped[$year] += $duration;
			}
			// Legacy: No grouping
			$sum += $duration;
		}

		// Send JS date format for object.keys along with grouping
		if ($group_by === "day") {
			$js_date_format = "yyyy-MM-dd";
		} elseif ($group_by === "week") {
			$js_date_format = "yyyy-II";
		} elseif ($group_by === "month") {
			$js_date_format = "yyyy-MM";
		} elseif ($group_by === "year") {
			$js_date_format = "yyyy";
		}

		return new DataResponse(["total" => $sum, "grouped" => $grouped, "js_date_format" => $js_date_format]);
	}
}
