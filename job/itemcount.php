<?php

namespace OCA\Expo\Job;

use OCA\Expo\Db\ItemMapper;
use OCP\AppFramework\App;
use OC\BackgroundJob\TimedJob;
use OCP\BackgroundJob\IJob;

class ItemCount extends TimedJob implements IJob {

	/**
	 * sets the correct interval for this timed job
	 */
	function __construct() {
		$this->interval = 5;

	}

	function run($arguments) {
		$logger = \OC::$server->getLogger();
		$app = new App('expo');
		/** @var ItemMapper $itemMapper */
		$itemMapper = $app->getContainer()->query('OCA\Expo\Db\ItemMapper');
		$items = $itemMapper->findByUser('mjob');

		$logger->info('There are {count} items in the database for the user mjob', ['app' => 'expo', 'count' => count($items)]);
	}
}