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
		$sql = "SELECT * " . "FROM `" . $this->tableName . "` " . "WHERE `user_id` = ? AND `" . $attr . "` = ?;";
		return $this->findEntities($sql, [$this->userId, $value]);
	}

	function getActiveObjects($orderby = "created", $sort) {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? AND `status` != ? " .
			$this->getOrderByClause($orderby, $sort) .
			";";
		return $this->findEntities($sql, [$this->userId, "deleted"]);
	}

	/**
	 * Fetch all items that are associated to the current user
	 * with a given attribute-value-combination and not deleted
	 *
	 * @param string $attr the attribute name
	 * @param string $value the attribute value
	 * @return Object[] list if matching items
	 */
	function getActiveObjectsByAttributeValue($attr, $value, $orderby = "created") {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? AND `status` != ? AND `" .
			$attr .
			"` = ? " .
			$this->getOrderByClause($orderby) .
			";";
		return $this->findEntities($sql, [$this->userId, "deleted", $value]);
	}

	/**
	 * Fetch all items that are associated to the current user
	 * with a given attribute-value-combination and not deleted
	 *
	 * @param string $attr the attribute name
	 * @param string $value the attribute value
	 * @return Object[] list if matching items
	 */
	function getActiveObjectsByDateRange($date_start, $date_end, $orderby = "start") {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? AND `status` != ? " .
			"AND start >= ? AND start <= ? " .
			$this->getOrderByClause($orderby) .
			";";
		return $this->findEntities($sql, [$this->userId, "deleted", $date_start, $date_end]);
	}

	/**
	 * Fetch all items that are associated to the current user
	 * within a given timerange, not deleted and with applied filters
	 *
	 * @param string $date_start the range start
	 * @param string $date_end the range end
	 * @param string $status the status
	 * @return Object[] list if matching items
	 */
	function getActiveObjectsByDateRangeAndFilters(
		string $date_start,
		string $date_end,
		string $status = null,
		array $filter_tasks = [],
		string $orderby = "start"
	) {
		$params = [$this->userId, "deleted", $date_start, $date_end];
		// Range can be one day as well
		if ($date_start === $date_end) {
			array_pop($params);
			$sql =
				"SELECT * " .
				"FROM `" .
				$this->tableName .
				"` " .
				"WHERE `user_id` = ? AND `status` != ? " .
				"AND date(start) = ?";
		} else {
			$sql =
				"SELECT * " .
				"FROM `" .
				$this->tableName .
				"` " .
				"WHERE `user_id` = ? AND `status` != ? " .
				"AND start >= ? AND start <= ? ";
		}
		if (isset($status) && $status) {
			if ($status === "paid") {
				$sql .= "AND LOWER(`payment_status`) = ? ";
				$params[] = strtolower($status);
			} else {
				$sql .= "AND (`payment_status` IS NULL OR LOWER(`payment_status`) <> ?) ";
				$params[] = "paid";
			}
		}
		if (count($filter_tasks) > 0) {
			$sql .= "AND `task_uuid` IN ('" . implode("','", $filter_tasks) . "') ";
		}
		$sql .= $this->getOrderByClause($orderby) . ";";
		return $this->findEntities($sql, $params);
	}

	function getObjectById($uuid) {
		$sql = "SELECT * " . "FROM `" . $this->tableName . "` " . "WHERE `user_id` = ? AND `uuid` = ? LIMIT 1;";
		$objects = $this->findEntities($sql, [$this->userId, $uuid]);
		if (count($objects) > 0) {
			return $objects[0];
		} else {
			return null;
		}
	}

	function getActiveObjectById($uuid) {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? AND `uuid` = ? AND `status` != ? LIMIT 1;";
		$objects = $this->findEntities($sql, [$this->userId, $uuid, "deleted"]);
		if (count($objects) > 0) {
			return $objects[0];
		} else {
			return null;
		}
	}

	function getObjectsAfterCommit($commit) {
		return [
			"created" => $this->getCreatedObjectsAfterCommit($commit),
			"updated" => $this->getUpdatedObjectsAfterCommit($commit),
			"deleted" => $this->getDeletedObjectsAfterCommit($commit),
		];
	}

	function getCreatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? " .
			'AND `commit` IN ( "' .
			implode('","', $applicable_commits) .
			'" ) ' .
			"AND `created` = `changed` AND `status` != ? " .
			"ORDER BY `changed`;";
		$clients = array_map(function ($client) {
			return $client->toArray();
		}, $this->findEntities($sql, [$this->userId, "deleted"]));
		return $clients;
	}

	function getUpdatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? " .
			'AND `commit` IN ( "' .
			implode('","', $applicable_commits) .
			'" ) ' .
			"AND `created` != `changed` AND `status` != ? " .
			"ORDER BY `changed`;";
		$clients = array_map(function ($client) {
			return $client->toArray();
		}, $this->findEntities($sql, [$this->userId, "deleted"]));
		return $clients;
	}

	function getDeletedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? " .
			'AND `commit` IN ( "' .
			implode('","', $applicable_commits) .
			'" ) ' .
			"AND `status` = ? " .
			"ORDER BY `changed`;";
		$clients = array_map(function ($client) {
			return $client->toArray();
		}, $this->findEntities($sql, [$this->userId, "deleted"]));
		return $clients;
	}

	/**
	 * Fetch all items that are associated to the current user
	 *
	 * @return Object[] list if matching items
	 */
	function findAllForCurrentUser() {
		$sql = "SELECT * " . "FROM `" . $this->tableName . "` " . "WHERE `user_id` = ?;";
		return $this->findEntities($sql, [$this->userId]);
	}

	/**
	 * Fetch all items that are associated to the current user
	 * and not deleted
	 *
	 * @return Object[] list if matching items
	 */
	function findActiveForCurrentUser($orderby = "created") {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE `user_id` = ? AND `status` != ? " .
			$this->getOrderByClause($orderby) .
			";";
		return $this->findEntities($sql, [$this->userId, "deleted"]);
	}

	/**
	 * Creates a proper ORDER BY clause for given orderby column.
	 *
	 * @return string
	 */
	function getOrderByClause($orderby, $sort = "ASC") {
		return sprintf("ORDER BY `%s` %s", \strtolower($orderby), $sort);
	}
}
