<?php

namespace OCA\Expo\Controller;

use OCA\Expo\Db\Item;
use OCA\Expo\Db\ItemMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

class ApiController extends Controller {

	/** @var ItemMapper mapper for item entity */
	protected $itemMapper;
	/** @var string user ID */
	protected $userId;

	/**
	 * constructor of the controller
	 * @param string $appName the name of the app
	 * @param IRequest $request an instance of the request
	 * @param ItemMapper $itemMapper mapper for item entity
	 * @param string $userId user id
	 */
	function __construct($appName,
								IRequest $request,
								ItemMapper $itemMapper,
								$userId) {
		parent::__construct($appName, $request);
		$this->itemMapper = $itemMapper;
		$this->userId = $userId;
	}

	/**
	 * Convert Item objects to their array representation. Item[] to array[]
	 *
	 * @param Item[] $items items that should be converted
	 * @return array[] items mapped to their array representation
	 */
	private function itemsToArray(array $items) {
		$items = array_map(function(Item $item){
			return $item->toArray();
		}, $items);
		return $items;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return DataResponse
	 */
	function get() {
		$items = $this->itemMapper->findByUser($this->userId);
		$items = $this->itemsToArray($items);
		return new DataResponse($items);
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $title the title of the item
	 * @param string $text the text of the item
	 * @return DataResponse
	 */
	function post($title, $text) {
		$item = new Item();
		$item->setTitle($title);
		$item->setText($text);
		$item->setUserId($this->userId);

		$item = $this->itemMapper->insert($item);
		return new DataResponse($item->toArray());
	}
}