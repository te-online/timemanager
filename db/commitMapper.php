<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class CommitMapper
 *
 * @package OCA\TimeManager\Db
 * @method Commit insert(Commit $entity)
 */
class CommitMapper extends Mapper {
	protected $userId;

	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'timemanager_commit');
	}

	function setCurrentUser($userId) {
		$this->userId = $userId;
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

	function getLatestCommit() {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ?; LIMIT 1;';
		return $this->findEntities($sql, [$this->userId]);
	}

	function getCommitsAfter($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? ORDER BY `created`;';
		return $this->findEntities($sql, [$this->userId, $commit]);
	}
}
