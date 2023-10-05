<?php

namespace OCA\TimeManager\Db;

use OCP\IDBConnection;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 */
class ShareMapper extends ObjectMapper {

	public function __construct(IDBConnection $connection, CommitMapper $commitMapper) {
		parent::__construct($connection, $commitMapper, "timemanager_share");
	}

	public function findShareesForClient($client_uuid): array {
		$sql = $this->db->getQueryBuilder();

		$sql
			->select("*")
			->from($this->tableName)
			->where("`author_user_id` = ?")
			->andWhere("`object_uuid` = ?")
			->andWhere("`entity_type` = 'client'");
		$sql->setParameters([$this->userId, $client_uuid]);

		return $this->findEntities($sql);
	}

	public function findSharerForClient($client_uuid): array {
		$sql = $this->db->getQueryBuilder();

        $expr = $sql->expr()->orX(
                "share.`recipient_id` = :userid AND share.`recipient_type` = 'user'",
                "group_user.`uid` = :userid AND share.`recipient_type` = 'group'",
            );

		$sql
			->select("share.*")
			->from($this->tableName, 'share')
            ->leftJoin("share", "*PREFIX*group_user", "group_user", "share.recipient_id = group_user.gid")
			->where($expr)
			->andWhere("`object_uuid` = :client_uuid")
			->andWhere("`entity_type` = 'client'");
		$sql->setParameters(["userid" => $this->userId, "client_uuid" => $client_uuid]);

		return $this->findEntities($sql);
	}

	public function findByUuid($uuid): array {
		$sql = $this->db->getQueryBuilder();
		$sql
			->select("*")
			->from($this->tableName)
			->where("`author_user_id` = ?")
			->andWhere("`uuid` = ?")
			->andWhere("`entity_type` = 'client'");
		$sql->setParameters([$this->userId, $uuid]);

		return $this->findEntities($sql);
	}

    public function deleteChildrenForEntityById(string $uuid, string $commit): void
    {
         // Do nothing here, because shares have no children.
    }
}
