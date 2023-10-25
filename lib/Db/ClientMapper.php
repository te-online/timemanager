<?php

namespace OCA\TimeManager\Db;

use OCP\IConfig;
use OCP\IDBConnection;
use OCP\IGroupManager;
use OCP\IUserManager;

/**
 * Class ItemMapper
 *
 * @package OCA\TimeManager\Db
 * @method Client insert(Client $entity)
 */
class ClientMapper extends ObjectMapper {
	protected ProjectMapper $projectMapper;

	public function __construct(IDBConnection $db, IConfig $config, IUserManager $userManager, IGroupManager $groupManager, CommitMapper $commitMapper, ProjectMapper $projectMapper) {
		parent::__construct($db, $config, $userManager, $groupManager, $commitMapper, "timemanager_client");
		$this->projectMapper = $projectMapper;
	}

	public function deleteChildrenForEntityById(string $uuid, string $commit): void {
		$this->projectMapper->deleteWithChildrenByClientId($uuid, $commit);
	}

    /**
     * Gets the number of projects for a given object.
     *
     * @param string $uuid
     * @return int number of matching items
     */
	public function countProjects(string $uuid): int
    {
		$projects = $this->projectMapper->getActiveObjectsByAttributeValue("client_uuid", $uuid, "created", true);
		return count($projects);
	}

	public function getHours($uuid) {
		$projects = $this->projectMapper->getActiveObjectsByAttributeValue("client_uuid", $uuid, "created", true);
		$sum = 0;
		if (count($projects) > 0) {
			foreach ($projects as $project) {
				$sum += $this->projectMapper->getHours($project->getUuid());
			}
		}
		return $sum;
	}
}
