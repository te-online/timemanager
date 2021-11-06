<?php

namespace OCA\TimeManager\Db;

use OCA\TimeManager\Helper\UUID;
use OCP\IConfig;

/**
 * Class StorageHelper
 *
 * @package OCA\TimeManager\Db
 */
class StorageHelper {
	/** @var ClientMapper */
	protected $clientMapper;
	/** @var ProjectMapper */
	protected $projectMapper;
	/** @var TaskMapper */
	protected $taskMapper;
	/** @var TimeMapper */
	protected $timeMapper;
	/** @var CommitMapper */
	protected $commitMapper;
	/** @var string user ID */
	protected $userId;
	/** @var IConfig */
	private $config;

	public function __construct(
		ClientMapper $clientMapper,
		ProjectMapper $projectMapper,
		TaskMapper $taskMapper,
		TimeMapper $timeMapper,
		CommitMapper $commitMapper,
		IConfig $config,
		string $userId
	) {
		$this->clientMapper = $clientMapper;
		$this->clientMapper->setCurrentUser($userId);
		$this->projectMapper = $projectMapper;
		$this->projectMapper->setCurrentUser($userId);
		$this->taskMapper = $taskMapper;
		$this->taskMapper->setCurrentUser($userId);
		$this->timeMapper = $timeMapper;
		$this->timeMapper->setCurrentUser($userId);
		$this->commitMapper = $commitMapper;
		$this->commitMapper->setCurrentUser($userId);
		$this->config = $config;
		$this->userId = $userId;
	}

	/**
	 * Adds or updates an entity object
	 *
	 * @param array an input object as named array
	 * @param string the entity to use
	 * @return Client|Project|Task|Time the updated object
	 */
	function addOrUpdateObject(array $object, string $entity): \OCP\AppFramework\Db\Entity {
		// if object is not new, but wants to update.
		if (isset($object["desiredCommit"])) {
			// if current object commit <= last commit delivered by client
			// get commits after the given commit.
			$commits = $this->commitMapper->getCommitsAfter($object["commit"]);
			// get current object by UUID.
			$currentObject = $this->findEntityMapper($entity)->getObjectById($object["uuid"]);

			$desiredCommit = $object["desiredCommit"];
			$object["desiredCommit"] = null;

			$sync_mode = (string) $this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling");
			// if there are commits and current object's commit is in list.
			if (
				$sync_mode === "handle_conflicts" &&
				count($commits) > 0 &&
				in_array((string) $currentObject->getCommit(), $commits)
			) {
				// cancel
				$error = new \Error("Dropped, because commit is behind current state.");
				$error["reason"] = "dropped";
				return $error;
			}
			$object["commit"] = $desiredCommit;
			$object["id"] = $currentObject->getId();

			return $this->findEntityMapper($entity)->update($this->convertToEntityObject($object, $entity, "", true));
		} else {
			$object = $this->prepareObjectForInsert($object);
			return $this->findEntityMapper($entity)->insert($this->convertToEntityObject($object, $entity, ""));
		}
	}

