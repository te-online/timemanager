<script>
	import { onMount } from "svelte";
	import { parse } from "csv-parse/dist/esm";
	import { v4 as uuidv4 } from "uuid/dist/esm-browser";

	let fileInput = document.createElement("input"); // this is just for types
	$: parseError = "";
	$: parseResult = "";

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

	onMount(() => {
		fileInput.addEventListener("change", async e => {
			if (e && e.target && e.target.files && e.target.files.length) {
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
				// Group entities
				const associated = clients.map(client => {
					client.projects = projects
						.filter(project => project.client === client.name)
						.map(project => ({ ...project, client_uuid: client.uuid }))
						.map(project => {
							project.tasks = tasks
								.filter(task => task.project === project.name)
								.map(task => ({ ...task, project_uuid: project.uuid }));
							return project;
						});
					return client;
				});

				parseResult = JSON.stringify(associated, null, 2);

				// @TODO: Add handling of time entries

				// @TODO: Render preview
				// @TODO: Look up unassociated elements with existing elements from store
				// @TODO: List unassociated elements (not in import & not in store)

				// @TODO: Generate uuids for all elements

				// @TODO: Post to JSON API if confirmed by user
			}
		});
	});
</script>

<label>
	Select CSV
	<br />
	<input type="file" bind:this={fileInput} />
</label>

<div class="error">{parseError}</div>

<pre>{parseResult}</pre>
