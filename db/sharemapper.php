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
		$sql
			->select("*")
			->from($this->tableName)
			->where("`recipient_user_id` = ?")
			->andWhere("`object_uuid` = ?")
			->andWhere("`entity_type` = 'client'");
		$sql->setParameters([$this->userId, $client_uuid]);
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
