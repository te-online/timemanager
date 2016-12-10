<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;

/**
 * Class Item
 *
 * @package OCA\TimeManager\Db
 * @method string getTitle()
 * @method void setTitle(string $value)
 * @method string getText()
 * @method void setText(string $value)
 * @method string getUserId()
 * @method void setUserId(string $value)
 */
class Item extends Entity {
	protected $title;
	protected $text;
	protected $userId;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray() {
		return [
			'id' => $this->getId(),
			'title' => $this->getTitle(),
			'text' => $this->getText()
		];
	}
}
