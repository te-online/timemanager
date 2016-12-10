<?php

namespace OCA\Expo\Command;

use OCA\Expo\Db\Item;
use OCA\Expo\Db\ItemMapper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ListItems extends Command {
	/** @var ItemMapper */
	protected $itemMapper;

	function __construct(ItemMapper $itemMapper) {
		$this->itemMapper = $itemMapper;
		parent::__construct();
	}

	protected function configure() {
		$this
			->setName('expo:listitems')
			->setDescription('List expo items by user')
			->addArgument(
				'user',
				InputArgument::REQUIRED,
				'owner of expo items'
			);
	}

	protected function execute(InputInterface $input, OutputInterface $output) {
		$userId = $input->getArgument('user');

		$items = $this->itemMapper->findByUser($userId);
		$items = array_map(function(Item $item) {
			return $item->toArray();
		}, $items);

		$table = new Table($output);
		$table
			->setHeaders(['ID', 'Title', 'Text'])
			->setRows($items);
		$table->render();
	}
}