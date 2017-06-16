<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;

/**
 * Class Item
 *
 * @package OCA\TimeManager\Db
 */
class Commit extends Entity {
	protected $commit;
	protected $created;
	protected $userId;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray() {
		// return [];
		return [
			'commit' => $this->getCommit(),
			'created' => $this->getCreated()
		];
		// return [
		// 	'uuid' => $this->getUuid(),
		// 	'changed' => $this->getChanged(),
		// 	'created' => $this->getCreated(),
		// 	'city' => $this->getCity(),
		// 	'commit'
		// ];
	}

	/**
	 * Creates a string from the commit
	 *
	 * @return array item representation as array
	 */
	function toString() {
		return $this->getCommit();
	}
}
