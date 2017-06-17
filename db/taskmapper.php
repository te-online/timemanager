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

	public function deleteWithChildrenByProjectId($uuid) {
		$tasks = $this->getObjectsByAttributeValue('project_uuid', $uuid);
		foreach($tasks as $task) {
			$task->setStatus('deleted');
			$task->update();
			$this->deleteChildrenForEntityById($task->getUuid());
		}
	}

	public function deleteChildrenForEntityById($uuid) {
		TimeMapper::deleteWithChildrenByTaskId($uuid);
	}
}
