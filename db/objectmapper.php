<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\QBMapper;
use OCP\IDBConnection;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 * @method Client insert(Client $entity)
 */
class ObjectMapper extends QBMapper {
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
		$sql = $this->db->getQueryBuilder();
		$sql
			->select("*")
			->from($this->tableName)
			->where("`user_id` = ?")
			->andWhere("`status` != ?")
			->orderBy(\strtolower($orderby), $sort);

		$sql->setParameters([$this->userId, "deleted"]);

		return $this->findEntities($sql);
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
		$sql = $this->db->getQueryBuilder();
		if ($shared && strpos($this->tableName, "_client") > -1) {
			$sql
				->selectDistinct("client.*")
				->from($this->tableName, "client")
				->leftJoin("client", "*PREFIX*timemanager_share", "share", "client.`uuid` = share.`object_uuid`");

			$expr = $sql->expr()->orX("share.`recipient_user_id` = ?", "client.`user_id` = ?");

			$sql
				->where($expr)
				->andWhere("client.`status` != ?")
				->andWhere("client.`$attr` = ?")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters([$this->userId, $this->userId, "deleted", $value]);

			return $this->findEntities($sql);
		} elseif ($shared && strpos($this->tableName, "_project") > -1) {
			$sql
				->selectDistinct("project.*")
				->from($this->tableName, "project")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` != ?"
				);

			$expr = $sql->expr()->orX("share.`recipient_user_id` = ?", "project.`user_id` = ?");

			$sql
				->where($expr)
				->andWhere("project.`status` != ?")
				->andWhere("project.`$attr` = ?")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters([$this->userId, $this->userId, $this->userId, "deleted", $value]);

			return $this->findEntities($sql);
		} elseif ($shared && strpos($this->tableName, "_task") > -1) {
			$sql
				->selectDistinct("task.*")
				->from($this->tableName, "task")
				->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` != ?"
				);

			$expr = $sql->expr()->orX("share.`recipient_user_id` = ?", "task.`user_id` = ?");

			$sql
				->where($expr)
				->andWhere("task.`status` != ?")
				->andWhere("task.`$attr` = ?")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters([$this->userId, $this->userId, $this->userId, "deleted", $value]);

