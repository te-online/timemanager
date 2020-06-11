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
use OCA\TimeManager\Helper\PHP_Svelte;
use OCP\AppFramework\ApiController;
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
	function __construct(
		$appName,
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
		// Find the latest time entries
		$times = $this->timeMapper->getActiveObjects('start');
		$entries = [];
		$tasks = [];
		if ($times && is_array($times) && count($times) > 0) {
			foreach ($times as $time) {
				// Don't add two times of the same task
				if (in_array($time->getTaskUuid(), $tasks) || count($entries) >= 5) {
					continue;
				}
				// Find details for parents of time entry
				$tasks[] = $time->getTaskUuid();
				$task = $this->taskMapper->getActiveObjectById($time->getTaskUuid());
				$project = $this->projectMapper->getActiveObjectById($task->getProjectUuid());
				$client = $this->clientMapper->getActiveObjectById($project->getClientUuid());
				// Compile a template object
				$entries[] = (object) [
					'time' => $time,
					'task' => $task,
					'project' => $project,
					'client' => $client,
				];
			}
		}

		return new TemplateResponse('timemanager', 'index', [
			'page' => 'index',
			'templates' => [
				'Statistics.svelte' => PHP_Svelte::render_template('Statistics.svelte', []),
			],
			'latest_entries' => $entries,
		]);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function clients() {
		$clients = $this->clientMapper->findActiveForCurrentUser('name');

		$urlGenerator = \OC::$server->getURLGenerator();
		$requestToken = \OC::$server->getSession() ? \OCP\Util::callRegister() : '';

		$form_props = [
			'action' => $urlGenerator->linkToRoute('timemanager.page.clients'),
			'requestToken' => $requestToken,
			'isServer' => true,
		];

		// Enhance clients with additional information.
		if (count($clients) > 0) {
			foreach ($clients as $index => $client) {
				// Number of projects
				$clients[$index]->project_count = $this->clientMapper->countProjects($client->getUuid());
				// Sum up client times
				$clients[$index]->hours = $this->clientMapper->getHours($client->getUuid());
			}
		}

		$form_props = [
			'action' => $urlGenerator->linkToRoute('timemanager.page.clients'),
			'clientEditorButtonCaption' => 'Add client',
			'clientEditorCaption' => 'New client',
		];

		return new TemplateResponse('timemanager', 'clients', [
			'clients' => $clients,
			'requesttoken' => $requestToken,
			'templates' => [
				'ClientEditor.svelte' => PHP_Svelte::render_template('ClientEditor.svelte', $form_props),
			],
			'store' => json_encode(array_merge($form_props, ['isServer' => false])),
			'page' => 'clients',
		]);
	}

	/**
	 * @NoAdminRequired
	 */
	function addClient($name = 'Unnamed', $note = '') {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		$this->storageHelper->addOrUpdateObject(
			[
				'name' => $name,
				'note' => $note,
				'commit' => $commit,
			],
			'clients'
		);
		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.clients'));
	}

	/**
	 * @NoAdminRequired
	 */
	function deleteClient($uuid) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Get client
		$client = $this->clientMapper->getObjectById($uuid);
		// Delete object
		$client->setChanged(date('Y-m-d H:i:s'));
		$client->setCommit($commit);
		$client->setStatus('deleted');
		$this->clientMapper->update($client);

		// Delete children
		$this->clientMapper->deleteChildrenForEntityById($uuid, $commit);

		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.clients'));
	}

	/**
	 * @NoAdminRequired
	 */
	function editClient($uuid, $name = 'Unnamed', $note = '') {
		$commit = UUID::v4();
		$client = $this->clientMapper->getActiveObjectById($uuid);
		if ($client) {
			$this->storageHelper->insertCommit($commit);
			$this->storageHelper->addOrUpdateObject(
				[
					'uuid' => $uuid,
					'name' => $name,
					'note' => $note,
					'commit' => $client->getCommit(),
					'desiredCommit' => $commit,
				],
				'clients'
			);
			$urlGenerator = \OC::$server->getURLGenerator();
		}
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.projects') . '?client=' . $uuid);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function projects($client = null) {
		$clients = $this->clientMapper->findActiveForCurrentUser();
		if ($client) {
			$projects = $this->projectMapper->getActiveObjectsByAttributeValue('client_uuid', $client);
			$client_data = $this->clientMapper->getActiveObjectsByAttributeValue('uuid', $client, 'name');
			// Sum up client times
			if (count($client_data) === 1) {
				$client_data[0]->hours = $this->clientMapper->getHours($client_data[0]->getUuid());
			}
		} else {
			$projects = $this->projectMapper->findActiveForCurrentUser();
		}

		// Enhance projects with additional information.
		if (count($projects) > 0) {
			foreach ($projects as $index => $project) {
				// Count tasks
				$projects[$index]->task_count = $this->projectMapper->countTasks($project->getUuid());
				// Sum up project times
				$projects[$index]->hours = $this->projectMapper->getHours($project->getUuid());
			}
		}

		$urlGenerator = \OC::$server->getURLGenerator();
		$requestToken = \OC::$server->getSession() ? \OCP\Util::callRegister() : '';

		$client_uuid = isset($client_data) && count($client_data) > 0 ? $client_data[0]->getUuid() : '';
		$client_name = isset($client_data) && count($client_data) > 0 ? $client_data[0]->getName() : '';

		$form_props = [
			'action' => $urlGenerator->linkToRoute('timemanager.page.projects') . '?client=' . $client_uuid,
			'editAction' => $urlGenerator->linkToRoute('timemanager.page.clients'),
			'requestToken' => $requestToken,
			'clientName' => $client_name,
			'clientEditorButtonCaption' => 'Edit client',
			'clientEditorCaption' => 'Edit client',
			'clientUuid' => $client_uuid,
			'projectEditorButtonCaption' => 'Add project',
			'projectEditorCaption' => 'New project',
			'editClientData' => [
				'name' => $client_name,
				'note' => isset($client_data) && count($client_data) > 0 ? $client_data[0]->getNote() : '',
			],
			'deleteAction' => $urlGenerator->linkToRoute('timemanager.page.clients') . '/delete',
			'deleteUuid' => $client_uuid,
			'deleteButtonCaption' => 'Delete client',
			'deleteItemName' => 'the client ' . $client_name . ' and all associated projects, tasks and time entries',
			'isServer' => true,
		];

		return new TemplateResponse('timemanager', 'projects', [
			'projects' => $projects,
			'client' => isset($client_data) && count($client_data) > 0 ? $client_data[0] : null,
			'clients' => $clients,
			'requesttoken' => $requestToken,
			'store' => json_encode(array_merge($form_props, ['isServer' => false])),
			'templates' => [
				'ProjectEditor.svelte' => PHP_Svelte::render_template('ProjectEditor.svelte', $form_props),
				'DeleteButton.svelte' => PHP_Svelte::render_template('DeleteButton.svelte', $form_props),
			],
			'page' => 'projects',
		]);
	}

	/**
	 * @NoAdminRequired
	 */
	function addProject($name, $client) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		$this->storageHelper->addOrUpdateObject(
			[
				'name' => $name,
				'client_uuid' => $client,
				'commit' => $commit,
			],
			'projects'
		);
		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.projects') . '?client=' . $client);
	}

	/**
	 * @NoAdminRequired
	 */
	function deleteProject($uuid, $client) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Get client
		$project = $this->projectMapper->getObjectById($uuid);
		if ($project) {
			$client = $client ? $client : $project->getClientUuid();
			// Delete object
			$project->setChanged(date('Y-m-d H:i:s'));
			$project->setCommit($commit);
			$project->setStatus('deleted');
			$this->projectMapper->update($project);

			// Delete children
			$this->projectMapper->deleteChildrenForEntityById($uuid, $commit);
		}

		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.projects') . '?client=' . $client);
	}

	/**
	 * @NoAdminRequired
	 */
	function editProject($uuid, $name = 'Unnamed') {
		$commit = UUID::v4();
		$project = $this->projectMapper->getActiveObjectById($uuid);
		if ($project) {
			$this->storageHelper->insertCommit($commit);
			$this->storageHelper->addOrUpdateObject(
				[
					'uuid' => $uuid,
					'name' => $name,
					'commit' => $project->getCommit(),
					'desiredCommit' => $commit,
				],
				'projects'
			);
			$urlGenerator = \OC::$server->getURLGenerator();
		}
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.tasks') . '?project=' . $uuid);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function tasks($project) {
		$clients = $this->clientMapper->findActiveForCurrentUser();
		$projects = $this->projectMapper->findActiveForCurrentUser();
		if ($project) {
			$tasks = $this->taskMapper->getActiveObjectsByAttributeValue('project_uuid', $project);
			$project_data = $this->projectMapper->getActiveObjectsByAttributeValue('uuid', $project);
			$client_data = $this->clientMapper->getActiveObjectsByAttributeValue(
				'uuid',
				$project_data[0]->getClientUuid(),
				'name'
			);
			// Sum up project times
			if (count($project_data) === 1) {
				$project_data[0]->hours = $this->projectMapper->getHours($project_data[0]->getUuid());
			}
			// Sum up client times
			if (count($client_data) === 1) {
				$client_data[0]->hours = $this->clientMapper->getHours($client_data[0]->getUuid());
			}
		} else {
			$tasks = $this->taskMapper->findActiveForCurrentUser();
		}

		// Enhance tasks with additional information.
		if (count($tasks) > 0) {
			foreach ($tasks as $index => $task) {
				// Sum up project times
				$tasks[$index]->hours = $this->taskMapper->getHours($task->getUuid());
			}
		}

		$urlGenerator = \OC::$server->getURLGenerator();
		$requestToken = \OC::$server->getSession() ? \OCP\Util::callRegister() : '';

		$project_uuid = isset($project_data) && count($project_data) > 0 ? $project_data[0]->getUuid() : '';
		$project_name = isset($project_data) && count($project_data) > 0 ? $project_data[0]->getName() : '';

		$form_props = [
			'action' => $urlGenerator->linkToRoute('timemanager.page.tasks') . '?project=' . $project_uuid,
			'editAction' => $urlGenerator->linkToRoute('timemanager.page.projects'),
			'requestToken' => $requestToken,
			'clientName' => isset($client_data) && count($client_data) > 0 ? $client_data[0]->getName() : '',
			'projectName' => $project_name,
			'projectEditorButtonCaption' => 'Edit project',
			'projectEditorCaption' => 'Edit project',
			'projectUuid' => $project_uuid,
			'taskEditorButtonCaption' => 'Add task',
			'taskEditorCaption' => 'New task',
			'deleteAction' => $urlGenerator->linkToRoute('timemanager.page.projects') . '/delete',
			'deleteUuid' => $project_uuid,
			'deleteButtonCaption' => 'Delete project',
			'deleteItemName' => 'the project ' . $project_name . ' and all associated tasks and time entries',
			'editProjectData' => [
				'name' => $project_name,
			],
			'isServer' => true,
		];

		return new TemplateResponse('timemanager', 'tasks', [
			'tasks' => $tasks,
			'project' => isset($project_data) && count($project_data) > 0 ? $project_data[0] : null,
			'client' => isset($client_data) && count($client_data) > 0 ? $client_data[0] : null,
			'projects' => $projects,
			'clients' => $clients,
			'requesttoken' => $requestToken,
			'store' => json_encode(array_merge($form_props, ['isServer' => false])),
			'templates' => [
				'TaskEditor.svelte' => PHP_Svelte::render_template('TaskEditor.svelte', $form_props),
				'DeleteButton.svelte' => PHP_Svelte::render_template('DeleteButton.svelte', $form_props),
			],
			'page' => 'tasks',
		]);
	}

	/**
	 * @NoAdminRequired
	 */
	function addTask($name, $project) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		$this->storageHelper->addOrUpdateObject(
			[
				'name' => $name,
				'project_uuid' => $project,
				'commit' => $commit,
			],
			'tasks'
		);
		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.tasks') . '?project=' . $project);
	}

	/**
	 * @NoAdminRequired
	 */
	function deleteTask($uuid, $project) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Get task
		$task = $this->taskMapper->getObjectById($uuid);
		if ($task) {
			$project = $project ? $project : $task->getProjectUuid();
			// Delete object
			$task->setChanged(date('Y-m-d H:i:s'));
			$task->setCommit($commit);
			$task->setStatus('deleted');
			$this->taskMapper->update($task);

			// Delete children
			$this->taskMapper->deleteChildrenForEntityById($uuid, $commit);
		}

		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.tasks') . '?project=' . $project);
	}

	/**
	 * @NoAdminRequired
	 */
	function editTask($uuid, $name = 'Unnamed') {
		$commit = UUID::v4();
		$task = $this->taskMapper->getActiveObjectById($uuid);
		if ($task) {
			$this->storageHelper->insertCommit($commit);
			$this->storageHelper->addOrUpdateObject(
				[
					'uuid' => $uuid,
					'name' => $name,
					'commit' => $task->getCommit(),
					'desiredCommit' => $commit,
				],
				'tasks'
			);
			$urlGenerator = \OC::$server->getURLGenerator();
		}
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $uuid);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function times($task) {
		$clients = $this->clientMapper->findActiveForCurrentUser();
		$projects = $this->projectMapper->findActiveForCurrentUser();
		$tasks = $this->taskMapper->findActiveForCurrentUser();
		if ($task) {
			$times = $this->timeMapper->getActiveObjectsByAttributeValue('task_uuid', $task, 'start');
			$task_data = $this->taskMapper->getActiveObjectsByAttributeValue('uuid', $task);
			$project_data = $this->projectMapper->getActiveObjectsByAttributeValue('uuid', $task_data[0]->getProjectUuid());
			$client_data = $this->clientMapper->getActiveObjectsByAttributeValue(
				'uuid',
				$project_data[0]->getClientUuid(),
				'name'
			);
			// Sum up task times
			if (count($task_data) === 1) {
				$task_data[0]->hours = $this->taskMapper->getHours($task_data[0]->getUuid());
			}
			// Sum up project times
			if (count($project_data) === 1) {
				$project_data[0]->hours = $this->projectMapper->getHours($project_data[0]->getUuid());
			}
			// Sum up client times
			if (count($client_data) === 1) {
				$client_data[0]->hours = $this->clientMapper->getHours($client_data[0]->getUuid());
			}
		} else {
			$times = $this->timeMapper->findActiveForCurrentUser();
		}

		$urlGenerator = \OC::$server->getURLGenerator();
		$requestToken = \OC::$server->getSession() ? \OCP\Util::callRegister() : '';

		$task_uuid = isset($task_data) && count($task_data) > 0 ? $task_data[0]->getUuid() : '';
		$task_name = isset($task_data) && count($task_data) > 0 ? $task_data[0]->getName() : '';

		$form_props = [
			'action' => $urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $task_uuid,
			'editAction' => $urlGenerator->linkToRoute('timemanager.page.tasks'),
			'requestToken' => $requestToken,
			'clientName' => isset($client_data) && count($client_data) > 0 ? $client_data[0]->getName() : '',
			'projectName' => isset($project_data) && count($project_data) > 0 ? $project_data[0]->getName() : '',
			'taskName' => $task_data && count($task_data) > 0 ? $task_data[0]->getName() : '',
			'taskUuid' => $taskUuid,
			'initialDate' => date('Y-m-d'),
			'taskEditorButtonCaption' => 'Edit task',
			'taskEditorCaption' => 'Edit task',
			'taskUuid' => $task_uuid,
			'editTaskData' => [
				'name' => $task_name,
			],
			'deleteAction' => $urlGenerator->linkToRoute('timemanager.page.tasks') . '/delete',
			'deleteUuid' => $task_uuid,
			'deleteButtonCaption' => 'Delete task',
			'deleteItemName' => 'the task ' . $task_name . ' and all associated time entries',
			'deleteTimeEntryAction' => $urlGenerator->linkToRoute('timemanager.page.times') . '/delete',
			'isServer' => true,
		];

		return new TemplateResponse('timemanager', 'times', [
			'times' => $times,
			'task' => $task_data && count($task_data) > 0 ? $task_data[0] : null,
			'project' => $project_data && count($project_data) > 0 ? $project_data[0] : null,
			'client' => $client_data && count($client_data) > 0 ? $client_data[0] : null,
			'tasks' => $tasks,
			'projects' => $projects,
			'clients' => $clients,
			'requesttoken' => $requestToken,
			'store' => json_encode(array_merge($form_props, ['isServer' => false])),
			'templates' => [
				'TimeEditor.svelte' => PHP_Svelte::render_template('TimeEditor.svelte', $form_props),
				'DeleteButton.svelte' => PHP_Svelte::render_template('DeleteButton.svelte', $form_props),
			],
			'page' => 'times',
		]);
	}

	/**
	 * @NoAdminRequired
	 */
	function addTime($duration, $date, $note, $task) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Convert 1,25 to 1.25
		$duration = str_replace(',', '.', $duration);
		// Cast to float
		$duration = (float) $duration;
		// Calculate start and end from duration
		if (!empty($date)) {
			// Add 24 hours to make it end of the day.
			$end = date('Y-m-d H:i:s', strtotime($date) + 60 * 60 * 24);
		} else {
			$end = date('Y-m-d H:i:s');
		}
		$start = date('Y-m-d H:i:s', strtotime($end) - 60 * 60 * $duration);
		$this->storageHelper->addOrUpdateObject(
			[
				'name' => $name,
				'start' => $start, // now - duration
				'end' => $end, // now
				'task_uuid' => $task,
				'commit' => $commit,
				'note' => $note,
			],
			'times'
		);
		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $task);
	}

	/**
	 * @NoAdminRequired
	 */
	function deleteTime($uuid, $task) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Get client
		$time = $this->timeMapper->getObjectById($uuid);
		// Delete object
		$time->setChanged(date('Y-m-d H:i:s'));
		$time->setCommit($commit);
		$time->setStatus('deleted');
		$this->timeMapper->update($time);

		// Delete children
		$this->timeMapper->deleteChildrenForEntityById($uuid, $commit);

		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $task);
	}

	/**
	 * @NoAdminRequired
	 */
	function editTime($uuid, $duration, $date, $note) {
		$commit = UUID::v4();
		$time = $this->timeMapper->getActiveObjectById($uuid);
		if ($time) {
			$this->storageHelper->insertCommit($commit);
			// Convert 1,25 to 1.25
			$duration = str_replace(',', '.', $duration);
			// Cast to float
			$duration = (float) $duration;
			// @TODO: Time range needs to be edited properly
			// Calculate start and end from duration
			if (!empty($date)) {
				// Add 24 hours to make it end of the day.
				$end = date('Y-m-d H:i:s', strtotime($date) + 60 * 60 * 24);
			} else {
				$end = date('Y-m-d H:i:s');
			}
			$start = date('Y-m-d H:i:s', strtotime($end) - 60 * 60 * $duration);
			$this->storageHelper->addOrUpdateObject(
				[
					'name' => $name,
					'start' => $start, // now - duration
					'end' => $end, // now
					'commit' => $time->getCommit(),
					'note' => $note,
					'desiredCommit' => $commit,
				],
				'times'
			);
			$urlGenerator = \OC::$server->getURLGenerator();
		}
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $time->task_uuid);
	}

	/**
	 * @NoAdminRequired
	 */
	function payTime($uuid, $task) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Get client
		$time = $this->timeMapper->getObjectById($uuid);
		// Adjust payment status object
		$time->setChanged(date('Y-m-d H:i:s'));
		$time->setCommit($commit);
		$time->setPaymentStatus('paid');
		$this->timeMapper->update($time);

		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $task);
	}

	/**
	 * @NoAdminRequired
	 */
	function unpayTime($uuid, $task) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Get client
		$time = $this->timeMapper->getObjectById($uuid);
		// Adjust payment status
		$time->setChanged(date('Y-m-d H:i:s'));
		$time->setCommit($commit);
		$time->setPaymentStatus('');
		$this->timeMapper->update($time);

		$urlGenerator = \OC::$server->getURLGenerator();
		return new RedirectResponse($urlGenerator->linkToRoute('timemanager.page.times') . '?task=' . $task);
	}
}
