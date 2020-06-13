<script>
	export let action;
	export let requestToken;
	export let clients;
	export let projects;
	export let tasks;
	export let initialDate;

	import Select from "svelte-select";
	import Overlay from "./Overlay.svelte";
	import TimeEditor from "./TimeEditor.svelte";

	$: show = false;
	$: loading = false;
	$: taskError = false;

	let duration;
	let date = initialDate;
	let note;
	let client;
	let task;

	const tasksWithProject = tasks.map((aTask) => {
		aTask.project = projects.find((aProject) => aProject.value === aTask.projectUuid);
		return aTask;
	});

	const save = async () => {
		loading = true;
		taskError = false;
		if (!task) {
			loading = false;
			taskError = true;
			return;
		}
		try {
			let entry = { duration, date, note, task: task.value };
			const response = await fetch(action, {
				method: "POST",
				body: JSON.stringify(entry),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (response && response.ok) {
				show = false;
				document.querySelector(".app-timemanager [data-current-link]").click();
			}
		} catch (error) {
			console.error(error);
		}
		loading = false;
	};
</script>

<form class={`quick-add${loading ? ' icon-loading' : ''}`} on:submit|preventDefault={save}>
	<label>
		Duration (in hrs.)
		<br />
		<input type="number" name="duration" step="0.25" placeholder="" class="duration" bind:value={duration} required />
	</label>
	<label>
		Note
		<input type="text" name="note" class="note" bind:value={note} placeholder="Describe what you did..." />
	</label>
	<label>
		Date
		<br />
		<input type="date" name="date" class="date" bind:value={date} />
	</label>
	<label>
		Client
		<Select items={clients} bind:selectedValue={client} />
	</label>
	<label class={`${taskError ? 'error' : ''}`}>
		Project & Task
		<Select
			items={tasksWithProject && tasksWithProject.filter((oneTask) => client && oneTask.project.clientUuid === client.value)}
			groupBy={(item) => item.project.label}
			noOptionsMessage="No projects/tasks or no client selected."
			bind:selectedValue={task} />
	</label>
	<span class="actions">
		<button disabled={loading} type="submit" class="button primary">Add</button>
	</span>
</form>