	/**
	 * Returns an entity object from the specified entity by using the specified simple object.
	 *
	 * @param array $object a plain named array as input object
	 * @param string $entity the name of the entity to use
	 * @param bool $deleted the new status of the object
	 * @param bool $includeId set this to true if the input object includes an id that should be represented in the resulting object
	 * @return Client|Project|Task|Time the entity object
	 */
	function convertToEntityObject(
		array $object,
		string $entity,
		bool $deleted,
		bool $includeId = false
	): \OCP\AppFramework\Db\Entity {
		switch ($entity) {
			case "clients":
				$client = new Client();
				$client->setChanged($object["changed"]);
				$client->setCreated($object["created"]);
				$client->setCity($object["city"]);
				$client->setEmail($object["email"]);
				$client->setName($object["name"]);
				$client->setNote($object["note"]);
				$client->setPhone($object["phone"]);
				$client->setPostcode($object["postcode"]);
				$client->setStreet($object["street"]);
				$client->setUuid($object["uuid"]);
				$client->setWeb($object["web"]);
				$client->setCommit($object["commit"]);
				$client->setUserId($this->userId);
				$client->setStatus($deleted);
				$client->setBillableDefault(true);
				if ($includeId) {
					$client->setId($object["id"]);
				}
				return $client;
			case "projects":
				$project = new Project();
				$project->setChanged($object["changed"]);
				$project->setCreated($object["created"]);
				$project->setName($object["name"]);
				$project->setNote($object["note"]);
				$project->setColor($object["color"]);
				$project->setClientUuid($object["client_uuid"]);
				$project->setUuid($object["uuid"]);
				$project->setCommit($object["commit"]);
				$project->setUserId($this->userId);
				$project->setStatus($deleted);
				// $project->setBillable($object['billable']);
				$project->setBillable(true);
				if ($includeId) {
					$project->setId($object["id"]);
				}
				return $project;
			case "tasks":
				$task = new Task();
				$task->setChanged($object["changed"]);
				$task->setCreated($object["created"]);
				$task->setName($object["name"]);
				$task->setProjectUuid($object["project_uuid"]);
				$task->setUuid($object["uuid"]);
				$task->setCommit($object["commit"]);
				$task->setUserId($this->userId);
				$task->setStatus($deleted);
				// $task->setBillable($object['billable']);
				$task->setBillable(true);
				if ($includeId) {
					$task->setId($object["id"]);
				}
				return $task;
			case "times":
				$time = new Time();
				$time->setChanged($object["changed"]);
				$time->setCreated($object["created"]);
				$time->setStart($object["start"]);
				$time->setEnd($object["end"]);
				$time->setTaskUuid($object["task_uuid"]);
				$time->setUuid($object["uuid"]);
				$time->setCommit($object["commit"]);
				$time->setNote($object["note"]);
				$time->setUserId($this->userId);
				$time->setStatus($deleted);
				// $time->setPaymentStatus((isset($object['payment_status'])) ? $object['payment_status'] : '');
				if ($includeId) {
					$time->setId($object["id"]);
				}
				return $time;
		}
	}

	/**
	 * Returns the correct mapper for the given entity.
	 *
	 * @param string $entity the entity to look for
	 * @return ClientMapper|ProjectMapper|TaskMapper|TimeMapper matching mapper
	 */
	function findEntityMapper(string $entity): \OCP\AppFramework\Db\Mapper {
		switch ($entity) {
			case "clients":
				return $this->clientMapper;
			case "projects":
				return $this->projectMapper;
			case "tasks":
				return $this->taskMapper;
			case "times":
				return $this->timeMapper;
		}
	}

	/**
	 * Get objects after commit.
	 *
	 * @param string $entity the entity to look for
	 * @param string $commit the commit
	 * @return array list of matching items
	 */
	function getObjectsAfterCommit(string $entity, string $commit): array {
		$logger = \OC::$server->getLogger();
		$logger->debug($entity, ["app" => "timemanager"]);
		return $this->findEntityMapper($entity)->getObjectsAfterCommit($commit);
	}

	/**
	 * Find out if an object needs deletion
	 *
	 * @param array $object an object to delete
	 * @param string $entity the entity the object belongs to
	 * @return void
	 */
	function maybeDeleteObject(array $object, string $entity): void {
		// TODO implement as in Storage.js:233
		// if object is not new, but wants to update.
		if (!empty($object["desiredCommit"])) {
			// if current object commit <= last commit delivered by client

			// get commits after the given commit.
			$commits_after = $this->commitMapper->getCommitsAfter($object["commit"]);
			// get current object by UUID.
			$current_object = $this->findEntityMapper($entity)->getObjectById($object["uuid"]);

			$sync_mode = (string) $this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling");
			// if there are commits and current object's commit is in list.
			if (
				($current_object == null ||
					(count($commits_after) > 0 && in_array($current_object->getCommit(), $commits_after))) &&
				$sync_mode === "handle_conflicts"
			) {
				// cancel
				$logger = \OC::$server->getLogger();
				$logger->error("Dropped deletion of object " . $object["uuid"] . ", because commit is behind current state.", [
					"app" => "timemanager",
				]);
				return;
			}

			// Delete object
			$current_object->setChanged(date("Y-m-d H:i:s"));
			$current_object->setCommit($object["desiredCommit"]);
			$current_object->setStatus("deleted");
			$this->findEntityMapper($entity)->update($current_object);

			// Delete children
			$this->findEntityMapper($entity)->deleteChildrenForEntityById(
				$current_object->getUuid(),
				$object["desiredCommit"]
			);
		}
	}

