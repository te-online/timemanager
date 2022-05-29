<?php

namespace OCA\TimeManager\Db;

use OCA\TimeManager\Helper\UUID;
use OCP\AppFramework\Db\Entity;
use OCP\IConfig;
use OCP\IUser;
use OCP\IUserManager;

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
	/** @var ShareMapper */
	protected $shareMapper;
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
		ShareMapper $shareMapper,
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
		$this->shareMapper = $shareMapper;
		$this->shareMapper->setCurrentUser($userId);
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
				$client->setChanged(isset($object["changed"]) ? $object["changed"] : null);
				$client->setCreated(isset($object["created"]) ? $object["created"] : null);
				$client->setCity(isset($object["city"]) ? $object["city"] : null);
				$client->setEmail(isset($object["email"]) ? $object["email"] : null);
				$client->setName(isset($object["name"]) ? $object["name"] : null);
				$client->setNote(isset($object["note"]) ? $object["note"] : null);
				$client->setPhone(isset($object["phone"]) ? $object["phone"] : null);
				$client->setPostcode(isset($object["postcode"]) ? $object["postcode"] : null);
				$client->setStreet(isset($object["street"]) ? $object["street"] : null);
				$client->setUuid(isset($object["uuid"]) ? $object["uuid"] : null);
				$client->setWeb(isset($object["web"]) ? $object["web"] : null);
				$client->setCommit(isset($object["commit"]) ? $object["commit"] : null);
				$client->setUserId($this->userId);
				$client->setStatus($deleted);
				$client->setBillableDefault(true);
				if ($includeId) {
					$client->setId(isset($object["id"]) ? $object["id"] : null);
				}
				return $client;
			case "projects":
				$project = new Project();
				$project->setChanged(isset($object["changed"]) ? $object["changed"] : null);
				$project->setCreated(isset($object["created"]) ? $object["created"] : null);
				$project->setName(isset($object["name"]) ? $object["name"] : null);
				$project->setNote(isset($object["note"]) ? $object["note"] : null);
				$project->setColor(isset($object["color"]) ? $object["color"] : null);
				$project->setClientUuid(isset($object["client_uuid"]) ? $object["client_uuid"] : null);
				$project->setUuid(isset($object["uuid"]) ? $object["uuid"] : null);
				$project->setCommit(isset($object["commit"]) ? $object["commit"] : null);
				$project->setUserId($this->userId);
				$project->setStatus($deleted);
				$project->setBillable(true);
				if ($includeId) {
					$project->setId(isset($object["id"]) ? $object["id"] : null);
				}
				return $project;
			case "tasks":
				$task = new Task();
				$task->setChanged(isset($object["changed"]) ? $object["changed"] : null);
				$task->setCreated(isset($object["created"]) ? $object["created"] : null);
				$task->setName(isset($object["name"]) ? $object["name"] : null);
				$task->setProjectUuid(isset($object["project_uuid"]) ? $object["project_uuid"] : null);
				$task->setUuid(isset($object["uuid"]) ? $object["uuid"] : null);
				$task->setCommit(isset($object["commit"]) ? $object["commit"] : null);
				$task->setUserId($this->userId);
				$task->setStatus($deleted);
				$task->setBillable(true);
				if ($includeId) {
					$task->setId(isset($object["id"]) ? $object["id"] : null);
				}
				return $task;
			case "times":
				$time = new Time();
				$time->setChanged(isset($object["changed"]) ? $object["changed"] : null);
				$time->setCreated(isset($object["created"]) ? $object["created"] : null);
				$time->setStart(isset($object["start"]) ? $object["start"] : null);
				$time->setEnd(isset($object["end"]) ? $object["end"] : null);
				$time->setTaskUuid(isset($object["task_uuid"]) ? $object["task_uuid"] : null);
				$time->setUuid(isset($object["uuid"]) ? $object["uuid"] : null);
				$time->setCommit(isset($object["commit"]) ? $object["commit"] : null);
				$time->setNote(isset($object["note"]) ? $object["note"] : null);
				$time->setUserId($this->userId);
				$time->setStatus($deleted);
				if ($includeId) {
					$time->setId(isset($object["id"]) ? $object["id"] : null);
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
	function getTaskListFromFilters(
		string $clients = null,
		string $projects = null,
		string $tasks = null,
		$shared = false
	): array {
		$all_projects = $this->projectMapper->findActiveForCurrentUser("name", $shared);
		$all_tasks = $this->taskMapper->findActiveForCurrentUser("name", $shared);

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

	/**
	 * Returns a time entry if user is allowed to edit the entry
	 * @param string $time_uuid
	 * @return Entity
	 */
	function getTimeEntryByIdForEditing(string $time_uuid): ?\OCP\AppFramework\Db\Entity {
		// Here it's okay to fetch a shared time entry, since sharer is allowed to edit
		$time = $this->timeMapper->getActiveObjectById($time_uuid, true);
		if ($time) {
			$canEdit = $time->getUserId() === $this->userId;

			if (!$canEdit) {
				$task = $this->taskMapper->getActiveObjectById($time->getTaskUuid(), true);
				$project = $this->projectMapper->getActiveObjectById($task->getProjectUuid(), true);
				// Maybe current user is author of the parent client
				$sharees = $this->shareMapper->findShareesForClient($project->getClientUuid());
				$canEdit = isset($sharees) && count($sharees) > 0 && $sharees[0]->getAuthorUserId() === $this->userId;
			}

			if ($canEdit) {
				return $time;
			}
		}

		return null;
	}

	/**
	 * Resolves all display names of authors of time entries
	 * @param array $times The array of time entries
	 * @return array The array of time entries with author display names resolved
	 */
	function resolveAuthorDisplayNamesForTimes(array $times, IUserManager $userManager): array {
		// Resolve author display names for time entries
		$userDisplayNames = [];
		return array_map(function ($time) use ($userDisplayNames, $userManager) {
			$userId = $time->getUserId();
			// Only add display name for other users
			$time->current_user_is_author = $userId === $this->userId;

			if (isset($userDisplayNames[$time->getUserId()])) {
				$time->author_display_name = $userDisplayNames[$userId];
			} else {
				$user = $userManager->get($userId);
				if ($user instanceof IUser) {
					$display_name = $user->getDisplayName();
					$userDisplayNames[$userId] = $display_name;
					$time->author_display_name = $display_name;
				}
			}

			return $time;
		}, $times);
	}

	/**
	 * Gets a list of recent time entries
	 * @param array $times
	 * @param int $max
	 * @param array $userFilter
	 * @return array
	 */
	function getLatestTimeEntriesFromAllTimeEntries(array $times, int $max = 5, array $userFilter = []): array {
		$entries = [];
		if ($times && is_array($times) && count($times) > 0) {
			if ($userFilter && is_array($userFilter) && count($userFilter) > 0) {
				$times = array_filter($times, function ($time) use ($userFilter) {
					return in_array($time->getUserId(), $userFilter);
				});
			}
			$latest = array_slice($times, 0, min([count($times), $max]));
			foreach ($latest as $time) {
				// Find details for parents of time entry
				$task = $this->taskMapper->getActiveObjectById($time->getTaskUuid(), true);
				if (!$task) {
					continue;
				}
				$project = $this->projectMapper->getActiveObjectById($task->getProjectUuid(), true);
				if (!$project) {
					continue;
				}
				$client = $this->clientMapper->getActiveObjectById($project->getClientUuid(), true);
				if (!$client) {
					continue;
				}
				// Compile a template object
				$entries[] = (object) [
					"time" => $time,
					"task" => $task,
					"project" => $project,
					"client" => $client,
				];
			}
		}

		return $entries;
	}
}
