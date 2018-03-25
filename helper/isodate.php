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
    return $datetime->format('Y-m-d\TH:i:s');
  }
}