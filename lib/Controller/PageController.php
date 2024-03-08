<?php

namespace OCA\TimeManager\Controller;

use OC\Remote\Api\NotFoundException;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\DataDownloadResponse;
use OCA\TimeManager\Db\ClientMapper;
use OCA\TimeManager\Db\ProjectMapper;
use OCA\TimeManager\Db\TaskMapper;
use OCA\TimeManager\Db\TimeMapper;
use OCA\TimeManager\Db\CommitMapper;
use OCA\TimeManager\Db\Share;
use OCA\TimeManager\Db\ShareMapper;
use OCA\TimeManager\Db\StorageHelper;
use OCA\TimeManager\Helper\UUID;
use OCA\TimeManager\Helper\PHP_Svelte;
use OCA\TimeManager\Helper\ArrayToCSV;
use OCA\TimeManager\Helper\ISODate;
use OCP\AppFramework\Http\RedirectResponse;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\IRequest;
use OCP\IConfig;
use OCP\ISession;
use OCP\IURLGenerator;
use OCP\IUserManager;

class PageController extends Controller {
	/** @var ClientMapper mapper for client entity */
	protected $clientMapper;
	/** @var ProjectMapper mapper for project entity */
	protected $projectMapper;
	/** @var TaskMapper mapper for task entity */
	protected $taskMapper;
	/** @var TimeMapper mapper for time entity */
	protected $timeMapper;
	/** @var CommitMapper mapper for client entity */
	protected $commitMapper;
	/** @var ShareMapper mapper for share entity */
	protected $shareMapper;
	/** @var StorageHelper helper for working on the stored data */
	protected $storageHelper;
	/** @var string user ID */
	protected $userId;
	/** @var IConfig */
	private $config;
	/** @var IUserManager */
	private $userManager;
	/** @var IGroupManager */
	private $groupManager;
	/** @var string  */
	private $fullDateFormat;
	/** @var IURLGenerator */
	private $urlGenerator;
	/** @var IL10N */
	private $l;
	/** @var string */
	private $requestToken;

