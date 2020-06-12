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
	let project;
	let task;

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
		Note
		<input type="text" name="note" class="note" bind:value={note} placeholder="Describe what you did..." />
	</label>
	<label>
		Duration (in hrs.)
		<br />
		<input type="number" name="duration" step="0.25" placeholder="" class="duration" bind:value={duration} required />
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
	<label>
		Project
		<Select
			items={projects && projects.filter((oneProject) => client && oneProject.clientUuid === client.value)}
			bind:selectedValue={project} />
	</label>
	<label class={`${taskError ? 'error' : ''}`}>
		Tasks
		<Select
			items={tasks && tasks.filter((oneTask) => project && oneTask.projectUuid === project.value)}
			bind:selectedValue={task} />
	</label>
	<span>
		<button disabled={loading} type="submit" class="button primary">Add</button>
	</span>
</form>
