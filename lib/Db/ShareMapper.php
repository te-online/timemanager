<?php

namespace OCA\TimeManager\Db;

use OCP\IDBConnection;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 */
class ShareMapper extends ObjectMapper {
	protected IDBConnection $connection;

	public function __construct(IDBConnection $connection, CommitMapper $commitMapper) {
		$this->connection = $connection;
		parent::__construct($connection, $commitMapper, "timemanager_share");
	}

	public function findShareesForClient($client_uuid): array {
		$sql = $this->connection->getQueryBuilder();
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
		$sql = $this->connection->getQueryBuilder();

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
		$sql = $this->connection->getQueryBuilder();
		$sql
			->select("*")
			->from($this->tableName)
			->where("`author_user_id` = ?")
			->andWhere("`uuid` = ?")
			->andWhere("`entity_type` = 'client'");
		$sql->setParameters([$this->userId, $uuid]);
		return $this->findEntities($sql);
	}
}
