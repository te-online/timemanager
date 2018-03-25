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
	protected $db;
	protected $commitMapper;

	public function __construct(IDBConnection $db, CommitMapper $commitMapper, $dbname) {
		$this->db = $db;
		$this->commitMapper = $commitMapper;
		parent::__construct($db, $dbname);
	}

	function setCurrentUser($userId) {
		$this->userId = $userId;
		$this->commitMapper->setCurrentUser($this->userId);
	}

	function getObjectsByAttributeValue($attr, $value) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `' . $attr . '` = ?; LIMIT 1;';
		return $this->findEntities($sql, [$this->userId, $value]);
	}

	/**
	 * Fetch all items that are associated to the current user
	 * with a given attribute-value-combination and not deleted
	 *
	 * @param string $attr the attribute name
	 * @param string $value the attribute value
	 * @return Object[] list if matching items
	 */
	function getActiveObjectsByAttributeValue($attr, $value) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `status` != ? AND `' . $attr . '` = ?; LIMIT 1;';
		return $this->findEntities($sql, [$this->userId, 'deleted', $value]);
	}

	function getObjectById($uuid) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `uuid` = ? LIMIT 1;';
		$objects = $this->findEntities($sql, [$this->userId, $uuid]);
		if(count($objects) > 0) {
			return $objects[0];
		} else {
			return null;
		}
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
	 * Fetch all items that are associated to the current user
	 *
	 * @return Object[] list if matching items
	 */
	function findAllForCurrentUser() {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ?;';
		return $this->findEntities($sql, [$this->userId]);
	}

	/**
	 * Fetch all items that are associated to the current user
	 * and not deleted
	 *
	 * @return Object[] list if matching items
	 */
	function findActiveForCurrentUser() {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ? AND `status` != ?;';
		return $this->findEntities($sql, [$this->userId, 'deleted']);
	}
}
