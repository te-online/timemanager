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
class ClientMapper extends Mapper {
	protected $userId;

	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'timemanager_client');
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
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? ORDER BY `changed`;';
		return $this->findEntities($sql, [$this->userId, $commit]);
	}

	function createFromObject($object) {
		// TODO
		// Turn an object to an instance of the entity.
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
