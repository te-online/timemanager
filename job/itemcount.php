<?php

namespace OCA\TimeManager\Job;

use OCA\TimeManager\Db\ItemMapper;
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
		// $logger = \OC::$server->getLogger();
		// $app = new App('timemanager');
		/** @var ItemMapper $itemMapper */
		// $itemMapper = $app->getContainer()->query('OCA\TimeManager\Db\ItemMapper');
		// $items = $itemMapper->findByUser('mjob');

		// $logger->info('There are {count} items in the database for the user mjob', ['app' => 'timemanager', 'count' => count($items)]);
	}
}