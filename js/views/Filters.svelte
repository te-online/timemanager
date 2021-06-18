<script>
	export let clients;
	export let projects;
	export let tasks;

	import Select from "svelte-select";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: loading = false;
	$: availableProjects = projects;
	$: availableTasks = tasks;

	let selectedClients;
	let selectedProjects;
	let selectedTasks;
	let selectedStatus;

	const availableStatus = [
		{ value: "unpaid", label: window.t("timemanager", "Unresolved") },
		{ value: "paid", label: window.t("timemanager", "Resolved") }
	];

	const apply = e => {
		// Prepare a link with get attributes
		const filterLinkElement = Helpers.getLinkEl();
		// Base off current url
		let newUrl = document.location.href;
		// Add filter attributes to url
		newUrl = Helpers.getUpdatedFilterUrl(
			"clients",
			selectedClients ? selectedClients.map(c => c.value).join(",") : "",
			newUrl
		);
		newUrl = Helpers.getUpdatedFilterUrl(
			"projects",
			selectedProjects ? selectedProjects.map(p => p.value).join(",") : "",
			newUrl
		);
		newUrl = Helpers.getUpdatedFilterUrl(
			"tasks",
			selectedTasks ? selectedTasks.map(t => t.value).join(",") : "",
			newUrl
		);
		newUrl = Helpers.getUpdatedFilterUrl("status", selectedStatus ? selectedStatus.value : "", newUrl);
		// Attach url to hidden pjax link
		filterLinkElement.href = newUrl;
		// Navigate
		filterLinkElement.click();
	};

	const handleSelectClients = event => {
		selectedClients = event.detail;
		if (selectedClients && selectedClients.length) {
			availableProjects = projects.filter(project =>
				selectedClients.find(client => project.clientUuid === client.value)
			);
		} else {
			availableProjects = projects;
		}
		if (selectedProjects && selectedProjects.length) {
			availableTasks = tasks.filter(task => selectedProjects.find(project => task.projectUuid === project.value));
		} else {
			availableTasks = tasks;
		}
	};

	const handleSelectProjects = event => {
		selectedProjects = event.detail;
		if (selectedClients && selectedClients.length) {
			availableProjects = projects.filter(project =>
				selectedClients.find(client => project.clientUuid === client.value)
			);
		} else {
			availableProjects = projects;
		}
		if (selectedProjects && selectedProjects.length) {
			availableTasks = tasks.filter(task => selectedProjects.find(project => task.projectUuid === project.value));
		} else {
			availableTasks = tasks;
		}
	};
	const handleSelectTasks = event => {
		selectedTasks = event.detail;
	};
	const handleSelectStatus = event => {
		selectedStatus = event.detail;
	};
	const handleClearStatus = () => {
		selectedStatus = "";
	};

	onMount(() => {
		// Parse current URL
		const urlParts = document.location.href.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			// Map over all query params
			queryStringParts.map(part => {
				// Split query params
				const partParts = part.split("=");
				const [name, value] = partParts;
				// Apply filters from query params
				if (name === "status" && value) {
					selectedStatus = availableStatus.find(status => status.value === value);
				}
				if (name === "tasks" && value && value.length) {
					selectedTasks = value.split(",").map(taskId => tasks.find(task => task.value === taskId));
				}
				if (name === "projects" && value && value.length) {
					handleSelectProjects({
						detail: value.split(",").map(projectId => projects.find(project => project.value === projectId))
					});
				}
				if (name === "clients" && value && value.length) {
					handleSelectClients({
						detail: value.split(",").map(clientId => clients.find(client => client.value === clientId))
					});
				}
			});
		}
	});
</script>

<form class={`reports-filters${loading ? ' icon-loading' : ''}`} on:submit|preventDefault={apply}>
	<label for="client-select" class="clients">
		{window.t('timemanager', 'Clients')}
		<Select
			inputAttributes={{ id: 'client-select' }}
			items={clients}
			on:select={handleSelectClients}
			selectedValue={selectedClients}
			isMulti={true} />
	</label>

	<label for="projects-select" class="projects">
		{window.t('timemanager', 'Projects')}
		<Select
			inputAttributes={{ id: 'projects-select' }}
			items={availableProjects}
			on:select={handleSelectProjects}
			selectedValue={selectedProjects}
			isMulti={true} />
	</label>

	<label for="tasks-select" class="tasks">
		{window.t('timemanager', 'Tasks')}
		<Select
			inputAttributes={{ id: 'tasks-select' }}
			items={availableTasks}
			on:select={handleSelectTasks}
			selectedValue={selectedTasks}
			isMulti={true} />
	</label>

	<label for="status-select" class="status">
		{window.t('timemanager', 'Status')}
		<Select
			inputAttributes={{ id: 'status-select' }}
			items={availableStatus}
			selectedValue={selectedStatus}
			on:select={handleSelectStatus}
			on:clear={handleClearStatus} />
	</label>

	<span class="actions">
		<button disabled={loading} type="submit" class="button primary">{window.t('timemanager', 'Apply filters')}</button>
	</span>
</form>
