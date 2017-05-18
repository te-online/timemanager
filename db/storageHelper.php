<?php

namespace OCA\TimeManager\Db;

// use OCP\AppFramework\Db\Mapper;
// use OCP\IDBConnection;

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
		if($object->desiredCommit) {
			// if current object commit <= last commit delivered by client
			// get commits after the given commit.
			$commits = $this->commitMapper->getCommitsAfter($object->commit);
			// get current object by UUID.
			$currentObject = $this->findEntityMapper($entity)->getObjectById($object->uuid);

			$desiredCommit = $object->desiredCommit;
			$object->desiredCommit = null;
			// if there are commits and current object's commit is in list.
			if( count( $commits ) > 0 && in_array($commits, $currentObject->commit) ) {
				// cancel
				$error = new Error("Dropped, because commit is behind current state.");
				$error['reason'] = "dropped";
				return $error;
			}
			$object->commit = $desiredCommit;

			return $this->findEntityMapper($entity)->update($object);
		} else {
			return $this->findEntityMapper($entity)->insert($this->convertToEntityObject($object, $entity));
		}
	}

	/**
	 * Returns an entity object from the specified entity by using the specified simple object.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function convertToEntityObject($object, $entity) {
		switch($entity) {
			case 'clients':
				$client = new Client();
				// $client->setChanged() ...
			case 'projects':
				return new Project();
			case 'tasks':
				return new Task();
			case 'times':
				return new Time();
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
	 * Get the latest commit.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function getLatestCommit() {
		return $this->commitMapper->getLatestCommit();
	}
}
