<?php

namespace OCA\TimeManager\Db;

use OCA\TimeManager\Helper\UUID;

/**
 * Class StorageHelper
 *
 * @package OCA\TimeManager\Db
 */
class StorageHelper {

	protected $clientMapper;
	protected $projectMapper;
	protected $taskMapper;
	protected $timeMapper;
	protected $commitMapper;
	/** @var string user ID */
	protected $userId;

	public function __construct(ClientMapper $clientMapper,
			ProjectMapper $projectMapper,
			TaskMapper $taskMapper,
			TimeMapper $timeMapper,
			CommitMapper $commitMapper,
			$userId
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
		$this->userId = $userId;
	}

	/**
	 * Adds or updates an entity object
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function addOrUpdateObject($object, $entity) {
		// if(objectTypes.indexOf(objectType) < 0) {
	  // 		return Promise.reject(Error("Object Type not supported: " + objectType));
	  // 	}
		// if object is not new, but wants to update.
		if(isset($object['desiredCommit'])) {
			// if current object commit <= last commit delivered by client
			// get commits after the given commit.
			$commits = $this->commitMapper->getCommitsAfter($object['commit']);
			// get current object by UUID.
			$currentObject = $this->findEntityMapper($entity)->getObjectById($object['uuid']);

			$desiredCommit = $object['desiredCommit'];
			$object['desiredCommit'] = null;
			// if there are commits and current object's commit is in list.
			if( count( $commits ) > 0 && in_array($commits, $currentObject['commit']) ) {
				// cancel
				$error = new Error("Dropped, because commit is behind current state.");
				$error['reason'] = "dropped";
				return $error;
			}
			$object['commit'] = $desiredCommit;

			$logger = \OC::$server->getLogger();
			$logger->error("Update object: " . json_encode($object), ['app' => 'timemanager']);

			return $this->findEntityMapper($entity)->update($this->convertToEntityObject($object, $entity, '', true));
		} else {
			$object = $this->prepareObjectForInsert($object);
			return $this->findEntityMapper($entity)->insert($this->convertToEntityObject($object, $entity, ''));
		}
	}

	/**
	 * Returns an entity object from the specified entity by using the specified simple object.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function convertToEntityObject($object, $entity, $deleted, $includeId = false) {
		switch($entity) {
			case 'clients':
				$client = new Client();
				$client->setChanged($object['changed']);
				$client->setCreated($object['created']);
				$client->setCity($object['city']);
				$client->setEmail($object['email']);
				$client->setName($object['name']);
				$client->setNote($object['note']);
				$client->setPhone($object['phone']);
				$client->setPostcode($object['postcode']);
				$client->setStreet($object['street']);
				$client->setUuid($object['uuid']);
				$client->setWeb($object['web']);
				$client->setCommit($object['commit']);
				$client->setUserId($this->userId);
				$client->setStatus($deleted);
				$client->setBillableDefault(true);
				if($includeId) {
					$client->setId($object['id']);
				}
				return $client;
			case 'projects':
				$project = new Project();
				$project->setChanged($object['changed']);
				$project->setCreated($object['created']);
				$project->setName($object['name']);
				$project->setNote($object['note']);
				$project->setColor($object['color']);
				$project->setClientUuid($object['client_uuid']);
				$project->setUuid($object['uuid']);
				$project->setCommit($object['commit']);
				$project->setUserId($this->userId);
				$project->setStatus($deleted);
				// $project->setBillable($object['billable']);
				$project->setBillable(true);
				if($includeId) {
					$project->setId($object['id']);
				}
				return $project;
			case 'tasks':
				$task = new Task();
				$task->setChanged($object['changed']);
				$task->setCreated($object['created']);
				$task->setName($object['name']);
				$task->setProjectUuid($object['project_uuid']);
				$task->setUuid($object['uuid']);
				$task->setCommit($object['commit']);
				$task->setUserId($this->userId);
				$task->setStatus($deleted);
				// $task->setBillable($object['billable']);
				$task->setBillable(true);
				if($includeId) {
					$task->setId($object['id']);
				}
				return $task;
			case 'times':
				$time = new Time();
				$time->setChanged($object['changed']);
				$time->setCreated($object['created']);
				$time->setStart($object['start']);
				$time->setEnd($object['end']);
				$time->setTaskUuid($object['task_uuid']);
				$time->setUuid($object['uuid']);
				$time->setCommit($object['commit']);
				$time->setNote($object['note']);
				$time->setUserId($this->userId);
				$time->setStatus($deleted);
				// $time->setPaymentStatus($object['payment_status']);
				if($includeId) {
					$time->setId($object['id']);
				}
				return $time;
		}
	}

	/**
	 * Returns the correct mapper for the given entity.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function findEntityMapper($entity) {
		switch($entity) {
			case 'clients':
				return $this->clientMapper;
			case 'projects':
				return $this->projectMapper;
			case 'tasks':
				return $this->taskMapper;
			case 'times':
				return $this->timeMapper;
		}
	}

	/**
	 * Get objects after commit.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function getObjectsAfterCommit($entity, $commit) {
		// $logger = \OC::$server->getLogger();
		// $logger->error($entity, ['app' => 'timemanager']);
		return $this->findEntityMapper($entity)->getObjectsAfterCommit($commit);
	}

	/**
	 * Find out if an object needs deletion
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function maybeDeleteObject($object, $entity) {
		// TODO implement as in Storage.js:233
		// if object is not new, but wants to update.
		if(!empty($object['desiredCommit'])) {
			// if current object commit <= last commit delivered by client

			// get commits after the given commit.
			$commits_after = $this->commitMapper->getCommitsAfter($object['commit']);
			// get current object by UUID.
			$current_object = $this->findEntityMapper($entity)->getObjectById($object['uuid']);

			// if there are commits and current object's commit is in list.
			if($current_object == null || (count($commits_after) > 0 && in_array($current_object->getCommit(), $commits_after))) {
				// cancel
				$logger = \OC::$server->getLogger();
				$logger->error("Dropped deletion of object " . $object['uuid'] . ", because commit is behind current state.", ['app' => 'timemanager']);
				return false;
			}

			// Delete object
			$current_object->setChanged(date('Y-m-d H:i:s'));
			$current_object->setCommit($object['desiredCommit']);
			$current_object->setStatus('deleted');
			$this->findEntityMapper($entity)->update($current_object);

			// Delete children
			$this->findEntityMapper($entity)->deleteChildrenForEntityById($current_object->getUuid(), $object['desiredCommit']);
		}
	}

	/**
	 * Get the latest commit.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function getLatestCommit() {
		return $this->commitMapper->getLatestCommit();
	}

	/**
	 * Insert a new commit.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function insertCommit($commit) {
		$insertCommit = new Commit();
		$insertCommit->setCommit($commit);
		$insertCommit->setCreated(date('Y-m-d H:i:s')); // date('Y-m-d H:i:s') // time()
		$insertCommit->setUserId($this->userId);
		return $this->commitMapper->insert($insertCommit);
	}

	/**
	 * Prepares and object for inserting, prepping it with uuid and stuff.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function prepareObjectForInsert($object) {
		$object['uuid'] = (empty($object['uuid'])) ? UUID::v4() : $object['uuid'];
		$today = date('Y-m-d H:i:s');
		$object['created'] = (empty($object['created'])) ? $today : $object['created'];
		$object['changed'] = (empty($object['changed'])) ? $today : $object['changed'];
		return $object;
	}
}
