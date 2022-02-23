<script>
	export let updateObjectsApiUrl;
	export let requestToken;

	import { onMount } from "svelte";
	import { parse } from "csv-parse/dist/esm";
	import { v4 as uuidv4 } from "uuid/dist/esm-browser";
	import { translate } from "@nextcloud/l10n";

	let fileInput;
	$: parseError = "";
	$: importError = "";
	$: successMessage = "";
	$: importPreviewData = [];
	$: loading = false;
	// Collect updated objects in here
	let preparedClients = [];
	let preparedProjects = [];
	let preparedTasks = [];

	// Converts all keys of an object to lowercase
	const keysToLowerCase = object => {
		const result = {};
		if (object) {
			for (const [key, value] of Object.entries(object)) {
				result[key.toLowerCase()] = value;
			}
		}
		return result;
	};

	// Filters a list of records for type, converts all keys to lowercase and applies a uuid to each record
	const filter = (records, type) =>
		records
			.map(keysToLowerCase)
			.filter(record => record.type && record.type.toLowerCase() === type)
			.map(record => ({ ...record, uuid: uuidv4() }));

	// Previews a given file
	const previewFile = async e => {
		if (e && e.target && e.target.files && e.target.files.length) {
			parseError = "";
			const [file] = e.target.files;
			const fileReader = new FileReader();
			fileReader.readAsText(file);

			await new Promise((resolve, reject) => {
				fileReader.onload = () => {
					resolve(null);
				};
				fileReader.onerror = error => {
					reject(error);
				};
			});

			let contents = [];
			try {
				contents = await new Promise((resolve, reject) =>
					parse(
						fileReader.result,
						{
							// @TODO: Make delimiter configurable
							delimiter: ";",
							// @TODO: Make encoding configurable
							encoding: "utf-8",
							columns: true
						},
						(err, records) => {
							if (err) {
								reject(err);
							}
							resolve(records);
						}
					)
				);
			} catch (error) {
				parseError = error;
			}

			// Filter by type and assign uuids
			const clients = filter(contents, "client");
			const projects = filter(contents, "project");
			const tasks = filter(contents, "task");
			// Empty arrays
			preparedClients = [];
			preparedProjects = [];
			preparedTasks = [];
			// Group entities
			const associated = clients.map(client => {
				client.projects = projects
					.filter(project => project.client === client.name)
					.map(project => ({ ...project, client_uuid: client.uuid }))
					.map(project => {
						project.tasks = tasks
							.filter(task => task.project === project.name)
							.map(task => ({ ...task, project_uuid: project.uuid }));
						preparedTasks.push(...project.tasks);
						return project;
					});
				preparedProjects.push(...client.projects);
				preparedClients.push(client);
				return client;
			});

			importPreviewData = associated;

			// @TODO: LOW: Add handling of time entries

			// @TODO: LOW: Look up unassociated elements with existing elements from store
			// @TODO: LOW: List unassociated elements (not in import & not in store)
		}
	};

	onMount(() => {
		fileInput.addEventListener("change", previewFile);

		return () => {
			fileInput.removeEventListener("change", previewFile);
		};
	});

	// Post data to JSON API
	const doImport = async () => {
		loading = true;
		importError = "";
		const convertedImportData = {
			lastCommit: "",
			data: {
				clients: {
					created: preparedClients.map(client => {
						delete client.type;
						delete client.projects;
						return client;
					}),
					updated: [],
					deleted: []
				},
				projects: {
					created: preparedProjects.map(project => {
						delete project.type;
						delete project.tasks;
						return project;
					}),
					updated: [],
					deleted: []
				},
				tasks: {
					created: preparedTasks.map(task => {
						delete task.type;
						return task;
					}),
					updated: [],
					deleted: []
				},
				times: { created: [], updated: [], deleted: [] }
			}
		};

		try {
			const response = await fetch(updateObjectsApiUrl, {
				method: "POST",
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json"
				},
				body: JSON.stringify(convertedImportData)
			});
			if (response.ok) {
				importPreviewData = [];
				successMessage = "Import succeeded";
			}
		} catch (error) {
			importError = error;
		}
		loading = false;
	};
</script>

<label>
	Select CSV file
	<br />
	<input type="file" bind:this={fileInput} />
</label>

{#if parseError}
	<div class="error">CSV parse error: {parseError}</div>
{/if}

{#if importError}
	<div class="error">Import API error: {importError}</div>
{/if}

{#if successMessage}
	<div class="success">Done: {successMessage}</div>
{/if}

{#each importPreviewData as client}
	<div class="tm_item-row">
		<div>
			<span class="tm_label">Client</span>
			<h3>{client.name}</h3>
		</div>
		<div>
			<span class="tm_label">Note</span>
			{client.note}
		</div>
		{#if client.projects}
			<details open>
				<summary>Projects</summary>
				{#each client.projects as project}
					<div class="tm_item-row">
						<div>
							<span class="tm_label">Project Name</span>
							<h3>{project.name}</h3>
						</div>
						<div>
							<span class="tm_label">Note</span>
							{project.note}
						</div>
						{#if project.tasks}
							<details open>
								<summary>Tasks</summary>
								{#each project.tasks as task}
									<div class="tm_item-row">
										<div>
											<span class="tm_label">Task Name</span>
											<h3>{task.name}</h3>
										</div>
										<div>
											<span class="tm_label">Note</span>
											{task.note}
										</div>
									</div>
								{/each}
							</details>
						{/if}
					</div>
				{/each}
			</details>
		{/if}
	</div>
{/each}

{#if importPreviewData.length}
	<form on:submit|preventDefault={doImport} class={loading ? ' icon-loading' : ''}>
		<button disabled={loading} type="submit" class="button primary">{translate('timemanager', 'Import now')}</button>
	</form>
{/if}
