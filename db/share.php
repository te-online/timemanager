<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;
use OCA\TimeManager\Helper\ISODate;

/**
 * Class Item
 *
 * @package OCA\TimeManager\Db
 */
class Share extends Entity {
	protected $changed;
	protected $created;
	protected $uuid;
	protected $objectUuid;
	protected $entityType;
	protected $authorUserId;
	protected $recipientUserId;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray() {
		return [
			"changed" => ISODate::convert($this->getChanged()),
			"created" => ISODate::convert($this->getCreated()),
			"uuid" => $this->getUuid(),
			"object_uuid" => $this->getObjectUuid(),
			"entity_type" => $this->getEntityType(),
			"author_user_id" => $this->getAuthorUserId(),
			"recipient_user_id" => $this->getRecipientUserId(),
			"id" => $this->getId(),
		];
	}
}
