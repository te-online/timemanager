<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class TaskMapper
 *
 * @package OCA\TimeManager\Db
 * @method Task insert(Task $entity)
 */
class TaskMapper extends ObjectMapper {
	public function __construct(IDBConnection $db, CommitMapper $commitMapper) {
		parent::__construct($db, $commitMapper, 'timemanager_task');
	}
}
