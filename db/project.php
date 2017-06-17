<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;

/**
 * Class Item
 *
 * @package OCA\TimeManager\Db
 * @method string getName()
 * @method void setName(string $value)
 * @method string getUuid()
 * @method void setUuid(string $value)
 * @method string getNote()
 * @method void setNote(string $value)
 * @method string getUserId()
 * @method void setUserId(string $value)
 */
class Project extends Entity {
	protected $changed;
	protected $created;
	protected $name;
	protected $note;
	protected $color;
	protected $clientUuid;
	protected $uuid;
	protected $commit;
	protected $userId;
	protected $status;
	protected $billable;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray() {
		// return [];
		return [
			'uuid' => $this->getUuid(),
			'name' => $this->getName(),
			'note' => $this->getNote()
		];
		// return [
		// 	'uuid' => $this->getUuid(),
		// 	'changed' => $this->getChanged(),
		// 	'created' => $this->getCreated(),
		// 	'city' => $this->getCity(),
		// 	'commit'
		// ];
	}
}
