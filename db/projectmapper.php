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
}
