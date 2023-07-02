<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;
use OCA\TimeManager\Helper\ISODate;
use OCP\IUserManager;
use OCP\IUser;

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
	function toArray(IUserManager $userManager) {
		return [
			"changed" => ISODate::convert($this->getChanged()),
			"created" => ISODate::convert($this->getCreated()),
			"uuid" => $this->getUuid(),
			"object_uuid" => $this->getObjectUuid(),
			"entity_type" => $this->getEntityType(),
			"author_user_id" => $this->getAuthorUserId(),
			"author_display_name" => $this->getAuthorUserDisplayName($userManager),
			"recipient_user_id" => $this->getRecipientUserId(),
			"recipient_display_name" => $this->getRecipientUserDisplayName($userManager),
			"id" => $this->getId(),
		];
	}

	public function getAuthorUserDisplayName(IUserManager $userManager): ?string {
		$user = $userManager->get($this->getAuthorUserId());
		if ($user instanceof IUser) {
			return $user->getDisplayName();
		}
		$l = \OC::$server->getL10N("timemanager");
		return $l->t("Deleted user");
	}

	public function getRecipientUserDisplayName(IUserManager $userManager): ?string {
		$user = $userManager->get($this->getRecipientUserId());
		if ($user instanceof IUser) {
			return $user->getDisplayName();
		}
		$l = \OC::$server->getL10N("timemanager");
		return $l->t("Deleted user");
	}
}
