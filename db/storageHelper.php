<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

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

	public function __construct(ClientMapper $clientMapper,
			ProjectMapper $projectMapper,
			TaskMapper $taskMapper,
			TimeMapper $timeMapper,
			CommitMapper $commitMapper) {
		$this->clientMapper = $clientMapper;
		$this->projectMapper = $projectMapper;
		$this->taskMapper = $taskMapper;
		$this->timeMapper = $timeMapper;
		$this->commitMapper = $commitMapper;
	}

	/**
	 * Adds or updates an entity object
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function addOrUpdateObject($object, $entity) {
		// $sql = 'SELECT * ' .
		// 		'FROM `' . $this->tableName . '` ' .
		// 		'WHERE `user_id` = ?;';
		// return $this->findEntities($sql, [$userId]);
		// if(objectTypes.indexOf(objectType) < 0) {
	  // 		return Promise.reject(Error("Object Type not supported: " + objectType));
	  // 	}
		// if object is not new, but wants to update.
		if($object->desiredCommit) {
			// if current object commit <= last commit delivered by client
			// get commits after the given commit.
			$commits = $this->commitMapper->getCommitsAfter($object->commit);
			// get current object by UUID.
			$currentObject = $this->findEntityMapper($entity)->getObjectById($object->uuid, $objectType);

			$desiredCommit = $object->desiredCommit;
			$object->desiredCommit = null;
			// if there are commits and current object's commit is in list.
			if( count( $commits ) > 0 && in_array($commits, $currentObject->commit)) {
				// cancel
				$error = new Error("Dropped, because commit is behind current state.");
				$error['reason'] = "dropped";
				return $error;
			}
			$object->commit = $desiredCommit;
		}

		return $this->findEntityMapper($entity)->update($object);
	}

	/**
	 * Returns the correct mapper for the given entity.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function findEntityMapper($entity) {

	}
}
