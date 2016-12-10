<?php

namespace OCA\TimeManager\Controller;

use OCA\TimeManager\Db\Client;
use OCA\TimeManager\Db\ClientMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

class ApiController extends Controller {

	/** @var ClientMapper mapper for item entity */
	protected $clientMapper;
	/** @var string user ID */
	protected $userId;

	/**
	 * constructor of the controller
	 * @param string $appName the name of the app
	 * @param IRequest $request an instance of the request
	 * @param ClientMapper $clientMapper mapper for item entity
	 * @param string $userId user id
	 */
	function __construct($appName,
								IRequest $request,
								ClientMapper $clientMapper,
								$userId) {
		parent::__construct($appName, $request);
		$this->clientMapper = $clientMapper;
		$this->userId = $userId;
	}

	/**
	 * Convert Item objects to their array representation. Item[] to array[]
	 *
	 * @param Item[] $items items that should be converted
	 * @return array[] items mapped to their array representation
	 */
	private function itemsToArray(array $clients) {
		$clients = array_map(function(Client $client){
			return $client->toArray();
		}, $clients);
		return $clients;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return DataResponse
	 */
	function get() {
		$clients = $this->clientMapper->findByUser($this->userId);
		$clients = $this->itemsToArray($clients);
		return new DataResponse($clients);
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $name the name of the item
	 * @param string $note the note of the item
	 * @return DataResponse
	 */
	function post($name, $note) {
		$client = new Client();
		$client->setName($name);
		$client->setNote($note);
		$client->setUserId($this->userId);

		$client = $this->clientMapper->insert($client);
		return new DataResponse($client->toArray());
	}
}