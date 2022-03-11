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

	public function findForClient($client_uuid): array {
		$sql =
			"SELECT * " .
			"FROM `" .
			$this->tableName .
			"` " .
			"WHERE (`recipient_user_id` = ? OR `author_user_id` = ?) AND `object_uuid` = ? AND `entity_type` = 'client';";
		return $this->findEntities($sql, [$this->userId, $this->userId, $client_uuid]);
	}
}
