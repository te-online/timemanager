<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\Entity;
use OCA\TimeManager\Helper\ISODate;

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
class Time extends Entity {
	protected $changed;
	protected $created;
	protected $start;
	protected $end;
	protected $taskUuid;
	protected $note;
	protected $uuid;
	protected $commit;
	protected $userId;
	protected $status;
	protected $paymentStatus;

	/**
	 * Creates an array that represents the item in array format
	 *
	 * @return array item representation as array
	 */
	function toArray() {
		return [
			"changed" 	=> ISODate::convert($this->getChanged()),
			"commit" 		=> $this->getCommit(),
			"created"		=> ISODate::convert($this->getCreated()),
			"end" 			=> ISODate::convert($this->getEnd()),
			"note" 			=> $this->getNote(),
			"start"			=> ISODate::convert($this->getStart()),
			"task_uuid"	=> $this->getTaskUuid(),
			"uuid"			=> $this->getUuid()
		];
	}

	/**
	 * Gets the start date formatted.
	 *
	 * @return string
	 */
	function getStartFormatted() {
		$start = date_create($this->getStart());
		return date_format($start, 'D, j. F Y');
	}

	/**
	 * Gets the duration formatted.
	 *
	 * @return string
	 */
	function getDurationInHours() {
		if($this->status === 'deleted') {
			return 0;
		}

		$start = date_create($this->getStart());
		$end = date_create($this->getEnd());
		$diff = date_diff($start, $end);
		return round(($diff->format('%h%') + ($diff->format('%i%') / 60)), 2);
	}
}
