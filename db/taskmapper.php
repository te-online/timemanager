<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 * @method Client insert(Client $entity)
 */
class TaskMapper extends Mapper {
	protected $userId;

	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'timemanager_task');
	}

	function setCurrentUser($userId) {
		$this->userId = $userId;
	}

	function getObjectById($uuid) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `uuid` = ?; LIMIT 1;';
		return $this->findEntities($sql, [$this->userId, $uuid]);
	}

	function getObjectsAfterCommit($commit) {
		return array(
			$this->getCreatedObjectsAfterCommit($commit),
			$this->getUpdatedObjectsAfterCommit($commit),
			$this->getDeletedObjectsAfterCommit($commit)
		);
	}

	function getCreatedObjectsAfterCommit($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? AND `created` = `changed` AND `status` != ?' .
				'ORDER BY `changed`;';
		return $this->findEntities($sql, [$this->userId, $commit, 'deleted']);
	}

	function getUpdatedObjectsAfterCommit($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? AND `created` != `changed` AND `status` != ?' .
				'ORDER BY `changed`;';
		return $this->findEntities($sql, [$this->userId, $commit, 'deleted']);
	}

	function getDeletedObjectsAfterCommit($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? AND `status` = ?' .
				'ORDER BY `changed`;';
		return $this->findEntities($sql, [$this->userId, $commit, 'deleted']);
	}

	/**
	 * Fetch all items that are associated to a user
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function findByUser($userId) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ?;';
		return $this->findEntities($sql, [$userId]);
	}
}
