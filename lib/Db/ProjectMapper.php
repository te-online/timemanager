<?php

namespace OCA\TimeManager\Db;

use OCP\IDBConnection;

/**
 * Class ProjectMapper
 *
 * @package OCA\TimeManager\Db
 * @method Project insert(Project $entity)
 */
class ProjectMapper extends ObjectMapper {
	private TaskMapper $taskMapper;

	public function __construct(IDBConnection $db, CommitMapper $commitMapper, TaskMapper $taskMapper) {
		parent::__construct($db, $commitMapper, "timemanager_project");
		$this->taskMapper = $taskMapper;
	}

	public function deleteWithChildrenByClientId(string $uuid, string $commit): void {
		$projects = $this->getActiveObjectsByAttributeValue("client_uuid", $uuid);
		foreach ($projects as $project) {
			$project->setCommit($commit);
			$project->setChanged(date("Y-m-d H:i:s"));
			$project->setStatus("deleted");
			$this->update($project);
			$this->deleteChildrenForEntityById($project->getUuid(), $commit);
		}
	}

	public function deleteChildrenForEntityById(string $uuid, string $commit): void
    {
		$this->taskMapper->deleteWithChildrenByProjectId($uuid, $commit);
	}

    /**
     * Gets the number of tasks for a given object.
     *
     * @param string $uuid
     * @return int list if matching items
     */
	public function countTasks(string $uuid): int
    {
		$tasks = $this->taskMapper->getActiveObjectsByAttributeValue("project_uuid", $uuid, "created", true);
		return count($tasks);
	}

	public function getHours($uuid) {
		$tasks = $this->taskMapper->getActiveObjectsByAttributeValue("project_uuid", $uuid, "created", true);
		$sum = 0;
		if (count($tasks) > 0) {
			foreach ($tasks as $task) {
				$sum += $this->taskMapper->getHours($task->getUuid());
			}
		}
		return $sum;
	}
}