	/**
	 * Get the latest commit.
	 *
	 * @return string commit
	 */
	function getLatestCommit(): string {
		return $this->commitMapper->getLatestCommit();
	}

	/**
	 * Insert a new commit.
	 *
	 * @param string $commit the commit
	 * @return Commit The inserted commit object
	 */
	function insertCommit(string $commit): Commit {
		$insertCommit = new Commit();
		$insertCommit->setCommit($commit);
		$insertCommit->setCreated(date("Y-m-d H:i:s")); // date('Y-m-d H:i:s') // time()
		$insertCommit->setUserId($this->userId);
		return $this->commitMapper->insert($insertCommit);
	}

	/**
	 * Prepares and object for inserting, prepping it with uuid and stuff.
	 *
	 * @param array $object An object to prepare
	 * @return array The prepared object
	 */
	function prepareObjectForInsert(array $object): array {
		$object["uuid"] = empty($object["uuid"]) ? UUID::v4() : $object["uuid"];
		$today = date("Y-m-d H:i:s");
		$object["created"] = empty($object["created"]) ? $today : $object["created"];
		$object["changed"] = empty($object["changed"]) ? $today : $object["changed"];
		return $object;
	}

	/**
	 * Takes comma-separated lists of client, project and task uuids and returns
	 * a reduced list of task uuids to filter time entries for.
	 * This can be used for reports or statistics
	 * @param string|null $clients A comma-separated list of client uuids
	 * @param string|null $projects A comma-separated list of project uuids
	 * @param string|null $tasks A comma-separated list of task uuids
	 * @return array A comma-separated list of task uuids
	 */
	function getTaskListFromFilters(string $clients = null, string $projects = null, string $tasks = null): array {
		$all_projects = $this->projectMapper->findActiveForCurrentUser("name");
		$all_tasks = $this->taskMapper->findActiveForCurrentUser("name");

		// Get task uuids related to filters.
		// Filters are exclusive from finer to coarse.
		// That is, finer filters override more coarse filters.
		// Example: If a task filter is set, project and client filters will be ignored
		$filter_tasks = [];
		if (isset($tasks) && strlen($tasks) > 0) {
			foreach (explode(",", $tasks) as $task_uuid) {
				$filter_tasks[] = $task_uuid;
			}
		} elseif (isset($projects) && strlen($projects) > 0) {
			foreach (explode(",", $projects) as $project_uuid) {
				// Find tasks related to project
				foreach ($all_tasks as $task) {
					if ($task->getProjectUuid() === $project_uuid) {
						$filter_tasks[] = $task->getUuid();
					}
				}
			}
		} elseif (isset($clients) && strlen($clients) > 0) {
			foreach (explode(",", $clients) as $client_uuid) {
				// Find tasks related to project
				foreach ($all_projects as $project) {
					if ($project->getClientUuid() === $client_uuid) {
						// Find tasks related to project
						foreach ($all_tasks as $task) {
							if ($task->getProjectUuid() === $project->getUuid()) {
								$filter_tasks[] = $task->getUuid();
							}
						}
					}
				}
			}
		}
		$filter_tasks = array_unique($filter_tasks);

		return $filter_tasks;
	}
}
