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
	protected $projectMapper;

	public function __construct(
		IDBConnection $db,
		CommitMapper $commitMapper,
		ProjectMapper $projectMapper
	) {
		parent::__construct($db, $commitMapper, 'timemanager_client');
		$this->projectMapper = $projectMapper;
	}

	public function deleteChildrenForEntityById($uuid) {
		$this->projectMapper->deleteWithChildrenByClientId($uuid);
	}

	/**
	 * Gets the number of projects for a given object.
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	public function countProjects($uuid) {
		$projects = $this->projectMapper->getObjectsByAttributeValue('client_uuid', $uuid);
		return count($projects);
	}
}
