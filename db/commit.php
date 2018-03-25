<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;
use OCA\TimeManager\Helper\ISODate;

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
		return [
			'commit' => $this->getCommit(),
			'created' => ISODate::convert($this->getCreated())
		];
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
