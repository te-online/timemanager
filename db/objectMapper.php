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
class ObjectMapper extends Mapper {
	protected $userId;
	protected $commitMapper;

	public function __construct(IDBConnection $db, CommitMapper $commitMapper, $dbname) {
		$this->commitMapper = $commitMapper;
		parent::__construct($db, $dbname);
	}

	function setCurrentUser($userId) {
		$this->userId = $userId;
		$this->commitMapper->setCurrentUser($this->userId);
	}

	function getObjectById($uuid) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `uuid` = ?; LIMIT 1;';
		return $this->findEntities($sql, [$this->userId, $uuid]);
	}

	function getObjectsAfterCommit($commit) {
		return array(
			"created" => $this->getCreatedObjectsAfterCommit($commit),
			"updated" => $this->getUpdatedObjectsAfterCommit($commit),
			"deleted" => $this->getDeletedObjectsAfterCommit($commit)
		);
	}

	function getCreatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? '.
				'AND `commit` IN ( "' . implode('","', $applicable_commits) . '" ) ' .
				'AND `created` = `changed` AND `status` != ? ' .
				'ORDER BY `changed`;';
		$clients = array_map(
			function($client) {
				return $client->toArray();
			},
			$this->findEntities($sql, [$this->userId, 'deleted'])
		);
		return $clients;
	}

	function getUpdatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? ' .
				'AND `commit` IN ( "' . implode('","', $applicable_commits) . '" ) ' .
				'AND `created` != `changed` AND `status` != ? ' .
				'ORDER BY `changed`;';
		$clients = array_map(
			function($client) {
				return $client->toArray();
			},
			$this->findEntities($sql, [$this->userId, 'deleted'])
		);
		return $clients;
	}

	function getDeletedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? ' .
				'AND `commit` IN ( "' . implode('","', $applicable_commits) . '" ) ' .
				'AND `status` = ? ' .
				'ORDER BY `changed`;';
		$clients = array_map(
			function($client) {
				return $client->toArray();
			},
			$this->findEntities($sql, [$this->userId, 'deleted'])
		);
		return $clients;
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