			return $this->findEntities($sql);
		} elseif ($shared && strpos($this->tableName, "_time") > -1) {
			$sql
				->selectDistinct("time.*")
				->from($this->tableName, "time")
				->innerJoin("time", "*PREFIX*timemanager_task", "task", "time.`task_uuid` = task.`uuid`")
				->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` = ?"
				);

			$expr = $sql->expr()->orX("share.`author_user_id` = ?", "time.`user_id` = ?");

			$sql
				->where($expr)
				->andWhere("time.`status` != ?")
				->andWhere("time.`$attr` = ?")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters([$this->userId, $this->userId, $this->userId, "deleted", $value]);

			return $this->findEntities($sql);
		} else {
			$sql = $this->db->getQueryBuilder();
			$sql
				->select("*")
				->from($this->tableName)
				->where("`user_id` = ?")
				->andWhere("`status` != ?")
				->andWhere("`$attr` = ?")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters([$this->userId, "deleted", $value]);

			return $this->findEntities($sql);
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
		$sql = $this->db->getQueryBuilder();
		// Range can be one day as well
		if ($date_start === $date_end) {
			array_pop($params);
			if ($shared) {
				$sql
					->selectDistinct("current.*")
					->from($this->tableName, "current")
					->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
					->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
					->leftJoin(
						"project",
						"*PREFIX*timemanager_share",
						"share",
						"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` = ?"
					);

				$expr = $sql->expr()->orX("share.`author_user_id` = ?", "current.`user_id` = ?");

				$sql
					->where($expr)
					->andWhere("current.`status` != ?")
					->andWhere("date(current.`start`) = ?");

				$params = array_merge([$this->userId, $this->userId], $params);
			} else {
				$sql
					->select("*")
					->from($this->tableName)
					->where("`user_id` = ?")
					->andWhere("`status` != ?")
					->andWhere("date(start) = ?");
			}
		} else {
			if ($shared) {
				$sql
					->selectDistinct("current.*")
					->from($this->tableName, "current")
					->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
					->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
					->leftJoin(
						"project",
						"*PREFIX*timemanager_share",
						"share",
						"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` = ?"
					);

				$expr = $sql->expr()->orX("share.`author_user_id` = ?", "current.`user_id` = ?");

				$sql
					->where($expr)
					->andWhere("current.`status` != ?")
					->andWhere("date(current.`start`) >= ?")
					->andWhere("date(current.`start`) <= ?");

				$params = array_merge([$this->userId, $this->userId], $params);
			} else {
				$sql
					->select("*")
					->from($this->tableName)
					->where("`user_id` = ?")
					->andWhere("`status` != ?")
					->andWhere("date(start) >= ?")
					->andWhere("date(start) <= ?");
			}
		}
		if (isset($status) && $status) {
			if ($status === "paid") {
				$sql->andWhere("LOWER(`payment_status`) = ?");
				$params[] = strtolower($status);
			} else {
				$expr = $sql->expr()->orX("`payment_status` IS NULL", "LOWER(`payment_status`) <> ?");
				$sql->andWhere($expr);
				$params[] = "paid";
			}
		}
		if (count($filter_tasks) > 0) {
			$sql->andWhere("`task_uuid` IN ('" . implode("','", $filter_tasks) . "')");
		}

		$sql->orderBy(\strtolower($orderby), "ASC");
		$sql->setParameters($params);

		return $this->findEntities($sql);
	}

	function getObjectById(string $uuid): ?\OCP\AppFramework\Db\Entity {
		$sql = $this->db->getQueryBuilder();
		$sql
			->select("*")
			->from($this->tableName)
			->where("`user_id` = ?")
			->andWhere("`uuid` = ?")
			->setMaxResults(1);
		$sql->setParameters([$this->userId, $uuid]);
		$objects = $this->findEntities($sql);
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
		$sql = $this->db->getQueryBuilder();
		$sql->select("current.*");
		$sql->from($this->tableName, "current");
		$params = [$this->userId, "deleted"];

		if (strpos($this->tableName, "_time") > -1) {
			$sql
				->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
				->where("current.`user_id` = ?")
				->andWhere("*PREFIX*timemanager_task.`user_id` = ?");
			$params = [$this->userId, $this->userId, "deleted"];
		} else {
			$sql->where("current.`user_id` = ?");
		}

		$sql->andWhere('current.`commit` IN ( "' . implode('","', $applicable_commits) . '" )');
		$sql->andWhere("current.`created` = current.`changed`");
		$sql->andWhere("current.`status` != ?");
		$sql->orderBy("current.changed", "ASC");

		$sql->setParameters($params);

		$objects = array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql));

		return $objects;
	}

	function getUpdatedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = $this->db->getQueryBuilder();
		$sql->select("current.*");
		$sql->from($this->tableName, "current");
		$params = [$this->userId, "deleted"];

		if (strpos($this->tableName, "_time") > -1) {
			$sql
				->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
				->where("current.`user_id` = ?")
				->andWhere("task.`user_id` = ?");
			$params = [$this->userId, $this->userId, "deleted"];
		} else {
			$sql->where("current.`user_id` = ?");
		}

		$sql->andWhere('current.`commit` IN ( "' . implode('","', $applicable_commits) . '" )');
		$sql->andWhere("current.`created` != current.`changed`");
		$sql->andWhere("current.`status` != ?");
		$sql->orderBy("current.changed", "ASC");

		$sql->setParameters($params);

		$objects = array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql));

		return $objects;
	}

	function getDeletedObjectsAfterCommit($commit) {
		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql = $this->db->getQueryBuilder();
		$sql->select("current.*");
		$sql->from($this->tableName, "current");
		$params = [$this->userId, "deleted"];

		if (strpos($this->tableName, "_time") > -1) {
			$sql
				->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
				->where("current.`user_id` = ?")
				->andWhere("task.`user_id` = ?");
			$params = [$this->userId, $this->userId, "deleted"];
		} else {
			$sql->where("current.`user_id` = ?");
		}

		$sql->andWhere('current.`commit` IN ( "' . implode('","', $applicable_commits) . '" )');
		$sql->andWhere("current.`status` = ?");
		$sql->orderBy("current.changed", "ASC");

		$sql->setParameters($params);

		$objects = array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql));

		return $objects;
	}

	/**
	 * Fetch all items that are associated to the current user
	 * and not deleted
	 *
	 * @return Object[] list if matching items
	 */
	function findActiveForCurrentUser($orderby = "created", $shared = false, $sort = "ASC") {
		$sql = $this->db->getQueryBuilder();
		if ($shared && strpos($this->tableName, "_client") > -1) {
			$sql
				->selectDistinct("client.*")
				->from($this->tableName, "client")
				->leftJoin("client", "*PREFIX*timemanager_share", "share", "client.uuid = share.object_uuid");

			$expr = $sql->expr()->orX("share.recipient_user_id = ?", "client.user_id = ?");
			$sql->where($expr)->andWhere("client.status != ?");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters([$this->userId, $this->userId, "deleted"]);

			return $this->findEntities($sql);
		} elseif ($shared && strpos($this->tableName, "_project") > -1) {
			$sql
				->selectDistinct("project.*")
				->from($this->tableName, "project")
				->leftJoin("project", "*PREFIX*timemanager_share", "share", "project.client_uuid = share.object_uuid");

			$expr = $sql->expr()->orX("share.recipient_user_id = ?", "project.user_id = ?");
			$sql->where($expr)->andWhere("project.status != ?");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters([$this->userId, $this->userId, "deleted"]);

			return $this->findEntities($sql);
		} elseif ($shared && strpos($this->tableName, "_task") > -1) {
			$sql
				->selectDistinct("task.*")
				->from($this->tableName, "task")
				->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.project_uuid = project.uuid")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.client_uuid = share.object_uuid AND share.author_user_id != ?"
				);

			$expr = $sql->expr()->orX("share.recipient_user_id = ?", "task.user_id = ?");
			$sql->where($expr)->andWhere("task.status != ?");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters([$this->userId, $this->userId, $this->userId, "deleted"]);

			return $this->findEntities($sql);
		} elseif ($shared && strpos($this->tableName, "_time") > -1) {
			$sql
				->selectDistinct("time.*")
				->from($this->tableName, "time")
				->innerJoin("time", "*PREFIX*timemanager_task", "task", "time.task_uuid = task.uuid")
				->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.project_uuid = project.uuid")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.client_uuid = share.object_uuid AND share.author_user_id = ?"
				);

			$expr = $sql->expr()->orX("share.recipient_user_id = ?", "time.user_id = ?");
			$sql->where($expr)->andWhere("time.status != ?");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters([$this->userId, $this->userId, $this->userId, "deleted"]);

			return $this->findEntities($sql);
		} else {
			$sql = $this->db->getQueryBuilder();
			$sql
				->select("*")
				->from($this->tableName)
				->where("user_id = ?")
				->andWhere("status != ?")
				->orderBy(\strtolower($orderby), $sort);

			$sql->setParameters([$this->userId, "deleted"]);

			return $this->findEntities($sql);
		}
	}
}
