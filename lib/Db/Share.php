<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;
use OCA\TimeManager\Helper\ISODate;
use OCP\IGroup;
use OCP\IGroupManager;
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
	protected $recipientId;
	protected $recipientType;
	protected $permission;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray(IUserManager $userManager, IGroupManager $groupManager) {
		return [
			"changed" => ISODate::convert($this->getChanged()),
			"created" => ISODate::convert($this->getCreated()),
			"uuid" => $this->getUuid(),
			"object_uuid" => $this->getObjectUuid(),
			"entity_type" => $this->getEntityType(),
			"author_user_id" => $this->getAuthorUserId(),
			"author_display_name" => $this->getAuthorUserDisplayName($userManager),
			"recipient_id" => $this->getRecipientId(),
			"recipient_type" => $this->getRecipientType(),
			"recipient_display_name" => $this->getRecipientDisplayName($userManager, $groupManager),
			"permission" => $this->getPermission(),
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

	public function getRecipientDisplayName(IUserManager $userManager, IGroupManager $groupManager): ?string {
		if ($this->getRecipientType() === "user") {
			$user = $userManager->get($this->getRecipientId());
			if ($user instanceof IUser) {
				return $user->getDisplayName();
			}
		} else {
			$group = $groupManager->get($this->getRecipientId());
			if ($group instanceof IGroup) {
				return $group->getDisplayName();
			}
		}
		$l = \OC::$server->getL10N("timemanager");
		return $l->t("Deleted user");
	}
}
