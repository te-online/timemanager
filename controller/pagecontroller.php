<?php

namespace OCA\TimeManager\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCA\TimeManager\Db\Client;
use OCA\TimeManager\Db\ClientMapper;
use OCA\TimeManager\Db\ProjectMapper;
use OCA\TimeManager\Db\TaskMapper;
use OCA\TimeManager\Db\TimeMapper;
use OCA\TimeManager\Db\CommitMapper;
use OCA\TimeManager\Db\storageHelper;
use OCA\TimeManager\Helper\Cleaner;
use OCA\TimeManager\Helper\UUID;
use OCP\AppFramework\ApiController;
use OC\Security\CSRF\CsrfToken;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\RedirectResponse;
use OCP\AppFramework\Http;

use OCP\IRequest;

class PageController extends Controller {


	/** @var ClientMapper mapper for client entity */
	protected $clientMapper;
	/** @var ProjectMapper mapper for project entity */
	protected $projectMapper;
	/** @var TaskMapper mapper for task entity */
	protected $taskMapper;
	/** @var TimeMapper mapper for time entity */
	protected $timeMapper;
	/** @var ClientMapper mapper for client entity */
	protected $commitMapper;
	/** @var StorageHelper helper for working on the stored data */
	protected $storageHelper;
	/** @var string user ID */
	protected $userId;

	/**
	 * constructor of the controller
	 * @param string $appName the name of the app
	 * @param IRequest $request an instance of the request
	 * @param ClientMapper $clientMapper mapper for client entity
	 * @param ProjectMapper $projectMapper mapper for project entity
	 * @param TaskMapper $taskMapper mapper for task entity
	 * @param TimeMapper $timeMapper mapper for time entity
	 * @param string $userId user id
	 */
	function __construct($appName,
								IRequest $request,
								ClientMapper $clientMapper,
								ProjectMapper $projectMapper,
								TaskMapper $taskMapper,
								TimeMapper $timeMapper,
								CommitMapper $commitMapper,
								$userId
								) {
		parent::__construct($appName, $request);
		$this->clientMapper = $clientMapper;
		$this->projectMapper = $projectMapper;
		$this->taskMapper = $taskMapper;
		$this->timeMapper = $timeMapper;
		$this->commitMapper = $commitMapper;
		$this->userId = $userId;
		$this->storageHelper = new StorageHelper(
			$this->clientMapper,
			$this->projectMapper,
			$this->taskMapper,
			$this->timeMapper,
			$this->commitMapper,
			$userId
		);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function index() {
		return new TemplateResponse('timemanager', 'index');
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function clients() {
		$clients = $this->clientMapper->findByUser($this->userId);
		$token = new CsrfToken(null);
		return new TemplateResponse('timemanager', 'clients', array('clients' => $clients, 'csrf_token' => $token));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function addClient($name='Unnamed', $note='') {
		$this->storageHelper->addOrUpdateObject(array(
			'name' => $name,
			'note' => $note
		), 'clients');
		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.clients'));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function projects() {
		$projects = $this->projectMapper->findByUser($this->userId);
		return new TemplateResponse('timemanager', 'projects', array('projects' => $projects));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function tasks() {
		$tasks = $this->taskMapper->findByUser($this->userId);
		return new TemplateResponse('timemanager', 'tasks', array('tasks' => $tasks));
	}
}