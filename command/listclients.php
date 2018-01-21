<?php

// namespace OCA\TimeManager\Command;

// use OCA\TimeManager\Db\Client;
// use OCA\TimeManager\Db\ClientMapper;
// use Symfony\Component\Console\Command\Command;
// use Symfony\Component\Console\Helper\Table;
// use Symfony\Component\Console\Input\InputArgument;
// use Symfony\Component\Console\Input\InputInterface;
// use Symfony\Component\Console\Output\OutputInterface;

// class ListClients extends Command {
// 	/** @var ClientMapper */
// 	protected $clientMapper;

// 	function __construct(ItemMapper $clientMapper) {
// 		$this->clientMapper = $clientMapper;
// 		parent::__construct();
// 	}

// 	protected function configure() {
// 		$this
// 			->setName('timemanager:listclients')
// 			->setDescription('List timemanager clients by user')
// 			->addArgument(
// 				'user',
// 				InputArgument::REQUIRED,
// 				'owner of timemanager clients'
// 			);
// 	}

// 	protected function execute(InputInterface $input, OutputInterface $output) {
// 		$userId = $input->getArgument('user');

// 		$clients = $this->clientMapper->findByUser($userId);
// 		$clients = array_map(function(Client $client) {
// 			return $client->toArray();
// 		}, $clients);

// 		$table = new Table($output);
// 		$table
// 			->setHeaders(['Uuid', 'Name', 'Note'])
// 			->setRows($clients);
// 		$table->render();
// 	}
// }