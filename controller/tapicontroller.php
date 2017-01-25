<?php

namespace OCA\TimeManager\Controller;

use OCA\TimeManager\Db\Client;
use OCA\TimeManager\Db\ClientMapper;
// use OCA\TimeManager\Db\StorageHelper;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http;
use OCP\IRequest;

class TApiController extends ApiController {

	/** @var ClientMapper mapper for item entity */
	protected $clientMapper;
	/** @var StorageHelper helper for working on the stored data */
	// protected $storageHelper;
	/** @var string user ID */
	protected $userId;

	/**
	 * constructor of the controller
	 * @param string $appName the name of the app
	 * @param IRequest $request an instance of the request
	 * @param ClientMapper $clientMapper mapper for item entity
	 * @param StorageHelper $storageHelper helper for working on the stored data
	 * @param string $userId user id
	 */
	function __construct($appName,
								IRequest $request,
								ClientMapper $clientMapper,
								// StorageHelper $storageHelper,
								$userId
								) {
		parent::__construct($appName, $request);
		$this->clientMapper = $clientMapper;
		// $this->storageHelper = $storageHelper;
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
	 * @NoCSRFRequired
	 * @CORS
	 *
	 * @param json $data
	 * @return DataResponse
	 */
	function updateObjects($data, $lastCommit) {
		// return new JSONResponse(array('test' => "Hallo Welt"));
		$entities = ["clients", "projects", "tasks", "times"];

		if(!$data && !$lastCommit) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}
		if(empty($lastCommit)) {
			return new DataResponse(json_encode(["error" => "Commit is mandatory."]), Http::STATUS_NOT_ACCEPTABLE);
		}
		if(empty($data)) {
			return new DataResponse(json_encode(["error" => "Data is mandatory."]), Http::STATUS_NOT_ACCEPTABLE);		}

		$noData = true;

		foreach($entities as $entity) {
			if(!$data[$entity] || !$data[$entity]['created'] || !$data[$entity]['updated'] || !$data[$entity]['deleted']) {
				return new DataResponse('Error, '. $entity . ' with created, updated and deleted subarrays is mandatory.', Http::STATUS_NOT_ACCEPTABLE);
			}
			if(count($data[$entity]['created']) > 0 || count($data[$entity]['updated']) > 0 || count($data[$entity]['deleted']) > 0) {
				$noData = false;
			}
		}

		$clientCommit = $postdata['lastCommit'];
		$missions = array();

		if(!$noData) {

			$commit = UUID.v4(); // TODO

			foreach($entities as $entity) {
				// For all entities take the created objects
				$created = $data[$entity]['created'];
				// try to create object, if object already present -> move it to the changed array
				foreach($created as $object) {
					// mark with current commit
					$object['commit'] = $commit;
					// Add or update object here.
					$storageHelper->addOrUpdateObject($object, $entity);
				}
				// For all entities take the changed objects
				$updated = $data[$entity]['updated'];
				// if current object commit <= last commit delivered by client
				foreach($updated as $object) {
					// mark with current commit
					$object['commit'] = $clientCommit;
					$object['desiredCommit'] = $commit;
					// Add or update object here.
					$storageHelper->addOrUpdateObject($object, $entity);
				}
				// For all entities take the deleted objects
				$deleted = $data[$entity]['deleted'];
				// if current object commit <= last commit delivered by client
				foreach($deleted as $object) {
					// mark with current commit
					$object['commit'] = $clientCommit;
					$object['desiredCommit'] = $commit;
					// Add or update object here.
					$storageHelper->maybeDeleteObject($object, $entity);
				}
			}

		}

		$results = array();

		foreach($entities as $entity) {
			$results[] = $cleaner->clean($storageHelper->getObjectsAfterCommit($entity, $clientCommit));
		}

		$lastCommit = $storageHelper->getLatestCommit();
		$response = array( "data" => [] );

		$index = 0;
		foreach($entities as $entity) {
			$response->data[$entity] = $results[index];
			$index++;
		}

		if(!$noData) {
			$response['commit'] = $commit;
			$storageHelper->insertCommit($commit);
		} else {
			$response['commit'] = $lastCommit;
		}

		return new JSONResponse($response);


		// .catch(function(err) {
		// 	console.error(err.stack);
		// 	res.status(500).send(JSON.stringify([{ "error": err.error }], null, 2));
		// });
	}
}