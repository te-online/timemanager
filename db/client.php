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
class Client extends Entity {
	protected $changed;
	protected $created;
	protected $city;
	protected $email;
	protected $name;
	protected $note;
	protected $phone;
	protected $postcode;
	protected $street;
	protected $uuid;
	protected $web;
	protected $commit;
	protected $userId;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray() {
		return [
			"changed" => $this->getChanged(),
			"city" 		=> $this->getCity(),
			"commit" 	=> $this->getCommit(),
			"created"	=> $this->getCreated(),
			"email"		=> $this->getEmail(),
			"name"		=> $this->getName(),
			"note" 		=> $this->getNote(),
			"phone" 	=> $this->getPhone(),
			"postcode"=> $this->getPostcode(),
			"street"	=> $this->getStreet(),
			"uuid"		=> $this->getUuid(),
			"web"			=> $this->getWeb()
		];
	}
}
