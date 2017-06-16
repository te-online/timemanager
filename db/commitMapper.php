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
				'WHERE `user_id` = ? ORDER BY `created` DESC LIMIT 1;';
		$commit = $this->findEntities($sql, [$this->userId]);
		if(count($commit) > 0) {
			return $commit[0]->getCommit();
		} else {
			// TODO Error
		}
	}

	function getCommitsAfter($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `created` >'.
				' (SELECT `created` FROM `' . $this->tableName . '` WHERE `commit` = ? LIMIT 1) '.
				'ORDER BY `created`;';
		$commits = array_map(
			function($commit) {
				return $commit->toString();
			},
			$this->findEntities($sql, [$this->userId, $commit])
		);
		return $commits;
	}
}
