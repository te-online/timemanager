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
	import { onMount } from "svelte";
	import { translate } from "@nextcloud/l10n";

	$: show = false;
	$: loading = false;
	$: taskError = false;

	let duration = 1;
	let date = initialDate;
	let note;
	let client;
	let task;
	let noteInput;

	const tasksWithProject =
		tasks && tasks.length
			? tasks.map(aTask => {
					aTask.project = projects.find(aProject => aProject.value === aTask.projectUuid);
					return aTask;
			  })
			: [];

	onMount(() => {
		document.addEventListener("DOMContentLoaded", () => {
			if (noteInput) {
				noteInput.focus();
			}
		});
		if (noteInput) {
			noteInput.focus();
		}
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
					"content-type": "application/json"
				}
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

	const clientSelected = () => {
		const input = document.querySelector(".task input");
		if (input) {
			input.focus();
		}
	};
</script>

<form class={`quick-add${loading ? ' icon-loading' : ''}`} on:submit|preventDefault={save}>
	<label class="note">
		{translate('timemanager', 'Note')}
		<input
			type="text"
			name="note"
			class="note"
			bind:value={note}
			placeholder={translate('timemanager', 'Describe what you did...')}
			bind:this={noteInput} />
	</label>
	<label>
		{@html translate('timemanager', 'Duration (in hrs.) & Date')}
		<span class="double">
			<input type="number" name="duration" step="0.01" placeholder="" class="duration-input" bind:value={duration} />
			<input type="date" name="date" class="date-input" bind:value={date} />
		</span>
	</label>
	<label class={`client${taskError ? ' error' : ''}${client ? ' hidden-visually' : ''}`}>
		{translate('timemanager', 'Client')}
		<Select
			noOptionsMessage={translate('timemanager', 'No options')}
			placeholder={translate('timemanager', 'Select...')}
			items={clients}
			bind:value={client}
			on:select={clientSelected} />
	</label>
	<label class={`task${taskError ? ' error' : ''}${!client ? ' hidden-visually' : ''}`}>
		<span class="task-caption">
			{@html translate('timemanager', 'Project & Task for')}
			<strong>{client && client.label}</strong>
			<a href="#/" class="change" on:click|preventDefault={() => (client = null)}>
				{translate('timemanager', 'Change client')}
			</a>
		</span>
		<Select
			items={tasksWithProject && tasksWithProject.filter(oneTask => client && oneTask.project.clientUuid === client.value)}
			groupBy={item => item.project.label}
			noOptionsMessage={translate('timemanager', 'No projects/tasks or no client selected.')}
			placeholder={translate('timemanager', 'Select...')}
			bind:value={task} />
	</label>
	<span class="actions">
		<!-- TRANSLATORS "Add" refers to adding a time entry. It's a button caption. -->
		<button disabled={loading} type="submit" class="button primary">{translate('timemanager', 'Add')}</button>
	</span>
</form>
