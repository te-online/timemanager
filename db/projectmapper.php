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
	public function __construct(IDBConnection $db, CommitMapper $commitMapper) {
		parent::__construct($db, $commitMapper, 'timemanager_project');
	}

	public function deleteWithChildrenByClientId($uuid) {
		$projects = $this->getObjectsByAttributeValue('client_uuid', $uuid);
		foreach($projects as $project) {
			$project->setStatus('deleted');
			$project->update();
			$this->deleteChildrenForEntityById($project->getUuid());
		}
	}

	public function deleteChildrenForEntityById($uuid) {
		TaskMapper::deleteWithChildrenByProjectId($uuid);
	}
}
