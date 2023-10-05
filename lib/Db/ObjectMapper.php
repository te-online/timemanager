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
abstract class ObjectMapper extends QBMapper implements ICurrentUser {
	protected string $userId;
	protected CommitMapper $commitMapper;

    abstract public function deleteChildrenForEntityById(string $uuid, string $commit): void;

	public function __construct(IDBConnection $db, CommitMapper $commitMapper, $dbname) {
		$this->commitMapper = $commitMapper;
		parent::__construct($db, $dbname);
	}

	function setCurrentUser(string $userId): void
    {
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
	function getActiveObjectsByAttributeValue(string $attr, string $value, $orderby = "created", $shared = false, $isReporterOrAdmin = false): array {
		$sql = $this->db->getQueryBuilder();
        if ($isReporterOrAdmin) {
            $shared = false;
        }
		if ($shared && strpos($this->tableName, "_client") > -1) {
			$sql
				->selectDistinct("client.*")
				->from($this->tableName, "client")
				->leftJoin("client", "*PREFIX*timemanager_share", "share", "client.`uuid` = share.`object_uuid`")
				->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

			$expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
                "client.`user_id` = :userid",
            );

			$sql
				->where($expr)
				->andWhere("client.`status` != :status")
				->andWhere("client.`$attr` = :attr")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters(["userid" => $this->userId, "status" => "deleted", "attr" => $value]);

		} elseif ($shared && strpos($this->tableName, "_project") > -1) {
			$sql
				->selectDistinct("project.*")
				->from($this->tableName, "project")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` != :userid"
				)
				->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

			$expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
                "project.`user_id` = :userid"
                );

			$sql
				->where($expr)
				->andWhere("project.`status` != :status")
				->andWhere("project.`$attr` = :attr")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters(["userid" => $this->userId, "status" => "deleted", "attr" => $value]);

		} elseif ($shared && strpos($this->tableName, "_task") > -1) {
			$sql
				->selectDistinct("task.*")
				->from($this->tableName, "task")
				->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` != :userid"
				)
				->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

			$expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
                "task.`user_id` = :userid"
            );

