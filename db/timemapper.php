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
class TimeMapper extends Mapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'timemanager_time');
	}

	/**
	 * Fetch all items that are associated to a user
	 *
	 * @param string $userId the user id to filter
	 * @return Client[] list if matching items
	 */
	function findByUser($userId) {
		$sql = 'SELECT * ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ?;';
		return $this->findEntities($sql, [$userId]);
	}
}