	/**
	 * constructor of the controller
	 * @param string $appName the name of the app
	 * @param IRequest $request an instance of the request
	 * @param ClientMapper $clientMapper mapper for client entity
	 * @param ProjectMapper $projectMapper mapper for project entity
	 * @param TaskMapper $taskMapper mapper for task entity
	 * @param TimeMapper $timeMapper mapper for time entity
	 * @param IURLGenerator $urlGenerator url generator
	 * @param IL10N $l translation
	 * @param ISession $session session
	 * @param string $userId user id
	 */
	function __construct(
		$appName,
		$userId,
		IRequest $request,
		ClientMapper $clientMapper,
		ProjectMapper $projectMapper,
		TaskMapper $taskMapper,
		TimeMapper $timeMapper,
		CommitMapper $commitMapper,
		ShareMapper $shareMapper,
		IConfig $config,
		IUserManager $userManager,
		IGroupManager $groupManager,
		IURLGenerator $urlGenerator,
		IL10N $l,
		ISession $session
	) {
		parent::__construct($appName, $request);
		$this->clientMapper = $clientMapper;
		$this->projectMapper = $projectMapper;
		$this->taskMapper = $taskMapper;
		$this->timeMapper = $timeMapper;
		$this->commitMapper = $commitMapper;
		$this->shareMapper = $shareMapper;
		$this->userId = $userId;
		$this->config = $config;
		$this->userManager = $userManager;
		$this->groupManager = $groupManager;
		$this->storageHelper = new StorageHelper(
			$this->clientMapper,
			$this->projectMapper,
			$this->taskMapper,
			$this->timeMapper,
			$this->commitMapper,
			$this->shareMapper,
			$this->config,
			(string) $userId
		);
		$this->urlGenerator = $urlGenerator;
		$this->l = $l;
		$this->requestToken = $session ? \OCP\Util::callRegister() : "";

		$this->fullDateFormat = \Punic\Calendar::getDateFormat(
			"full",
			$this->config->getUserValue($this->userId, "core", "locale")
		);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function index(string $userFilter = "") {
		// Find the latest time entries
		$times = $this->timeMapper->findActiveForCurrentUser("start", true, "DESC");
		$all_clients = $this->clientMapper->findActiveForCurrentUser("name", true);
		$all_projects = $this->projectMapper->findActiveForCurrentUser("name", true);
		$all_tasks = $this->taskMapper->findActiveForCurrentUser("name", true);

		$times = $this->storageHelper->resolveAuthorDisplayNamesForTimes($times, $this->userManager);
		$latestEntries = $this->storageHelper->getLatestTimeEntriesFromAllTimeEntries(
			$times,
			5,
			$userFilter && strlen($userFilter) > 0 ? explode(",", $userFilter) : []
		);
		$latestSearchEntries = $this->storageHelper->getLatestTimeEntriesFromAllTimeEntries($times, 100);

		$sharedTimeEntries = array_filter($times, function ($entry) {
			return !$entry->current_user_is_author;
		});
		$hasSharedTimeEntries = count($sharedTimeEntries) > 0;

		return new TemplateResponse("timemanager", "index", [
			"page" => "index",
			"templates" => [
				"Statistics.svelte" => PHP_Svelte::render_template("Statistics.svelte", []),
			],
			"latestEntries" => $latestEntries,
			"hasSharedTimeEntries" => $hasSharedTimeEntries,
			"store" => json_encode([
				"clients" => array_map(function ($oneClient) {
					$oneClient = $oneClient->toArray();
					return ["value" => $oneClient["uuid"], "label" => $oneClient["name"]];
				}, $all_clients),
				"projects" => array_map(function ($oneProject) {
					$oneProject = $oneProject->toArray();
					return [
						"value" => $oneProject["uuid"],
						"label" => $oneProject["name"],
						"clientUuid" => $oneProject["client_uuid"],
					];
				}, $all_projects),
				"tasks" => array_map(function ($oneTask) {
					$oneTask = $oneTask->toArray();
					return ["value" => $oneTask["uuid"], "label" => $oneTask["name"], "projectUuid" => $oneTask["project_uuid"]];
				}, $all_tasks),
				"action" => $this->urlGenerator->linkToRoute("timemanager.page.times"),
				"statsApiUrl" => $this->urlGenerator->linkToRoute("timemanager.t_api.getHoursInPeriodStats"),
				"settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
				"settings" => [
					"handle_conflicts" =>
					$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") ===
						"handle_conflicts",
					"fullDateFormat" => $this->fullDateFormat,
				],
				"requestToken" => $this->requestToken,
				"isServer" => true,
				"latestSearchEntries" => array_map(function ($latestSearchEntry) {
					return [
						"time" => $latestSearchEntry->time->toArray(),
						"task" => $latestSearchEntry->task->toArray(),
						"project" => $latestSearchEntry->project->toArray(),
						"client" => $latestSearchEntry->client->toArray(),
					];
				}, $latestSearchEntries),
			]),
		]);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function reports(
		string $clients = null,
		string $projects = null,
		string $tasks = null,
		string $status = null,
		string $start = "",
		string $end = "",
		string $format = "none",
		string $userFilter = ""
	) {
		$start_of_month = new \DateTime("first day of this month");
		$end_of_month = new \DateTime("last day of this month");
		// Fall back to default if date is invalid
		if (!ISODate::isDate($start)) {
			$start = $start_of_month->format("Y-m-d");
		}
		if (!ISODate::isDate($end)) {
			$end = $end_of_month->format("Y-m-d");
		}

		$all_clients = $this->clientMapper->findActiveForCurrentUser("name", true);
		$all_projects = $this->projectMapper->findActiveForCurrentUser("name", true);
		$all_tasks = $this->taskMapper->findActiveForCurrentUser("name", true);

		// Get possible task ids to filters for
		$filter_tasks = $this->storageHelper->getTaskListFromFilters($clients, $projects, $tasks, true);

		$times = $this->timeMapper->findForReport($start, $end, $status, $filter_tasks, true);

		$includedAuthors = $userFilter && strlen($userFilter) > 0 ? explode(",", $userFilter) : [];

		// Group times by client
		$times_grouped_by_client = [];
		$hours_total = 0;
		$all_time_entries = [];
		if ($times && is_array($times) && count($times) > 0) {
			$times = $this->storageHelper->resolveAuthorDisplayNamesForTimes($times, $this->userManager);
			foreach ($times as $time) {
				// Find details for parents of time entry
				$task = $this->taskMapper->getActiveObjectById($time->getTaskUuid(), true);
				if (!$task) {
					continue;
				}
				$project = $this->projectMapper->getActiveObjectById($task->getProjectUuid(), true);
				if (!$project) {
					continue;
				}
				$client = $this->clientMapper->getActiveObjectById($project->getClientUuid(), true);
				if (!$client) {
					continue;
				}
				// Filter for author
				if ($includedAuthors && is_array($includedAuthors) && !in_array($time->getUserId(), $includedAuthors)) {
					continue;
				}
				// Compile a template object
				if (!isset($times_grouped_by_client[$client->getUuid()])) {
					$times_grouped_by_client[$client->getUuid()] = (object) [
						"client" => $client,
						"entries" => [],
						"totalHours" => 0,
						"percentageHours" => 0,
					];
				}
				$times_grouped_by_client[$client->getUuid()]->entries[] = (object) [
					"time" => $time,
					"project" => $project,
					"task" => $task,
				];
				$hours = $time->getDurationInHours();
				$times_grouped_by_client[$client->getUuid()]->totalHours += $hours;
				$hours_total += $hours;
				// Prepare a row for the CSV
				if ($format === "csv") {
					$all_time_entries[] = [
						"start" => $time->getStart(),
						"end" => $time->getEnd(),
						"note" => $time->getNote(),
						"status" => strtolower($time->getPaymentStatus()) === "paid" ? "resolved" : "unresolved",
						"duration" => $hours,
						"client" => $client->getName(),
						"project" => $project->getName(),
						"task" => $task->getName(),
						"author" => $time->author_display_name,
					];
				}
			}
		}
		// Apply total to clients
		foreach ($times_grouped_by_client as $times_group) {
			$times_grouped_by_client[$times_group->client->getUuid()]->percentageHours =
				round($times_group->totalHours / $hours_total, 2) * 100;
		}

		if ($format === "csv") {
			// Prepare filename with daterange
			$filename = $start === $end ? $this->l->t("report_%s.csv", [$start]) : $this->l->t("report_%s_%s.csv", [$start, $end]);
			// Download as CSV
			return new DataDownloadResponse(ArrayToCSV::convert($all_time_entries), $filename, "text/csv");
		} else {
			$store = [
				"clients" => array_map(function ($oneClient) {
					$oneClient = $oneClient->toArray();
					return ["value" => $oneClient["uuid"], "label" => $oneClient["name"]];
				}, $all_clients),
				"projects" => array_map(function ($oneProject) {
					$oneProject = $oneProject->toArray();
					return [
						"value" => $oneProject["uuid"],
						"label" => $oneProject["name"],
						"clientUuid" => $oneProject["client_uuid"],
					];
				}, $all_projects),
				"tasks" => array_map(function ($oneTask) {
					$oneTask = $oneTask->toArray();
					return ["value" => $oneTask["uuid"], "label" => $oneTask["name"], "projectUuid" => $oneTask["project_uuid"]];
				}, $all_tasks),
				"action" => $this->urlGenerator->linkToRoute("timemanager.page.reports"),
				"statsApiUrl" => $this->urlGenerator->linkToRoute("timemanager.t_api.getHoursInPeriodStats"),
				"requestToken" => $this->requestToken,
				"isServer" => true,
				"startOfMonth" => $start_of_month->format("Y-m-d"),
				"endOfMonth" => $end_of_month->format("Y-m-d"),
				"start" => $start,
				"end" => $end,
				"controls" => false,
				"settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
				"settings" => [
					"handle_conflicts" =>
					$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") ===
						"handle_conflicts",
					"fullDateFormat" => $this->fullDateFormat,
				],
				"includeShared" => true,
			];

			return new TemplateResponse("timemanager", "reports", [
				"clients" => $clients,
				"projects" => $projects,
				"tasks" => $tasks,
				"start" => $start,
				"end" => $end,
				"times" => $times,
				"times_grouped_by_client" => $times_grouped_by_client,
				"hoursTotal" => $hours_total,
				"numEntries" => count($times),
				"templates" => [
					"Filters.svelte" => PHP_Svelte::render_template("Filters.svelte", $store),
					"Timerange.svelte" => PHP_Svelte::render_template("Timerange.svelte", $store),
				],
				"store" => json_encode($store),
				"page" => "reports",
			]);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function clients() {
		$clients = $this->clientMapper->findActiveForCurrentUser("name", true);

		// Enhance clients with additional information.
		if (count($clients) > 0) {
			foreach ($clients as $index => $client) {
				// Number of projects
				$clients[$index]->project_count = $this->clientMapper->countProjects($client->getUuid());
				// Sum up client times
				$clients[$index]->hours = $this->clientMapper->getHours($client->getUuid());
				// Get sharees, if user has shared this client
				$clients[$index]->sharees = array_map(function ($share) {
					$shareArray = $share->toArray($this->userManager, $this->groupManager);

					return $shareArray;
				}, $this->shareMapper->findShareesForClient($client->getUuid()));
				// Get share author, if client is shared with current user
				$sharedByList = $this->shareMapper->findSharerForClient($client->getUuid());
				$sharedBy = null;
				if (count($sharedByList) > 0) {
					$sharedBy = $sharedByList[0]->toArray($this->userManager, $this->groupManager);
				}
				$clients[$index]->sharedBy = $sharedBy;
			}
		}

		$form_props = [
			"action" => $this->urlGenerator->linkToRoute("timemanager.page.clients"),
			"settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
			"settings" => [
				"handle_conflicts" =>
				$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") === "handle_conflicts",
				"fullDateFormat" => $this->fullDateFormat,
			],
			"clientEditorButtonCaption" => $this->l->t("Add client"),
			"clientEditorCaption" => $this->l->t("New client"),
		];

		return new TemplateResponse("timemanager", "clients", [
			"clients" => $clients,
			"requesttoken" => $this->requestToken,
			"templates" => [
				"ClientEditor.svelte" => PHP_Svelte::render_template("ClientEditor.svelte", $form_props),
			],
			"store" => json_encode(array_merge($form_props, ["isServer" => false])),
			"page" => "clients",
		]);
	}

	/**
	 * @NoAdminRequired
	 */
	function addClient($name = "Unnamed", $note = "") {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		$this->storageHelper->addOrUpdateObject(
			[
				"name" => $name,
				"note" => $note,
				"commit" => $commit,
			],
			"clients"
		);
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.clients"));
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
		$client->setChanged(date("Y-m-d H:i:s"));
		$client->setCommit($commit);
		$client->setStatus("deleted");
		$this->clientMapper->update($client);

		// Delete children
		$this->clientMapper->deleteChildrenForEntityById($uuid, $commit);

		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.clients"));
	}

	/**
	 * @NoAdminRequired
	 */
	function editClient($uuid, $name = "Unnamed", $note = "") {
		$commit = UUID::v4();
		$client = $this->clientMapper->getActiveObjectById($uuid);
		if ($client) {
			$this->storageHelper->insertCommit($commit);
			$this->storageHelper->addOrUpdateObject(
				[
					"uuid" => $uuid,
					"name" => $name,
					"note" => $note,
					"commit" => $client->getCommit(),
					"desiredCommit" => $commit,
				],
				"clients"
			);
		}
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.projects") . "?client=" . $uuid);
	}

	/**
	 * @NoAdminRequired
	 */
	function addClientShare($client_uuid, $user_id, $group_id) {
		$client = $this->clientMapper->getActiveObjectById($client_uuid);
		// User must be author if we can get the client
		if ($client) {
			$today = date("Y-m-d H:i:s");
			$share = new Share();
			$share->setUuid(UUID::v4());
			$share->setCreated($today);
			$share->setChanged($today);
			$share->setObjectUuid($client_uuid);
			$share->setEntityType("client");
			$share->setAuthorUserId($this->userId);

			if ($user_id) {
				$share->setRecipientId($user_id);
				$share->setRecipientType("user");
				$this->shareMapper->insert($share);
			} elseif ($group_id) {
				$share->setRecipientId($group_id);
				$share->setRecipientType("group");
				$this->shareMapper->insert($share);
			}
		}

		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.projects") . "?client=" . $client_uuid);
	}

	/**
	 * @NoAdminRequired
	 */
	function deleteClientShare($uuid, $client_uuid) {
		$shares = $this->shareMapper->findByUuid($uuid);
		if (count($shares) > 0) {
			$this->shareMapper->delete($shares[0]);
		}

		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.projects") . "?client=" . $client_uuid);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function projects($client = null) {
		$clients = $this->clientMapper->findActiveForCurrentUser("created", true);
		$isSingleClient = false;
		if ($client) {
			$isSingleClient = true;
			$projects = $this->projectMapper->getActiveObjectsByAttributeValue("client_uuid", $client, "created", true);
			$client_data = $this->clientMapper->getActiveObjectsByAttributeValue("uuid", $client, "name", "created", true);
			// Sum up client times
			if (count($client_data) === 1) {
				$client_data[0]->hours = $this->clientMapper->getHours($client_data[0]->getUuid());
			}
		} else {
			$projects = $this->projectMapper->findActiveForCurrentUser("created", true);
		}

		// Enhance projects with additional information.
		if (count($projects) > 0) {
			foreach ($projects as $index => $project) {
				// Count tasks
				$projects[$index]->task_count = $this->projectMapper->countTasks($project->getUuid());
				// Sum up project times
				$projects[$index]->hours = $this->projectMapper->getHours($project->getUuid());
				// Skip if not showing "all" list
				if ($isSingleClient) {
					continue;
				}
				// Look up client for project
				$parentClient = $this->clientMapper->getActiveObjectById($project->getClientUuid(), true);
				if (!$parentClient) {
					continue;
				}
				$projects[$index]->client = $parentClient;
				// Get sharees, if user has shared this client
				$projects[$index]->sharees = array_map(function ($share) {
					$shareArray = $share->toArray($this->userManager, $this->groupManager);

					return $shareArray;
				}, $this->shareMapper->findShareesForClient($parentClient->getUuid()));
				// Get share author, if client is shared with current user
				$sharedByList = $this->shareMapper->findSharerForClient($parentClient->getUuid());
				$sharedBy = null;
				if (count($sharedByList) > 0) {
					$sharedBy = $sharedByList[0]->toArray($this->userManager, $this->groupManager);
				}
				$projects[$index]->sharedBy = $sharedBy;
			}
		}

		$client_uuid = isset($client_data) && count($client_data) > 0 ? $client_data[0]->getUuid() : "";
		$client_name = isset($client_data) && count($client_data) > 0 ? $client_data[0]->getName() : "";

		$sharees = array_map(function ($share) {
			$shareArray = $share->toArray($this->userManager, $this->groupManager);

			return $shareArray;
		}, $this->shareMapper->findShareesForClient($client_uuid));

		$sharedByList = $this->shareMapper->findSharerForClient($client_uuid);
		$sharedBy = null;
		if (count($sharedByList) > 0) {
			$sharedBy = $sharedByList[0]->toArray($this->userManager, $this->groupManager);
		}

		$form_props = [
			"action" => $this->urlGenerator->linkToRoute("timemanager.page.projects") . "?client=" . $client_uuid,
			"editAction" => $this->urlGenerator->linkToRoute("timemanager.page.clients"),
			"settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
			"settings" => [
				"handle_conflicts" =>
				$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") === "handle_conflicts",
				"fullDateFormat" => $this->fullDateFormat,
			],
			"requestToken" => $this->requestToken,
			"clientName" => $client_name,
			"clientEditorButtonCaption" => $this->l->t("Edit client"),
			"clientEditorCaption" => $this->l->t("Edit client"),
			"clientUuid" => $client_uuid,
			"projectEditorButtonCaption" => $this->l->t("Add project"),
			"projectEditorCaption" => $this->l->t("New project"),
			"editClientData" => [
				"name" => $client_name,
				"note" => isset($client_data) && count($client_data) > 0 ? $client_data[0]->getNote() : "",
			],
			"deleteAction" => $this->urlGenerator->linkToRoute("timemanager.page.clients") . "/delete",
			"deleteUuid" => $client_uuid,
			"deleteButtonCaption" => $this->l->t("Delete client"),
			"deleteQuestion" => $this->l->t(
				"Do you want to delete the client %s and all associated projects, tasks and time entries?",
				[$client_name]
			),
			"shareAction" => $this->urlGenerator->linkToRoute("timemanager.page.clients") . "/share",
			"deleteShareAction" => $this->urlGenerator->linkToRoute("timemanager.page.clients") . "/share/delete",
			"sharees" => $sharees,
			"sharedBy" => $sharedBy,
			"canEdit" => $sharedBy === null,
			"userId" => $this->userId,
			"isServer" => true,
		];

		return new TemplateResponse("timemanager", "projects", [
			"projects" => $projects,
			"client" => isset($client_data) && count($client_data) > 0 ? $client_data[0] : null,
			"clients" => $clients,
			"requesttoken" => $this->requestToken,
			"store" => json_encode(array_merge($form_props, ["isServer" => false])),
			"templates" => [
				"ProjectEditor.svelte" => PHP_Svelte::render_template("ProjectEditor.svelte", $form_props),
				"DeleteButton.svelte" => PHP_Svelte::render_template("DeleteButton.svelte", $form_props),
				"ShareDialog.svelte" => PHP_Svelte::render_template("ShareDialog.svelte", $form_props),
				"ShareStatus.svelte" => PHP_Svelte::render_template("ShareStatus.svelte", $form_props),
			],
			"page" => "projects",
			"canEdit" => $sharedBy === null,
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
				"name" => $name,
				"client_uuid" => $client,
				"commit" => $commit,
			],
			"projects"
		);
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.projects") . "?client=" . $client);
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
			$project->setChanged(date("Y-m-d H:i:s"));
			$project->setCommit($commit);
			$project->setStatus("deleted");
			$this->projectMapper->update($project);

			// Delete children
			$this->projectMapper->deleteChildrenForEntityById($uuid, $commit);
		}

		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.projects") . "?client=" . $client);
	}

	/**
	 * @NoAdminRequired
	 */
	function editProject($uuid, $name = "Unnamed") {
		$commit = UUID::v4();
		$project = $this->projectMapper->getActiveObjectById($uuid);
		if ($project) {
			$this->storageHelper->insertCommit($commit);
			$this->storageHelper->addOrUpdateObject(
				[
					"uuid" => $uuid,
					"name" => $name,
					"commit" => $project->getCommit(),
					"desiredCommit" => $commit,
				],
				"projects"
			);
		}
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.tasks") . "?project=" . $uuid);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function tasks($project) {
		$clients = $this->clientMapper->findActiveForCurrentUser("created", true);
		$projects = $this->projectMapper->findActiveForCurrentUser("created", true);
		$sharedBy = null;
		$sharees = [];
		$isSingleProject = false;
		if ($project) {
			$isSingleProject = true;
			$tasks = $this->taskMapper->getActiveObjectsByAttributeValue("project_uuid", $project, "created", true);
			$project_data = $this->projectMapper->getActiveObjectsByAttributeValue("uuid", $project, "created", true);
			$client_data = $this->clientMapper->getActiveObjectsByAttributeValue(
				"uuid",
				$project_data[0]->getClientUuid(),
				"name",
				true
			);
			// Sum up project times
			if (count($project_data) === 1) {
				$project_data[0]->hours = $this->projectMapper->getHours($project_data[0]->getUuid());
			}
			// Sum up client times
			if (count($client_data) === 1) {
				$client_data[0]->hours = $this->clientMapper->getHours($client_data[0]->getUuid());

				$sharedByList = $this->shareMapper->findSharerForClient($client_data[0]->getUuid());
				if (count($sharedByList) > 0) {
					$sharedBy = $sharedByList[0]->toArray($this->userManager, $this->groupManager);
				}

				$sharees = array_map(function ($share) {
					$shareArray = $share->toArray($this->userManager, $this->groupManager);

					return $shareArray;
				}, $this->shareMapper->findShareesForClient($client_data[0]->getUuid()));
			}
		} else {
			$tasks = $this->taskMapper->findActiveForCurrentUser("created", true);
		}

		// Enhance tasks with additional information.
		if (count($tasks) > 0) {
			foreach ($tasks as $index => $task) {
				// Sum up project times
				$tasks[$index]->hours = $this->taskMapper->getHours($task->getUuid());
				// Look up project for task
				$parentProject = $this->projectMapper->getActiveObjectById($task->getProjectUuid(), true);
				if (!$parentProject) {
					continue;
				}
				$tasks[$index]->project = $parentProject;
				// Look up client for project
				$parentClient = $this->clientMapper->getActiveObjectById($parentProject->getClientUuid(), true);
				if (!$parentClient) {
					continue;
				}
				$tasks[$index]->client = $parentClient;
				// Skip if not showing "all" list
				if ($isSingleProject) {
					continue;
				}
				// Get sharees, if user has shared this client
				$tasks[$index]->sharees = array_map(function ($share) {
					$shareArray = $share->toArray($this->userManager, $this->groupManager);

					return $shareArray;
				}, $this->shareMapper->findShareesForClient($parentClient->getUuid()));
				// Get share author, if client is shared with current user
				$sharedByList = $this->shareMapper->findSharerForClient($parentClient->getUuid());
				$sharedBy = null;
				if (count($sharedByList) > 0) {
					$sharedBy = $sharedByList[0]->toArray($this->userManager, $this->groupManager);
				}
				$tasks[$index]->sharedBy = $sharedBy;
			}
		}

		$project_uuid = isset($project_data) && count($project_data) > 0 ? $project_data[0]->getUuid() : "";
		$project_name = isset($project_data) && count($project_data) > 0 ? $project_data[0]->getName() : "";

		$form_props = [
			"action" => $this->urlGenerator->linkToRoute("timemanager.page.tasks") . "?project=" . $project_uuid,
			"editAction" => $this->urlGenerator->linkToRoute("timemanager.page.projects"),
			"settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
			"settings" => [
				"handle_conflicts" =>
				$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") === "handle_conflicts",
				"fullDateFormat" => $this->fullDateFormat,
			],
			"requestToken" => $this->requestToken,
			"clientName" => isset($client_data) && count($client_data) > 0 ? $client_data[0]->getName() : "",
			"projectName" => $project_name,
			"projectEditorButtonCaption" => $this->l->t("Edit project"),
			"projectEditorCaption" => $this->l->t("Edit project"),
			"projectUuid" => $project_uuid,
			"taskEditorButtonCaption" => $this->l->t("Add task"),
			"taskEditorCaption" => $this->l->t("New task"),
			"deleteAction" => $this->urlGenerator->linkToRoute("timemanager.page.projects") . "/delete",
			"deleteUuid" => $project_uuid,
			"deleteButtonCaption" => $this->l->t("Delete project"),
			"deleteQuestion" => $this->l->t("Do you want to delete the project %s and all associated tasks and time entries?", [
				$project_name,
			]),
			"editProjectData" => [
				"name" => $project_name,
			],
			"sharedBy" => $sharedBy,
			"sharees" => $sharees,
			"canEdit" => $sharedBy === null,
			"isServer" => true,
		];

		return new TemplateResponse("timemanager", "tasks", [
			"tasks" => $tasks,
			"project" => isset($project_data) && count($project_data) > 0 ? $project_data[0] : null,
			"client" => isset($client_data) && count($client_data) > 0 ? $client_data[0] : null,
			"projects" => $projects,
			"clients" => $clients,
			"requesttoken" => $this->requestToken,
			"store" => json_encode(array_merge($form_props, ["isServer" => false])),
			"templates" => [
				"TaskEditor.svelte" => PHP_Svelte::render_template("TaskEditor.svelte", $form_props),
				"DeleteButton.svelte" => PHP_Svelte::render_template("DeleteButton.svelte", $form_props),
				"ShareStatus.svelte" => PHP_Svelte::render_template("ShareStatus.svelte", $form_props),
			],
			"page" => "tasks",
			"canEdit" => $sharedBy === null,
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
				"name" => $name,
				"project_uuid" => $project,
				"commit" => $commit,
			],
			"tasks"
		);
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.tasks") . "?project=" . $project);
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
			$task->setChanged(date("Y-m-d H:i:s"));
			$task->setCommit($commit);
			$task->setStatus("deleted");
			$this->taskMapper->update($task);

			// Delete children
			$this->taskMapper->deleteChildrenForEntityById($uuid, $commit);
		}

		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.tasks") . "?project=" . $project);
	}

	/**
	 * @NoAdminRequired
	 */
	function editTask($uuid, $name = "Unnamed") {
		$commit = UUID::v4();
		$task = $this->taskMapper->getActiveObjectById($uuid);
		if ($task) {
			$this->storageHelper->insertCommit($commit);
			$this->storageHelper->addOrUpdateObject(
				[
					"uuid" => $uuid,
					"name" => $name,
					"commit" => $task->getCommit(),
					"desiredCommit" => $commit,
				],
				"tasks"
			);
		}
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $uuid);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function times($task, string $userFilter = "") {
		$clients = $this->clientMapper->findActiveForCurrentUser("created", true);
		$projects = $this->projectMapper->findActiveForCurrentUser("created", true);
		$tasks = $this->taskMapper->findActiveForCurrentUser("created", true);
		$sharedBy = null;
		$sharees = [];
		if ($task) {
			$times = $this->timeMapper->getActiveObjectsByAttributeValue("task_uuid", $task, "start", true);
			$task_data = $this->taskMapper->getActiveObjectsByAttributeValue("uuid", $task, "created", true);
			$project_data = $this->projectMapper->getActiveObjectsByAttributeValue(
				"uuid",
				$task_data[0]->getProjectUuid(),
				"created",
				true
			);
			$client_data = $this->clientMapper->getActiveObjectsByAttributeValue(
				"uuid",
				$project_data[0]->getClientUuid(),
				"name",
				true
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

				$sharedByList = $this->shareMapper->findSharerForClient($client_data[0]->getUuid());
				if (count($sharedByList) > 0) {
					$sharedBy = $sharedByList[0]->toArray($this->userManager, $this->groupManager);
				}

				$sharees = array_map(function ($share) {
					$shareArray = $share->toArray($this->userManager, $this->groupManager);

					return $shareArray;
				}, $this->shareMapper->findShareesForClient($client_data[0]->getUuid()));
			}
		} else {
			$times = $this->timeMapper->findActiveForCurrentUser("start", true, "DESC");
		}

		$times = $this->storageHelper->resolveAuthorDisplayNamesForTimes($times, $this->userManager);
		$latestEntries = $this->storageHelper->getLatestTimeEntriesFromAllTimeEntries(
			$times,
			100,
			$userFilter && strlen($userFilter) > 0 ? explode(",", $userFilter) : []
		);
		$sharedTimeEntries = array_filter($times, function ($entry) {
			return !$entry->current_user_is_author;
		});
		$hasSharedTimeEntries = count($sharedTimeEntries) > 0;

		$task_uuid = isset($task_data) && count($task_data) > 0 ? $task_data[0]->getUuid() : "";
		$task_name = isset($task_data) && count($task_data) > 0 ? $task_data[0]->getName() : "";

		$form_props = [
			"action" => $this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $task_uuid,
			"editAction" => $this->urlGenerator->linkToRoute("timemanager.page.tasks"),
			"settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
			"settings" => [
				"handle_conflicts" =>
				$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") === "handle_conflicts",
				"fullDateFormat" => $this->fullDateFormat,
			],
			"requestToken" => $this->requestToken,
			"clientName" => isset($client_data) && count($client_data) > 0 ? $client_data[0]->getName() : "",
			"projectName" => isset($project_data) && count($project_data) > 0 ? $project_data[0]->getName() : "",
			"taskName" => isset($task_data) && count($task_data) > 0 ? $task_data[0]->getName() : "",
			"taskEditorButtonCaption" => $this->l->t("Edit task"),
			"taskEditorCaption" => $this->l->t("Edit task"),
			"taskUuid" => $task_uuid,
			"editTaskData" => [
				"name" => $task_name,
			],
			"deleteAction" => $this->urlGenerator->linkToRoute("timemanager.page.tasks") . "/delete",
			"deleteUuid" => $task_uuid,
			"deleteButtonCaption" => $this->l->t("Delete task"),
			"deleteQuestion" => $this->l->t("Do you want to delete the task %s and all associated time entries?", [$task_name]),
			"deleteTimeEntryAction" => $this->urlGenerator->linkToRoute("timemanager.page.times") . "/delete",
			"timeEditorButtonCaption" => $this->l->t("Add time entry"),
			"timeEditorCaption" => $this->l->t("New time entry"),
			"editTimeEntryAction" => $this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $task_uuid,
			"sharedBy" => $sharedBy,
			"sharees" => $sharees,
			"canEdit" => $sharedBy === null,
			"isServer" => true,
		];

		return new TemplateResponse("timemanager", "times", [
			"times" => $times,
			"task" => isset($task_data) && count($task_data) > 0 ? $task_data[0] : null,
			"project" => isset($project_data) && count($project_data) > 0 ? $project_data[0] : null,
			"client" => isset($client_data) && count($client_data) > 0 ? $client_data[0] : null,
			"tasks" => $tasks,
			"projects" => $projects,
			"clients" => $clients,
			"requesttoken" => $this->requestToken,
			"store" => json_encode(array_merge($form_props, ["isServer" => false])),
			"templates" => [
				"TimeEditor.svelte" => PHP_Svelte::render_template("TimeEditor.svelte", $form_props),
				"DeleteButton.svelte" => PHP_Svelte::render_template("DeleteButton.svelte", $form_props),
				"ShareStatus.svelte" => PHP_Svelte::render_template("ShareStatus.svelte", $form_props),
			],
			"page" => "times",
			"canEdit" => $sharedBy === null,
			"latestEntries" => $latestEntries,
			"hasSharedTimeEntries" => $hasSharedTimeEntries,
		]);
	}

	/**
	 * @NoAdminRequired
	 */
	function addTime($duration, $date, $note, $task) {
		$commit = UUID::v4();
		$this->storageHelper->insertCommit($commit);
		// Convert 1,25 to 1.25
		$duration = str_replace(",", ".", $duration);
		// Cast to float
		$duration = (float) $duration;

		$start = date("Y-m-d H:i:s", strtotime($date));
		// Calculate end from start and duration
		$end = date("Y-m-d H:i:s", strtotime(sprintf("%s + %s minute", $start, round($duration * 60))));

		$this->storageHelper->addOrUpdateObject(
			[
				"start" => $start, // now - duration
				"end" => $end, // now
				"task_uuid" => $task,
				"commit" => $commit,
				"note" => $note,
			],
			"times"
		);
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $task);
	}

	/**
	 * @NoAdminRequired
	 */
	function deleteTime($uuid) {
		$time = $this->storageHelper->getTimeEntryByIdForEditing($uuid);
		if ($time) {
			$commit = UUID::v4();
			$this->storageHelper->insertCommit($commit);
			// Delete object
			$time->setChanged(date("Y-m-d H:i:s"));
			$time->setCommit($commit);
			$time->setStatus("deleted");
			$this->timeMapper->update($time);

			// Delete children
			$this->timeMapper->deleteChildrenForEntityById($uuid, $commit);

			return new RedirectResponse(
				$this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $time->getTaskUuid()
			);
		}

		return new NotFoundException("Time entry could not be found");
	}

	/**
	 * @NoAdminRequired
	 */
	function editTime($uuid, $duration, $date, $note) {
		$time = $this->storageHelper->getTimeEntryByIdForEditing($uuid);
		if ($time) {
			$commit = UUID::v4();
			$this->storageHelper->insertCommit($commit);
			// Convert 1,25 to 1.25
			$duration = str_replace(",", ".", $duration);
			// Cast to float
			$duration = (float) $duration;

			$start = date("Y-m-d H:i:s", strtotime($date));
			// Calculate end from start and duration
			$end = date("Y-m-d H:i:s", strtotime(sprintf("%s + %s minute", $start, round($duration * 60))));

			$commit = UUID::v4();
			$this->storageHelper->insertCommit($commit);
			// Adjust payment status object
			$time->setChanged(date("Y-m-d H:i:s"));
			$time->setCommit($commit);
			$time->setStart($start); // given date
			$time->setEnd($end); // date + duration
			$time->setNote($note);
			$this->timeMapper->update($time);

			return new RedirectResponse(
				$this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $time->getTaskUuid()
			);
		}

		return new NotFoundException("Time entry could not be found");
	}

	/**
	 * @NoAdminRequired
	 */
	function payTime($uuid) {
		$time = $this->storageHelper->getTimeEntryByIdForEditing($uuid);
		if ($time) {
			$commit = UUID::v4();
			$this->storageHelper->insertCommit($commit);
			// Adjust payment status object
			$time->setChanged(date("Y-m-d H:i:s"));
			$time->setCommit($commit);
			$time->setPaymentStatus("paid");
			$this->timeMapper->update($time);

			return new RedirectResponse(
				$this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $time->getTaskUuid()
			);
		}

		return new NotFoundException("Time entry could not be found");
	}

	/**
	 * @NoAdminRequired
	 */
	function unpayTime($uuid) {
		$time = $this->storageHelper->getTimeEntryByIdForEditing($uuid);
		if ($time) {
			$commit = UUID::v4();
			$this->storageHelper->insertCommit($commit);
			// Adjust payment status
			$time->setChanged(date("Y-m-d H:i:s"));
			$time->setCommit($commit);
			$time->setPaymentStatus("");
			$this->timeMapper->update($time);

			return new RedirectResponse(
				$this->urlGenerator->linkToRoute("timemanager.page.times") . "?task=" . $time->getTaskUuid()
			);
		}

		return new NotFoundException("Time entry could not be found");
	}

	/**
	 * @NoAdminRequired
	 */
	function updateSettings($handle_conflicts) {
		$this->config->setAppValue(
			"timemanager",
			"sync_mode",
			(bool) $handle_conflicts ? "handle_conflicts" : "force_skip_conflict_handling"
		);
		return new RedirectResponse($this->urlGenerator->linkToRoute("timemanager.page.index"));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function tools() {
		$all_clients = $this->clientMapper->findActiveForCurrentUser("name");
		$all_projects = $this->projectMapper->findActiveForCurrentUser("name");
		$all_tasks = $this->taskMapper->findActiveForCurrentUser("name");
		$all_times = $this->timeMapper->findActiveForCurrentUser();

		$store = [
			"clients" => $all_clients,
			"projects" => $all_projects,
			"tasks" => $all_tasks,
			"times" => $all_times,
			"action" => $this->urlGenerator->linkToRoute("timemanager.page.tools"),
			"syncApiUrl" => $this->urlGenerator->linkToRoute("timemanager.t_api.updateObjectsFromWeb"),
			"requestToken" => $this->requestToken,
			"isServer" => true,
			// "settingsAction" => $this->urlGenerator->linkToRoute("timemanager.page.updateSettings"),
			// "settings" => [
			// 	"handle_conflicts" =>
			// 		$this->config->getAppValue("timemanager", "sync_mode", "force_skip_conflict_handling") ===
			// 		"handle_conflicts",
			// ],
		];

		return new TemplateResponse("timemanager", "tools", [
			"clients" => $all_clients,
			"projects" => $all_projects,
			"tasks" => $all_tasks,
			"times" => $all_times,
			"store" => json_encode($store),
			"page" => "tools",
		]);
	}
}
