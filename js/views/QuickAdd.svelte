<script>
	export let action;
	export let requestToken;
	// export let clients;
	export let projects;
	export let tasks;
	export let initialDate;

	import Select from "svelte-select";
	import Overlay from "./Overlay.svelte";
	import TimeEditor from "./TimeEditor.svelte";
	import { onMount } from "svelte";
	import { translate } from "@nextcloud/l10n";
	import { createPopperActions } from "svelte-popperjs";
	const [popperRef, popperContent] = createPopperActions({
		placement: "bottom",
		strategy: "fixed",
	});
	const extraOpts = {
		modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
	};

	let showTooltip = false;

	$: show = false;
	$: loading = false;
	$: taskError = false;

	let duration = 1;
	let date = initialDate;
	let note;
	let client;
	let task;
	let noteInput;
	let buttonInput;
	let searchInput;
	let tooltipContainer;
	let searchValue;
	// const searchResults = [
	// 	{
	// 		client: {
	// 			name: "Zoo",
	// 			projects: [{ name: "Tigers", tasks: [{ name: "Feeding" }, { name: "Cleaning" }, { name: "Playing" }] }],
	// 		},
	// 	},
	// 	{
	// 		client: {
	// 			name: "Grime, Cronin and Cruickshank",
	// 			projects: [
	// 				{ name: "Cobbler Birthday Cake", tasks: [{ name: "Mexico City" }] },
	// 				{ name: "Cheesecake with caramel", tasks: [{ name: "Sidney" }] },
	// 			],
	// 		},
	// 	},
	// ];
	const lastUsed = [
		{ client: { name: "Zoo" }, project: { name: "Tigers" }, task: { name: "Feeding" } },
		{ client: { name: "Zoo" }, project: { name: "Tigers" }, task: { name: "Feeding" } },
	];
	const searchResults = [];

	const tasksWithProject =
		tasks && tasks.length
			? tasks.map((aTask) => {
					aTask.project = projects.find((aProject) => aProject.value === aTask.projectUuid);
					return aTask;
			  })
			: [];

	const hideTooltip = () => {
		showTooltip = false;
	};

	onMount(() => {
		document.addEventListener("DOMContentLoaded", () => {
			if (noteInput) {
				noteInput.focus();
			}
		});
		if (noteInput) {
			noteInput.focus();
		}
		document.addEventListener("click", hideTooltip);

		return () => {
			document.removeEventListener("click", hideTooltip);
		};
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

	const clientSelected = () => {
		const input = document.querySelector(".task input");
		if (input) {
			input.focus();
		}
	};
</script>

<form class={`quick-add${loading ? " icon-loading" : ""}`} on:submit|preventDefault={save}>
	<label class="note">
		{translate("timemanager", "Note")}
		<input
			type="text"
			name="note"
			class="note"
			bind:value={note}
			placeholder={translate("timemanager", "Describe what you did...")}
			bind:this={noteInput}
		/>
	</label>
	<label for="quick-add-time">
		{@html translate("timemanager", "Duration (in hrs.) & Date")}
		<span class="double">
			<input
				id="quick-add-time"
				type="number"
				name="duration"
				step="0.01"
				placeholder=""
				class="duration-input"
				bind:value={duration}
			/>
			<input type="date" name="date" class="date-input" bind:value={date} />
		</span>
	</label>
	<label class="task-selector-trigger">
		{translate("timemanager", "Client, project or task")}
		<input
			use:popperRef
			on:focus={() => {
				// We want to use this input as a button
				// and then focus the actual search input
				buttonInput?.blur();
				searchInput?.focus();
				showTooltip = true;
			}}
			bind:this={buttonInput}
			type="text"
			placeholder={translate("timemanager", "Select...")}
			disabled={showTooltip}
		/>
	</label>
	{#if showTooltip}
		<div
			class="task-selector-popover popover"
			use:popperContent={extraOpts}
			on:click={(event) => {
				event.stopPropagation();
				event.preventDefault();
			}}
		>
			<label class="search">
				<span class="hidden-visually">{translate("timemanager", "Search for client, project or task")}</span>
				<input
					bind:this={searchInput}
					bind:value={searchValue}
					class="search-input icon-search button-w-icon"
					type="text"
					placeholder={translate("timemanager", "Type to search for client, project or task")}
					autofocus
				/>
			</label>
			<div class="last-used">
				{#if lastUsed?.length}
					<ul class="result">
						{#each lastUsed as entry, index}
							<li>
								{#if index === 0}<span class="client">{translate("timemanager", "Last used")}</span>{/if}
								<a class="task last-used-wrapper" href="#">
									<ul>
										<li>
											<span class="label muted">{translate("timemanager", "Client")}</span>
											<span class="value muted">{entry.client.name}</span>
										</li>
										<li>
											<span class="label muted">{translate("timemanager", "Project")}</span>
											<span class="value muted">{entry.project.name}</span>
										</li>
										<li>
											<span class="label">{translate("timemanager", "Task")}</span>
											<span class="value">{entry.task.name}</span>
										</li>
									</ul>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
			<div class="search-results">
				{#if searchResults?.length}
					{#each searchResults as result}
						<ul class="result">
							<li>
								<span class="client">{result.client.name}</span>
								<ul>
									{#each result.client.projects as project}
										<li>
											<span class="project">{project.name}</span>
											<ul>
												{#each project.tasks as task}
													<li><a href="#" class="task">{task.name}</a></li>
												{/each}
											</ul>
										</li>
									{/each}
								</ul>
							</li>
						</ul>
					{/each}
				{:else if searchValue?.length}
					<p class="no-result">{translate("timemanager", "Nothing found")}</p>
				{/if}
			</div>
			<button disabled={loading} type="button" class="icon-add button-w-icon button secondary task-add-button"
				>{translate("timemanager", "Add task")}</button
			>
			<div class="popover-arrow" data-popper-arrow />
		</div>
	{/if}
	<!-- <label class={`client${taskError ? ' error' : ''}${client ? ' hidden-visually' : ''}`}>
		{translate('timemanager', 'Client')}
		<Select
			noOptionsMessage={translate('timemanager', 'No options')}
			placeholder={translate('timemanager', 'Select...')}
			items={clients}
			bind:value={client}
			on:select={clientSelected} />
	</label> -->
	<!-- <label class={`task${taskError ? ' error' : ''}${!client ? ' hidden-visually' : ''}`}>
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
	</label> -->
	<span class="actions">
		<!-- TRANSLATORS "Add" refers to adding a time entry. It's a button caption. -->
		<button disabled={loading} type="submit" class="button primary">{translate("timemanager", "Add")}</button>
	</span>
</form>
