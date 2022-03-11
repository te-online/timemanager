<?php

namespace OCA\TimeManager\Db;

use OCP\IDBConnection;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 */
class ShareMapper extends ObjectMapper {
	public function __construct(IDBConnection $db, CommitMapper $commitMapper) {
		parent::__construct($db, $commitMapper, "timemanager_share");
	}

	public function findShareesForClient($client_uuid): array {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE (`author_user_id` = ?) AND `object_uuid` = ? AND `entity_type` = 'client';";
		return $this->findEntities($sql, [$this->userId, $client_uuid]);
	}

	public function findSharerForClient($client_uuid): array {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE (`recipient_user_id` = ?) AND `object_uuid` = ? AND `entity_type` = 'client';";
		return $this->findEntities($sql, [$this->userId, $client_uuid]);
	}

	public function findByUuid($uuid): array {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE (`author_user_id` = ?) AND `uuid` = ? AND `entity_type` = 'client';";
		return $this->findEntities($sql, [$this->userId, $uuid]);
	}
}
