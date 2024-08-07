<script>
	export let clients;
	export let projects;
	export let tasks;
	export let requestToken;

	import Select from "svelte-select";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import { translate } from "@nextcloud/l10n";
	import Timerange from "./Timerange.svelte";

	$: loading = false;
	$: availableProjects = projects;
	$: availableTasks = tasks;

	let selectedClients;
	let selectedProjects;
	let selectedTasks;
	let selectedStatus;
	let urlWithTimerange = "";

	const updateUrlWithTimerange = (url) => (urlWithTimerange = url);

	const availableStatus = [
		{ value: "unpaid", label: translate("timemanager", "Unresolved") },
		{ value: "paid", label: translate("timemanager", "Resolved") },
	];

	const apply = (e) => {
		// Prepare a link with get attributes
		const filterLinkElement = Helpers.getLinkEl();
		// Base off current url
		let newUrl = urlWithTimerange || document.location.href;
		// Add filter attributes to url
		newUrl = Helpers.getUpdatedFilterUrl(
			"clients",
			selectedClients ? selectedClients.map((c) => c.value).join(",") : "",
			newUrl,
		);
		newUrl = Helpers.getUpdatedFilterUrl(
			"projects",
			selectedProjects ? selectedProjects.map((p) => p.value).join(",") : "",
			newUrl,
		);
		newUrl = Helpers.getUpdatedFilterUrl(
			"tasks",
			selectedTasks ? selectedTasks.map((t) => t.value).join(",") : "",
			newUrl,
		);
		newUrl = Helpers.getUpdatedFilterUrl("status", selectedStatus ? selectedStatus.value : "", newUrl);
		// Attach url to hidden pjax link
		filterLinkElement.href = newUrl;
		// Navigate
		filterLinkElement.click();
	};

	const handleSelectClients = (event) => {
		selectedClients = event.detail;
		if (selectedClients && selectedClients.length) {
			availableProjects = projects.filter((project) =>
				selectedClients.find((client) => project.clientUuid === client.value),
			);
		} else {
			availableProjects = projects;
		}
		if (selectedProjects && selectedProjects.length) {
			availableTasks = tasks.filter((task) => selectedProjects.find((project) => task.projectUuid === project.value));
		} else {
			availableTasks = tasks;
		}
	};

	const handleSelectProjects = (event) => {
		selectedProjects = event.detail;
		if (selectedClients && selectedClients.length) {
			availableProjects = projects.filter((project) =>
				selectedClients.find((client) => project.clientUuid === client.value),
			);
		} else {
			availableProjects = projects;
		}
		if (selectedProjects && selectedProjects.length) {
			availableTasks = tasks.filter((task) => selectedProjects.find((project) => task.projectUuid === project.value));
		} else {
			availableTasks = tasks;
		}
	};
	const handleSelectTasks = (event) => {
		selectedTasks = event.detail;
	};
	const handleSelectStatus = (event) => {
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
			// Map over all query params
			queryStringParts.map((part) => {
				// Split query params
				const partParts = part.split("=");
				const [name, value] = partParts;
				// Apply filters from query params
				if (name === "status" && value) {
					selectedStatus = availableStatus.find((status) => status.value === value);
				}
				if (name === "tasks" && value && value.length) {
					selectedTasks = value.split(",").map((taskId) => tasks.find((task) => task.value === taskId));
				}
				if (name === "projects" && value && value.length) {
					handleSelectProjects({
						detail: value.split(",").map((projectId) => projects.find((project) => project.value === projectId)),
					});
				}
				if (name === "clients" && value && value.length) {
					handleSelectClients({
						detail: value.split(",").map((clientId) => clients.find((client) => client.value === clientId)),
					});
				}
			});
		} else {
			// Apply timezone and empty filters when a user
			// happens to land on /reports without params
			apply();
		}
	});
</script>

<form class={`reports-filters${loading ? " icon-loading" : ""}`} on:submit|preventDefault={apply} id="filters-form">
	<label for="client-select" class="clients">
		{translate("timemanager", "Clients")}
		<Select
			noOptionsMessage={translate("timemanager", "No options")}
			placeholder={translate("timemanager", "Select...")}
			inputAttributes={{ id: "client-select" }}
			items={clients}
			on:select={handleSelectClients}
			value={selectedClients}
			isMulti={true}
		/>
	</label>

	<label for="projects-select" class="projects">
		{translate("timemanager", "Projects")}
		<Select
			noOptionsMessage={translate("timemanager", "No options")}
			placeholder={translate("timemanager", "Select...")}
			inputAttributes={{ id: "projects-select" }}
			items={availableProjects}
			on:select={handleSelectProjects}
			value={selectedProjects}
			isMulti={true}
		/>
	</label>

	<label for="tasks-select" class="tasks">
		{translate("timemanager", "Tasks")}
		<Select
			noOptionsMessage={translate("timemanager", "No options")}
			placeholder={translate("timemanager", "Select...")}
			inputAttributes={{ id: "tasks-select" }}
			items={availableTasks}
			on:select={handleSelectTasks}
			value={selectedTasks}
			isMulti={true}
		/>
	</label>

	<label for="status-select" class="status">
		{translate("timemanager", "Status")}
		<Select
			noOptionsMessage={translate("timemanager", "No options")}
			placeholder={translate("timemanager", "Select...")}
			inputAttributes={{ id: "status-select" }}
			items={availableStatus}
			value={selectedStatus}
			on:select={handleSelectStatus}
			on:clear={handleClearStatus}
		/>
	</label>
</form>
<Timerange {updateUrlWithTimerange} {requestToken} />
