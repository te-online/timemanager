<?php
$app = new \OCP\AppFramework\App('expo');
/** @var Symfony\Component\Console\Application $application */
$application->add(new OCA\Expo\Command\ListItems($app->getContainer()->query('OCA\Expo\Db\ItemMapper')));