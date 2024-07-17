<?php

namespace OCA\TimeManager\Helper;

class ISODate {
	/**
	 * Return a properly formatted ISO date.
	 *
	 * @return String
	 */
	public static function convert($date) {
		$datetime = new \DateTime($date);
		return ISODate::formatISO($datetime);
	}

	public static function formatISO(\DateTime $date) {
		return $date->format("Y-m-d\TH:i:s");
	}

	/**
	 * Checks if a given date string is valid
	 */
	public static function isDate(string $datestring, string $format = "Y-m-d"): bool {
		$d = \DateTime::createFromFormat($format, $datestring);
		return $d && $d->format($format) === $datestring;
	}
}