			$sql
				->where($expr)
				->andWhere("task.`status` != :status")
				->andWhere("task.`$attr` = :attr")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters(["userid" => $this->userId, "status" => "deleted", "attr" => $value]);

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
					"project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` = :userid"
				);

			$expr = $sql->expr()->orX("share.`author_user_id` = :userid", "time.`user_id` = :userid");

			$sql
				->where($expr)
				->andWhere("time.`status` != :status")
				->andWhere("time.`$attr` = :attr")
				->orderBy(\strtolower($orderby), "ASC");

			$sql->setParameters(["userid" => $this->userId, "status" => "deleted", "attr" => $value]);

		} else {
			$sql = $this->db->getQueryBuilder();
			$sql
				->select("*")
				->from($this->tableName)
				->andWhere("`status` != :status")
				->andWhere("`$attr` = :attr")
				->orderBy(\strtolower($orderby), "ASC")
                ->setParameters(["status" => "deleted", "attr" => $value]);

            if (!$isReporterOrAdmin) {
				$sql->where("`user_id` = :userid")
                ->setParameter("userid", $this->userId);
            }
		}

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

	function getActiveObjectById(string $uuid, bool $shared = false, bool $isReporterOrAdmin = false): ?\OCP\AppFramework\Db\Entity {
		$objects = $this->getActiveObjectsByAttributeValue("uuid", $uuid, "created", $shared, $isReporterOrAdmin);
		if (count($objects) > 0) {
			return $objects[0];
		} else {
			return null;
		}
	}

	function getObjectsAfterCommit($commit): array {
		$sql = $this->db->getQueryBuilder();
		$sql->select("current.*");
		$sql->from($this->tableName, "current");

		if (strpos($this->tableName, "_time") > -1) {
			$sql
				->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
				->where("current.`user_id` = :userid")
				->andWhere("task.`user_id` = :userid");
		} else {
			$sql->where("current.`user_id` = :userid");
		}

		$applicable_commits = $this->commitMapper->getCommitsAfter($commit);
		$sql->andWhere("current.`commit` IN (:commits)");
		$sql->orderBy("current.changed", "ASC");

		$sql->setParameters(["userid" => $this->userId, "status" => "deleted", "commits" => array_values($applicable_commits)]);

		return [
			"created" => $this->getCreatedObjectsAfterCommit($sql),
			"updated" => $this->getUpdatedObjectsAfterCommit($sql),
			"deleted" => $this->getDeletedObjectsAfterCommit($sql),
		];
	}

	function getCreatedObjectsAfterCommit($sql) {
		$sql->andWhere("current.`created` = current.`changed`");
		$sql->andWhere("current.`status` != :status");

		return array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql));
	}

	function getUpdatedObjectsAfterCommit($sql) {
		$sql->andWhere("current.`created` != current.`changed`");
		$sql->andWhere("current.`status` != :status");

		return array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql));
	}

	function getDeletedObjectsAfterCommit($sql) {
		$sql->andWhere("current.`status` = :status");

		return array_map(function ($object) {
			return $object->toArray();
		}, $this->findEntities($sql));
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
				->leftJoin("client", "*PREFIX*timemanager_share", "share", "client.uuid = share.object_uuid")
				->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

			$expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
                "client.user_id = :userid",
            );
			$sql->where($expr)->andWhere("client.status != :status");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters(["userid" => $this->userId, "status" => "deleted"]);

		} elseif ($shared && strpos($this->tableName, "_project") > -1) {
			$sql
				->selectDistinct("project.*")
				->from($this->tableName, "project")
				->leftJoin("project", "*PREFIX*timemanager_share", "share", "project.client_uuid = share.object_uuid")
				->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

            $expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
                "project.user_id = :userid",
            );
			$sql->where($expr)->andWhere("project.status != :status");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters(["userid" => $this->userId, "status" => "deleted"]);

		} elseif ($shared && strpos($this->tableName, "_task") > -1) {
			$sql
				->selectDistinct("task.*")
				->from($this->tableName, "task")
				->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.project_uuid = project.uuid")
				->leftJoin(
					"project",
					"*PREFIX*timemanager_share",
					"share",
					"project.client_uuid = share.object_uuid AND share.author_user_id != :userid"
				)
				->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

			$expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
                "task.user_id = :userid",
            );
			$sql->where($expr)->andWhere("task.status != :status");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters(["userid" => $this->userId, "status" => "deleted"]);

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
					"project.client_uuid = share.object_uuid AND share.author_user_id = :userid"
				);

			$expr = $sql->expr()->orX("share.author_user_id = :userid", "time.user_id = :userid");
			$sql->where($expr)->andWhere("time.status != :status");

			$sql->orderBy(\strtolower($orderby), $sort);
			$sql->setParameters(["userid" => $this->userId, "status" => "deleted"]);

		} else {
			$sql = $this->db->getQueryBuilder();
			$sql
				->select("*")
				->from($this->tableName)
				->where("user_id = ?")
				->andWhere("status != ?")
				->orderBy(\strtolower($orderby), $sort);

			$sql->setParameters([$this->userId, "deleted"]);

		}

		return $this->findEntities($sql);
	}

    /**
	 * Fetch all items that are not deleted
	 *
	 * @return Object[] list if matching items
	 */
    function findActiveForReporter($orderby = "created", $sort = "ASC"): array
    {
        $sql = $this->db->getQueryBuilder();

        $sql
            ->selectDistinct("base.*")
            ->from($this->tableName, "base")
            ->andWhere("base.status != :status")
            ->orderBy(\strtolower($orderby), $sort)
            ->setParameter("status", "deleted");

        return $this->findEntities($sql);
    }
}
