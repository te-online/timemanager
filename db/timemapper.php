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

	public function deleteByTaskId($uuid) {
		$times = $this->getObjectsByAttributeValue('client_uuid', $uuid);
		foreach($times as $time) {
			$time->setStatus('deleted');
			$time->update();
		}
	}

	public function deleteChildrenForEntityById($uuid) {
		// Do nothing here, because times have no children.
	}
}
