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
class ClientMapper extends ObjectMapper {
	public function __construct(IDBConnection $db, CommitMapper $commitMapper) {
		parent::__construct($db, $commitMapper, 'timemanager_client');
	}

	public function deleteChildrenForEntityById($uuid) {
		$projectMapper = new ProjectMapper($this->db, $this->commitMapper);
		$projectMapper->deleteWithChildrenByClientId($uuid);
	}
}
