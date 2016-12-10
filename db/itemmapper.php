<?php

namespace OCA\Expo\Db;

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class ItemMapper
 *
 * @package OCA\Expo\Db
 * @method Item insert(Item $entity)
 */
class ItemMapper extends Mapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'expo_items');
	}

	/**
	 * Fetch all items that are associated to a user
	 *
	 * @param string $userId the user id to filter
	 * @return Item[] list if matching items
	 */
	function findByUser($userId) {
		$sql = 'SELECT `id`, `title`, `text` ' .
				'FROM `' . $this->tableName . '` ' .
				'WHERE `user_id` = ?;';
		return $this->findEntities($sql, [$userId]);
	}
}
