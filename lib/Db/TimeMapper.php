<?php

namespace OCA\TimeManager\Db;

use OCP\IDBConnection;

/**
 * Class TimeMapper
 *
 * @package OCA\TimeManager\Db
 * @method Time insert(Time $entity)
 */
class TimeMapper extends ObjectMapper
{
    public function __construct(IDBConnection $db, CommitMapper $commitMapper)
    {
        parent::__construct($db, $commitMapper, "timemanager_time");
    }

    public function deleteByTaskId($uuid, $commit): void
    {
        $times = $this->getActiveObjectsByAttributeValue("task_uuid", $uuid);
        foreach ($times as $time) {
            $time->setCommit($commit);
            $time->setChanged(date("Y-m-d H:i:s"));
            $time->setStatus("deleted");
            $this->update($time);
        }
    }

    public function deleteChildrenForEntityById($uuid, $commit): void
    {
        // Do nothing here, because times have no children.
    }

    /**
     *
     *  Fetch all time items that are associated to the current user
     *  within a given timerange, not deleted and with applied filters
     *
     * @param string      $date_start
     * @param string      $date_end
     * @param string|null $status
     * @param array|null  $filter_tasks
     * @param bool        $shared
     * @param bool        $isReporterOrAdmin
     * @return array
     * @throws \OCP\DB\Exception
     */
    public function findForReport(
        string $date_start,
        string $date_end,
        string $status = null,
        ?array $filter_tasks = [],
        bool $shared = false,
        bool $isReporterOrAdmin = false,
    ): array {
        $params = [
            "userid"     => $this->userId,
            "deleted"    => "deleted",
            "date_start" => $date_start,
            "date_end"   => $date_end,
        ];
        $sql = $this->db->getQueryBuilder();
        if ($isReporterOrAdmin) {
            $shared = false;
        }

        $sql->selectDistinct("current.*")
            ->from($this->tableName, "current")
            ->where("current.`status` != :deleted");

        if ($shared) {
            $sql->innerJoin("current", "*PREFIX*timemanager_task", "task", "current.`task_uuid` = task.`uuid`")
                ->innerJoin("task", "*PREFIX*timemanager_project", "project", "task.`project_uuid` = project.`uuid`")
                ->leftJoin(
                    "project",
                    "*PREFIX*timemanager_share",
                    "share",
                    "project.`client_uuid` = share.`object_uuid` AND share.`author_user_id` = :userid"
                )
                ->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid");

            $expr = $sql->expr()
                        ->orX("share.`author_user_id` = :userid", "current.`user_id` = :userid");

            $sql->andWhere($expr);
        } elseif (!$isReporterOrAdmin) {
            $sql->andWhere("current.`user_id` = :userid");
        }

        // Range can be one day as well
        if ($date_start === $date_end) {
            $sql->andWhere("date(current.`start`) = :date_start");
        } else {
            $sql->andWhere("date(current.`start`) >= :date_start")
                ->andWhere("date(current.`start`) <= :date_end");
        }
        if (isset($status) && $status) {
            if ($status === "paid") {
                $sql->andWhere("LOWER(`payment_status`) = :status");
                $params["status"] = strtolower($status);
            } else {
                $expr = $sql->expr()
                            ->orX("`payment_status` IS NULL", "LOWER(`payment_status`) <> :status");
                $sql->andWhere($expr);
                $params["status"] = "paid";
            }
        }
        if (is_array($filter_tasks)) {
            $sql->andWhere("`task_uuid` IN ('" . implode("','", $filter_tasks) . "')");
        }

        $sql->orderBy("start", "ASC");
        $sql->setParameters($params);

        return $this->findEntities($sql);
    }
}
