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
	protected $commitMapper;

	public function __construct(IDBConnection $db, CommitMapper $commitMapper) {
		$this->commitMapper = $commitMapper;
		parent::__construct($db, 'timemanager_client');
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
				'WHERE `user_id` = ? AND `commit` IN ( "' . implode('","', $applicable_commits) . '" ) ' .
				'AND `created` = `changed` AND `commit` != ? ' .
				'ORDER BY `changed`;';
		$clients = array_map(
			function($client) {
				return $client->toArray();
			},
			$this->findEntities($sql, [$this->userId, 'deleted'])
		);
		$logger = \OC::$server->getLogger();
		$logger->error("Clients:", ['app' => 'timemanager']);
		$logger->error(json_encode($clients), ['app' => 'timemanager']);
		return $clients;
	}

	function getUpdatedObjectsAfterCommit($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? AND `created` != `changed` AND `commit` != ? ' .
				'ORDER BY `changed`;';
		return $this->findEntities($sql, [$this->userId, $commit, 'deleted']);
	}

	function getDeletedObjectsAfterCommit($commit) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `commit` > ? AND `commit` = ?' .
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
