<?php
$app = new \OCP\AppFramework\App('timemanager');
/** @var Symfony\Component\Console\Application $application */
$application->add(new OCA\TimeManager\Command\ListItems($app->getContainer()->query('OCA\TimeManager\Db\ItemMapper')));