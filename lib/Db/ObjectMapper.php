<?php

namespace OCA\TimeManager\Db;

use OCA\TimeManager\AppInfo\Application;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\Exception;
use OCP\IConfig;
use OCP\IDBConnection;
use OCP\IGroupManager;
use OCP\IUserManager;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 * @method Client insert(Client $entity)
 */
abstract class ObjectMapper extends QBMapper implements ICurrentUser {
	protected string $userId;

    abstract public function deleteChildrenForEntityById(string $uuid, string $commit): void;

	public function __construct(
        IDBConnection $db,
        protected IConfig $config,
        protected IUserManager $userManager,
        protected IGroupManager $groupManager,
        protected CommitMapper $commitMapper,
        $dbname) {
		parent::__construct($db, $dbname);
	}

	function setCurrentUser(string $userId): void
    {
		$this->userId = $userId;
		$this->commitMapper->setCurrentUser($this->userId);
	}

    /**
     * Get all groups of user
     *
     * @return string[]
     */
    function getUserGroups(): array
    {
        $user = $this->userManager->get($this->userId);
        return array_unique($this->groupManager->getUserGroupIds($user));
    }

    function userIsAdminOrReporter(): bool
    {
        return $this->groupManager->isAdmin($this->userId)
            || $this->groupManager->isInGroup($this->userId, $this->config->getAppValue(Application::APP_ID, 'reporter_group'));
    }

    /**
     * Fetch all items that are associated to the current user
     * with a given attribute-value-combination and not deleted
     *
     * @param string $attr    the attribute name
     * @param string $value   the attribute value
     * @return Object[] list if matching items
     * @throws Exception
     */
	function getActiveObjectsByAttributeValue(
        string $attr,
        string $value,
        string $orderBy = "created",
        bool $shared = false,
        bool $isReporterOrAdmin = false,
    ): array {
		$sql = $this->db->getQueryBuilder();
        if ($isReporterOrAdmin) {
            $shared = false;
        }

        $sql->selectDistinct("base.*")
            ->from($this->tableName, "base")
            ->where("base.`status` != :status")
            ->andWhere("base.`$attr` = :attr")
            ->orderBy(\strtolower($orderBy), "ASC")
            ->setParameters([
                "userid" => $this->userId,
                "status" => "deleted",
                "attr" => $value,
                "reporter_or_admin" => $isReporterOrAdmin,
            ]);

        if ($shared) {
            $expr = [
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "share.`recipient_id` IN ('".implode("','", $this->getUserGroups())."') AND share.`recipient_type` = 'group'",
                "base.`user_id` = :userid",
                ":admin_or_reporter",
            ];

            $sql->setParameter("admin_or_reporter", $this->userIsAdminOrReporter());

            if (strpos($this->tableName, "_client") > -1) {
                $sql->leftJoin("base", "*PREFIX*timemanager_share", "share", "base.`uuid` = share.`object_uuid`");
            } elseif (strpos($this->tableName, "_project") > -1) {
                $sql->leftJoin("base", "*PREFIX*timemanager_share", "share", "base.`client_uuid` = share.`object_uuid`");
            } elseif (strpos($this->tableName, "_task") > -1) {
                $sql->innerJoin("base", "*PREFIX*timemanager_project", "project", "base.`project_uuid` = project.`uuid`")
                    ->leftJoin("project", "*PREFIX*timemanager_share", "share", "project.`client_uuid` = share.`object_uuid`");
            } elseif (strpos($this->tableName, "_time") > -1) {
                $sql->innerJoin("base", "*PREFIX*timemanager_task", "task", "base.`task_uuid` = task.`uuid`")
                    ->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
                    ->leftJoin("project", "*PREFIX*timemanager_share", "share", "project.`client_uuid` = share.`object_uuid`");

                $expr = [
                    "share.`author_user_id` = :userid",
                    "base.`user_id` = :userid",
                    ":admin_or_reporter",
                ];
            }

            $sql->andWhere($sql->expr()->orX(...$expr));
        } else {
            if (!$isReporterOrAdmin) {
				$sql->where("base.`user_id` = :userid");
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
	function findActiveForCurrentUser($orderBy = "created", $shared = false, $sort = "ASC"): array
    {
		$sql = $this->db->getQueryBuilder();
        $sql->selectDistinct("base.*")
            ->from($this->tableName, "base");

        $sql->where("base.status != :status")
            ->orderBy(\strtolower($orderBy), $sort);;

        $sql->setParameters([
            "userid" => $this->userId,
            "status" => "deleted",
        ]);

        if ($shared) {
            $expr = [
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "share.`recipient_id` IN ('".implode("','", $this->getUserGroups())."') AND share.`recipient_type` = 'group'",
                "base.user_id = :userid",
                ":admin_or_reporter"
            ];

            $sql->setParameter("admin_or_reporter", $this->userIsAdminOrReporter());

            if (strpos($this->tableName, "_client") > -1) {
                $sql->leftJoin("base", "*PREFIX*timemanager_share", "share", "base.uuid = share.object_uuid");
            } elseif (strpos($this->tableName, "_project") > -1) {
                $sql->leftJoin("base", "*PREFIX*timemanager_share", "share", "base.client_uuid = share.object_uuid");
            } elseif (strpos($this->tableName, "_task") > -1) {
                $sql->innerJoin("base", "*PREFIX*timemanager_project", "project", "base.project_uuid = project.uuid")
                    ->leftJoin("project", "*PREFIX*timemanager_share","share","project.client_uuid = share.object_uuid");
            } elseif (strpos($this->tableName, "_time") > -1) {
                $sql->innerJoin("base", "*PREFIX*timemanager_task", "task", "base.task_uuid = task.uuid")
                    ->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.project_uuid = project.uuid")
                    ->leftJoin(
                        "project",
                        "*PREFIX*timemanager_share",
                        "share",
                        "project.client_uuid = share.object_uuid"
                    );

                $expr = [
                    "share.author_user_id = :userid",
                    "base.user_id = :userid",
                    ":admin_or_reporter",
                ];
            }

            $sql->andWhere($sql->expr()->orX(...$expr));
		} else {
			$sql->andWhere("base.user_id = :userid");
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
