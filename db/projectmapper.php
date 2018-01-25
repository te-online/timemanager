<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class ProjectMapper
 *
 * @package OCA\TimeManager\Db
 * @method Project insert(Project $entity)
 */
class ProjectMapper extends ObjectMapper {
	public function __construct(
		IDBConnection $db,
		CommitMapper $commitMapper,
		TaskMapper $taskMapper
	) {
		parent::__construct($db, $commitMapper, 'timemanager_project');
		$this->taskMapper = $taskMapper;
	}

	public function deleteWithChildrenByClientId($uuid) {
		$projects = $this->getObjectsByAttributeValue('client_uuid', $uuid);
		foreach($projects as $project) {
			$project->setStatus('deleted');
			$this->update($project);
			$this->deleteChildrenForEntityById($project->getUuid());
		}
	}

	public function deleteChildrenForEntityById($uuid) {
		$this->taskMapper->deleteWithChildrenByProjectId($uuid);
	}

	/**
	 * Gets the number of tasks for a given object.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	public function countTasks($uuid) {
		$tasks = $this->taskMapper->getObjectsByAttributeValue('project_uuid', $uuid);
		return count($tasks);
	}

	public function getHours($uuid) {
		$tasks = $this->taskMapper->getObjectsByAttributeValue('project_uuid', $uuid);
		$sum = 0;
		if(count($tasks) > 0) {
			foreach($tasks as $task) {
				$sum += $this->taskMapper->getHours($task->getUuid());
			}
		}
		return $sum;
	}
}
