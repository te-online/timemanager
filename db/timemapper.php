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

	public function deleteByTaskId($uuid, $commit) {
		$times = $this->getObjectsByAttributeValue('task_uuid', $uuid);
		foreach($times as $time) {
			$time->setCommit($commit);
			$time->setChanged(date('Y-m-d H:i:s'));
			$time->setStatus('deleted');
			$this->update($time);
		}
	}

	public function deleteChildrenForEntityById($uuid, $commit) {
		// Do nothing here, because times have no children.
	}

	public function findForReport(string $start, string $end, string $status = null) {
		return $this->getActiveObjectsByDateRangeAndFilters($start, $end, $status);
	}
}
