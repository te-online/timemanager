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

	/**
	 * @NoAdminRequired
	 *
	 * @param json $data
	 * @return DataResponse
	 */
	function updateObjects($postdata) {
		$postdata = json_encode($postdata);
		$entities = ["clients", "projects", "tasks", "times"];

		if(!$postdata) {
			return new DataResponse('404');
		}
		if(empty($postdata->lastCommit)) {
			return new DataResponse('500; ' . json_encode(["error" => "Commit is mandatory."]));
		}
		if(empty($postdata->data)) {
			return new DataResponse('500; ' . json_encode(["error" => "Data is mandatory."]));
		}

		$noData = true;

		foreach($entities as $entity) {
			if(empty($postdata->data[$entity]) || empty($postdata->data[$entity]->created) || empty($postdata->data[$entity]->updated) || empty($postdata->data[$entity]->deleted)) {
				return new DataResponse('500; ' . json_parse(["error" => $entity . " is mandatory."]));
			}
			if(count($postdata->data[$entity]->created) > 0 || count($postdata->data[$entity]->updated) > 0 || count($postdata->data[$entity]->deleted) > 0) {
				$noData = false;
			}
		}

		$clientCommit = $postdata->lastCommit;
		$missions = array();

		if(!$noData) {

			$commit = UUID.v4(); // TODO

			foreach($entities as $entity) {
				// For all entities take the created objects
				$created = $postdata->data[$entity]->created;
				// try to create object, if object already present -> move it to the changed array
				foreach($created as $object) {
					// mark with current commit
					$object['commit'] = $commit;
					// Add or update object here.
					$storageHelper->addOrUpdateObject($object, $entity));
				}
				// For all entities take the changed objects
				$updated = $postdata->data[$entity]->updated;
				// if current object commit <= last commit delivered by client
				foreach($updated as $object) {
					// mark with current commit
					$object['commit'] = $clientCommit;
					$object['desiredCommit'] = $commit;
					// Add or update object here.
					$storageHelper->addOrUpdateObject($object, $entity));
				}
				// For all entities take the deleted objects
				$deleted = $postdata->data[$entity]->deleted;
				// if current object commit <= last commit delivered by client
				foreach($deleted as $object) {
					// mark with current commit
					$object['commit'] = $clientCommit;
					$object['desiredCommit'] = $commit;
					// Add or update object here.
					$storageHelper->maybeDeleteObject($object, $entity));
				}
			}

		}

		$results = array();

		foreach($entities as $entity) {
			$results[] = $cleaner->clean($storageHelper.getObjectsAfterCommit($entity, $clientCommit));
		}

		$lastCommit = $storageHelper->getLatestCommit();
		$response = array( "data" => [] );

		$index = 0;
		foreach($entities as $entity) {
			$response->data[$entity] = $results[index];
			$index++;
		}

		if(!n$oData) {
			$response['commit'] = $commit;
			$storageHelper->insertCommit($commit);
		} else {
			$response['commit'] = $lastCommit;
		}

		return new DataResponse(json_encode($response));


		// .catch(function(err) {
		// 	console.error(err.stack);
		// 	res.status(500).send(JSON.stringify([{ "error": err.error }], null, 2));
		// });
	}
}