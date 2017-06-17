<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class TimeMapper
 *
 * @package OCA\TimeManager\Db
 * @method Time insert(Time $entity)
 */
class TimeMapper extends ObjectMapper {
	public function __construct(IDBConnection $db, CommitMapper $commitMapper) {
		parent::__construct($db, $commitMapper, 'timemanager_time');
	}
}
