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
		// Find the given commit first, see if we have it.
		$sql = 'SELECT `commit` ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND LOWER(`commit`) = ? LIMIT 1;';
		$givenCommit = $this->findEntities($sql, [$this->userId, $commit]);

		// The given commit is found, all fine.
		if(count($givenCommit) > 0) {
			$sql = 'SELECT * ' .
					'FROM `' . $this->tableName . '` ' .
					'WHERE `user_id` = ? AND `created` >'.
					' (SELECT `created` FROM `' . $this->tableName . '` WHERE LOWER(`commit`) = ? LIMIT 1) '.
					'ORDER BY `created`;';
			$commits = array_map(
				function($commit) {
					return $commit->toString();
				},
				$this->findEntities($sql, [$this->userId, $commit])
			);
		} else {
			// The given commit is unknown. All commits are applicable.
			$sql = 'SELECT * ' .
					'FROM `' . $this->tableName . '` ' .
					'WHERE `user_id` = ? '.
					'ORDER BY `created`;';
			$commits = array_map(
				function($commit) {
					return $commit->toString();
				},
				$this->findEntities($sql, [$this->userId])
			);
		}
		return $commits;
	}
}
