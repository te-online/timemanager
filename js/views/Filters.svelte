<script>
	/**
	 * @TODO:
	 * - Set initial values from URL
	 * - Filter projects depending on selected clients
	 * - Filter tasks depending on selected projects
	 **/

	export let clients;
	export let projects;
	export let tasks;

	import Select from "svelte-select";

	$: loading = false;

	let selectedClients;
	let selectedProjects;
	let selectedTasks;
	let selectedStatus;

	// Returns a new url with updated fields
	const getUpdatedFilterUrl = (field, value, baseUrl) => {
		const urlParts = baseUrl.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			queryStringParts.map(part => {
				const partParts = part.split("=");
				if (partParts && partParts.length > 1 && typeof partParts[1] !== "undefined") {
					queryStringVariables = {
						...queryStringVariables,
						[partParts[0]]: partParts[1]
					};
				}
			});
			queryStringVariables[field] = value;

			return `${urlParts[0]}?${Object.keys(queryStringVariables)
				.map(key => `${key}=${queryStringVariables[key]}`)
				.join("&")}`;
		} else {
			return `${baseUrl}?${field}=${value}`;
		}
	};

	const getLinkEl = () => document.querySelector(".hidden-filter-link");

	const apply = e => {
		// Prepare a link with get attributes
		const filterLinkElement = getLinkEl();
		// Base off current url
		let newUrl = document.location.href;
		// Add filter attributes to url
		newUrl = getUpdatedFilterUrl("clients", selectedClients ? selectedClients.map(c => c.value).join(",") : "", newUrl);
		newUrl = getUpdatedFilterUrl(
			"projects",
			selectedProjects ? selectedProjects.map(p => p.value).join(",") : "",
			newUrl
		);
		newUrl = getUpdatedFilterUrl("tasks", selectedTasks ? selectedTasks.map(t => t.value).join(",") : "", newUrl);
		newUrl = getUpdatedFilterUrl("status", selectedStatus ? selectedStatus.map(s => s.value).join(",") : "", newUrl);
		// Attach url to hidden pjax link
		filterLinkElement.href = newUrl;
		// Navigate
		filterLinkElement.click();
	};

	const handleSelectClients = event => {
		selectedClients = event.detail;
	};
	const handleSelectProjects = event => {
		selectedProjects = event.detail;
	};
	const handleSelectTasks = event => {
		selectedTasks = event.detail;
	};
	const handleSelectStatus = event => {
		selectedStatus = event.detail;
	};
</script>

<form class={`reports-filters${loading ? ' icon-loading' : ''}`} on:submit|preventDefault={apply}>
	<label for="client-select">Filter by:</label>

	<label for="client-select" class="clients">
		{window.t('timemanager', 'Clients')}
		<Select inputAttributes={{ id: 'client-select' }} items={clients} on:select={handleSelectClients} isMulti={true} />
	</label>

	<label for="projects-select" class="projects">
		{window.t('timemanager', 'Projects')}
		<Select
			inputAttributes={{ id: 'projects-select' }}
			items={projects}
			on:select={handleSelectProjects}
			isMulti={true} />
	</label>

	<label for="tasks-select" class="tasks">
		{window.t('timemanager', 'Tasks')}
		<Select inputAttributes={{ id: 'tasks-select' }} items={tasks} on:select={handleSelectTasks} isMulti={true} />
	</label>

	<label for="status-select" class="status">
		{window.t('timemanager', 'Status')}
		<Select
			inputAttributes={{ id: 'status-select' }}
			items={[{ value: 'paid', label: 'Paid' }, { value: 'unpaid', label: 'Unpaid' }]}
			on:select={handleSelectStatus}
			isMulti={true} />
	</label>

	<span class="actions">
		<button disabled={loading} type="submit" class="button primary">{window.t('timemanager', 'Apply filters')}</button>
	</span>
</form>
