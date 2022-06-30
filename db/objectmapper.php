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

	function getActiveObjects($orderby = "created", $sort = "ASC"): array {
		$sql =
			"SELECT * FROM `$this->tableName` WHERE `user_id` = ? AND `status` != ? " .
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
	function getActiveObjectsByAttributeValue(string $attr, string $value, $orderby = "created", $shared = false): array {
		if ($shared && strpos($this->tableName, "_client") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM (`$this->tableName` LEFT JOIN `*PREFIX*timemanager_share` ON `$this->tableName`.`uuid` = `*PREFIX*timemanager_share`.`object_uuid`) " .
				"WHERE (`*PREFIX*timemanager_share`.`recipient_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? AND `$this->tableName`.`$attr` = ? " .
				$this->getOrderByClause($orderby) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, "deleted", $value]);
		} elseif ($shared && strpos($this->tableName, "_project") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM (`$this->tableName` LEFT JOIN `*PREFIX*timemanager_share` ON " .
				"(`$this->tableName`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` != ?)) " .
				"WHERE (`*PREFIX*timemanager_share`.`recipient_user_id` = ? OR `$this->tableName`.`user_id` = ?) " .
				"AND `$this->tableName`.`status` != ? AND `$this->tableName`.`$attr` = ? " .
				$this->getOrderByClause($orderby) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, $this->userId, "deleted", $value]);
		} elseif ($shared && strpos($this->tableName, "_task") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM ((`$this->tableName` INNER JOIN `*PREFIX*timemanager_project` ON `$this->tableName`.`project_uuid` = `*PREFIX*timemanager_project`.`uuid`)" .
				"LEFT JOIN `*PREFIX*timemanager_share` ON (`*PREFIX*timemanager_project`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` != ?)) " .
				"WHERE (`*PREFIX*timemanager_share`.`recipient_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? AND `$this->tableName`.`$attr` = ? " .
				$this->getOrderByClause($orderby) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, $this->userId, "deleted", $value]);
		} elseif ($shared && strpos($this->tableName, "_time") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM (((`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) " .
				"INNER JOIN `*PREFIX*timemanager_project` ON `*PREFIX*timemanager_task`.`project_uuid` = `*PREFIX*timemanager_project`.`uuid`)" .
				"LEFT JOIN `*PREFIX*timemanager_share` ON (`*PREFIX*timemanager_project`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` = ?)) " .
				"WHERE (`*PREFIX*timemanager_share`.`author_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? AND `$this->tableName`.`$attr` = ? " .
				$this->getOrderByClause($orderby) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, $this->userId, "deleted", $value]);
		} else {
			$sql =
				"SELECT * FROM `$this->tableName` WHERE `user_id` = ? AND `status` != ? AND `$attr` = ? " .
				$this->getOrderByClause($orderby) .
				";";

			return $this->findEntities($sql, [$this->userId, "deleted", $value]);
		}
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
		string $orderby = "start",
		$shared = false
	): array {
		$params = [$this->userId, "deleted", $date_start, $date_end];
		// Range can be one day as well
		if ($date_start === $date_end) {
			array_pop($params);
			if ($shared) {
				$sql =
					"SELECT DISTINCT `$this->tableName`.* FROM (((`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) " .
					"INNER JOIN `*PREFIX*timemanager_project` ON `*PREFIX*timemanager_task`.`project_uuid` = `*PREFIX*timemanager_project`.`uuid`) " .
					"LEFT JOIN `*PREFIX*timemanager_share` ON (`*PREFIX*timemanager_project`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` = ?)) " .
					"WHERE (`*PREFIX*timemanager_share`.`author_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? AND date(`$this->tableName`.`start`) = ?";
				$params = array_merge([$this->userId, $this->userId], $params);
			} else {
				$sql = "SELECT * FROM `$this->tableName` WHERE `user_id` = ? AND `status` != ? AND date(start) = ?";
			}
		} else {
			if ($shared) {
				$sql =
					"SELECT DISTINCT `$this->tableName`.* FROM (((`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) " .
					"INNER JOIN `*PREFIX*timemanager_project` ON `*PREFIX*timemanager_task`.`project_uuid` = `*PREFIX*timemanager_project`.`uuid`) " .
					"LEFT JOIN `*PREFIX*timemanager_share` ON (`*PREFIX*timemanager_project`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` = ?)) " .
					"WHERE (`*PREFIX*timemanager_share`.`author_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? " .
					"AND date(`$this->tableName`.`start`) >= ? AND date(`$this->tableName`.`start`) <= ? ";
				$params = array_merge([$this->userId, $this->userId], $params);
			} else {
				$sql = "SELECT * FROM `$this->tableName` WHERE `user_id` = ? AND `status` != ? AND date(start) >= ? AND date(start) <= ? ";
			}
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

	function getObjectById(string $uuid): ?\OCP\AppFramework\Db\Entity {
		$sql = "SELECT * " . "FROM `" . $this->tableName . "` " . "WHERE `user_id` = ? AND `uuid` = ? LIMIT 1;";
		$objects = $this->findEntities($sql, [$this->userId, $uuid]);
		if (count($objects) > 0) {
			return $objects[0];
		} else {
			return null;
		}
	}

	function getActiveObjectById(string $uuid, $shared = false): ?\OCP\AppFramework\Db\Entity {
		$objects = $this->getActiveObjectsByAttributeValue("uuid", $uuid, "created", $shared);
		if (count($objects) > 0) {
			return $objects[0];
		} else {
			return null;
		}
	}

	function getObjectsAfterCommit($commit): array {
		return [
			"created" => $this->getCreatedObjectsAfterCommit($commit),
			"updated" => $this->getUpdatedObjectsAfterCommit($commit),
			"deleted" => $this->getDeletedObjectsAfterCommit($commit),
		];
	}

	function getCreatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = "SELECT `$this->tableName`.* ";
		$params = [$this->userId, "deleted"];

		if (strpos($this->tableName, "_time") > -1) {
			$sql .= "FROM (`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) ";
			$sql .= "WHERE `$this->tableName`.`user_id` = ? AND `*PREFIX*timemanager_task`.`user_id` = ? ";
			$params = [$this->userId, $this->userId, "deleted"];
		} else {
			$sql .= "FROM `$this->tableName` WHERE `$this->tableName`.`user_id` = ? ";
		}

		$sql .= "AND `" . $this->tableName . '`.`commit` IN ( "' . implode('","', $applicable_commits) . '" ) AND ';
		$sql .= "`$this->tableName`.`created` = `$this->tableName`.`changed` AND `$this->tableName`.`status` != ? ORDER BY `$this->tableName`.`changed`;";

		$objects = array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql, $params));

		return $objects;
	}

	function getUpdatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = "SELECT `$this->tableName`.* ";
		$params = [$this->userId, "deleted"];

		if (strpos($this->tableName, "_time") > -1) {
			$sql .= "FROM (`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) ";
			$sql .= "WHERE `$this->tableName`.`user_id` = ? AND `*PREFIX*timemanager_task`.`user_id` = ? ";
			$params = [$this->userId, $this->userId, "deleted"];
		} else {
			$sql .= "FROM `$this->tableName` WHERE `$this->tableName`.`user_id` = ? ";
		}

		$sql .= "AND `" . $this->tableName . '`.`commit` IN ( "' . implode('","', $applicable_commits) . '" ) AND ';
		$sql .= "`$this->tableName`.`created` != `$this->tableName`.`changed` AND `$this->tableName`.`status` != ? ORDER BY `$this->tableName`.`changed`;";

		$objects = array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql, $params));

		return $objects;
	}

	function getDeletedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = "SELECT `$this->tableName`.* ";
		$params = [$this->userId, "deleted"];

		if (strpos($this->tableName, "_time") > -1) {
			$sql .= "FROM (`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) ";
			$sql .= "WHERE `$this->tableName`.`user_id` = ? AND `*PREFIX*timemanager_task`.`user_id` = ? ";
			$params = [$this->userId, $this->userId, "deleted"];
		} else {
			$sql .= "FROM `$this->tableName` WHERE `$this->tableName`.`user_id` = ? ";
		}

		$sql .= "AND `" . $this->tableName . '`.`commit` IN ( "' . implode('","', $applicable_commits) . '" ) AND ';
		$sql .= "`$this->tableName`.`status` = ? ORDER BY `$this->tableName`.`changed`;";

		$objects = array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql, $params));

		return $objects;
	}

	/**
	 * Fetch all items that are associated to the current user
	 * and not deleted
	 *
	 * @return Object[] list if matching items
	 */
	function findActiveForCurrentUser($orderby = "created", $shared = false, $sort = "ASC") {
		if ($shared && strpos($this->tableName, "_client") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM (`$this->tableName` LEFT JOIN `*PREFIX*timemanager_share` ON `$this->tableName`.`uuid` = `*PREFIX*timemanager_share`.`object_uuid`) " .
				"WHERE (`*PREFIX*timemanager_share`.`recipient_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ?" .
				$this->getOrderByClause($orderby, $sort) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, "deleted"]);
		} elseif ($shared && strpos($this->tableName, "_project") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM (`$this->tableName` LEFT JOIN `*PREFIX*timemanager_share` ON `$this->tableName`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid`) " .
				"WHERE (`*PREFIX*timemanager_share`.`recipient_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? " .
				$this->getOrderByClause($orderby, $sort) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, "deleted"]);
		} elseif ($shared && strpos($this->tableName, "_task") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM ((`$this->tableName` INNER JOIN `*PREFIX*timemanager_project` ON `$this->tableName`.`project_uuid` = `*PREFIX*timemanager_project`.`uuid`)" .
				"LEFT JOIN `*PREFIX*timemanager_share` ON (`*PREFIX*timemanager_project`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` != ?)) " .
				"WHERE (`*PREFIX*timemanager_share`.`recipient_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? " .
				$this->getOrderByClause($orderby, $sort) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, $this->userId, "deleted"]);
		} elseif ($shared && strpos($this->tableName, "_time") > -1) {
			$sql =
				"SELECT DISTINCT `$this->tableName`.* FROM (((`$this->tableName` INNER JOIN `*PREFIX*timemanager_task` ON `$this->tableName`.`task_uuid` = `*PREFIX*timemanager_task`.`uuid`) " .
				"INNER JOIN `*PREFIX*timemanager_project` ON `*PREFIX*timemanager_task`.`project_uuid` = `*PREFIX*timemanager_project`.`uuid`)" .
				"LEFT JOIN `*PREFIX*timemanager_share` ON (`*PREFIX*timemanager_project`.`client_uuid` = `*PREFIX*timemanager_share`.`object_uuid` AND `*PREFIX*timemanager_share`.`author_user_id` = ?)) " .
				"WHERE (`*PREFIX*timemanager_share`.`author_user_id` = ? OR `$this->tableName`.`user_id` = ?) AND `$this->tableName`.`status` != ? " .
				$this->getOrderByClause($orderby, $sort) .
				";";

			return $this->findEntities($sql, [$this->userId, $this->userId, $this->userId, "deleted"]);
		} else {
			$sql =
				"SELECT * FROM `$this->tableName` WHERE `user_id` = ? AND `status` != ? " .
				$this->getOrderByClause($orderby, $sort) .
				";";

			return $this->findEntities($sql, [$this->userId, "deleted"]);
		}
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
