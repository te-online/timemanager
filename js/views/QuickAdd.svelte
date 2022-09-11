<script>
	export let action;
	export let requestToken;
	export let clients;
	export let projects;
	export let tasks;
	export let initialDate;
	export let latestSearchEntries;

	import { onMount } from "svelte";
	import { translate } from "@nextcloud/l10n";
	import { createPopperActions } from "svelte-popperjs";
	import Fuse from "fuse.js";
	import { differenceInMinutes, parseISO } from "date-fns";

	const extraOpts = {
		modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
	};
	const [taskSelectorPopperRef, taskSelectorPopperContent] = createPopperActions({
		placement: "bottom",
		strategy: "fixed",
	});
	const [noteSuggestPopperRef, noteSuggestPopperContent] = createPopperActions({
		placement: "bottom-start",
		strategy: "fixed",
	});

	let showTaskSelector = false;
	let showNoteAutosuggest = false;
	let tasksButtons = [];
	let lastUsedTasksButtons = [];
	let noteAutosuggestList = [];
	let noteAutosuggestButtons = [];

	$: loading = false;
	$: taskError = false;
	$: selected = null;
	$: searchResultsNumTasks = 0;
	$: currentFocusTaskIndex = -1;
	$: currentLastestFocusTaskIndex = -1;
	$: currentFocusNoteIndex = -1;

	let duration = 1;
	let date = initialDate;
	let note;
	let noteInput;
	let searchInput;
	let searchValue;
	let durationInput;

	const latestEntriesByTask = {};
	latestSearchEntries.map((entry) => {
		latestEntriesByTask[entry?.task?.uuid] = entry;
	});
	const lastUsed = (Object.values(latestEntriesByTask) ?? []).slice(0, 3);
	$: searchResults = [];

	const latestTimeEntries = latestSearchEntries.map((entry) => ({
		...entry,
		label: entry?.time?.note,
		value: entry?.time?.uuid,
	}));

	const groupedData = clients.map((client) => {
		const clientProjects = projects
			.filter((project) => project.clientUuid === client.value)
			.map((project) => {
				const projectTasks = tasks.filter((task) => project.value === task.projectUuid);
				return { ...project, tasks: projectTasks };
			});

		return { ...client, projects: clientProjects };
	});

	/**
	 * Handles keyboard navigation for popovers
	 */
	function handleKeyDown(e) {
		if (!showTaskSelector && !showNoteAutosuggest) {
			return;
		}

		switch (e.key) {
			case "Escape":
				e.preventDefault();
				handleHidePopovers();
				break;
			case "ArrowDown":
				e.preventDefault();
				if (showNoteAutosuggest) {
					const reachedEnd = currentFocusNoteIndex + 1 >= noteAutosuggestList?.length;
					if (reachedEnd) {
						currentFocusNoteIndex = 0;
					} else {
						currentFocusNoteIndex++;
					}
					noteAutosuggestButtons[currentFocusNoteIndex]?.focus();
					break;
				}
				if (lastUsed?.length && !searchValue) {
					const reachedEnd = currentLastestFocusTaskIndex + 1 >= lastUsed?.length;
					if (reachedEnd) {
						currentLastestFocusTaskIndex = 0;
					} else {
						currentLastestFocusTaskIndex++;
					}
					lastUsedTasksButtons[currentLastestFocusTaskIndex]?.focus();
					break;
				}
				if (searchResults?.length) {
					const reachedEnd = currentFocusTaskIndex + 1 >= searchResultsNumTasks;
					if (reachedEnd) {
						currentFocusTaskIndex = 0;
					} else {
						currentFocusTaskIndex++;
					}
					tasksButtons[currentFocusTaskIndex]?.focus();
					break;
				}
			case "ArrowUp":
				e.preventDefault();
				if (showNoteAutosuggest) {
					const reachedStart = currentFocusNoteIndex - 1 < 0;
					if (reachedStart) {
						currentFocusNoteIndex = noteAutosuggestList?.length - 1;
					} else {
						currentFocusNoteIndex--;
					}
					noteAutosuggestButtons[currentFocusNoteIndex]?.focus();
					break;
				}
				if (lastUsed?.length && !searchValue) {
					const reachedStart = currentLastestFocusTaskIndex - 1 < 0;
					if (reachedStart) {
						currentLastestFocusTaskIndex = lastUsed?.length - 1;
					} else {
						currentLastestFocusTaskIndex--;
					}
					lastUsedTasksButtons[currentLastestFocusTaskIndex]?.focus();
					break;
				}
				if (searchResults?.length) {
					const reachedStart = currentFocusTaskIndex - 1 < 0;
					if (reachedStart) {
						currentFocusTaskIndex = searchResultsNumTasks - 1;
					} else {
						currentFocusTaskIndex--;
					}
					tasksButtons[currentFocusTaskIndex]?.focus();
					break;
				}
				break;
		}
	}

	const searchOptions = {
		keys: ["label"],
		threshold: 0.4,
		//  A score of 0 indicates a perfect match, while a score of 1 indicates a complete mismatch.
		includeScore: true,
	};

	const clientsFuse = new Fuse(clients, searchOptions);
	const projectsFuse = new Fuse(projects, searchOptions);
	const tasksFuse = new Fuse(tasks, searchOptions);
	const latestEntriesFuse = new Fuse(latestTimeEntries, { ...searchOptions, sort: true });

	const scoreSort = (a, b) =>
		parseFloat(a.score) < parseFloat(b.score) ? -1 : parseFloat(a.score) > parseFloat(b.score) ? 1 : 0;

	const search = (q) => {
		if (!q) {
			searchResults = [];
			return;
		}

		const clientsResults = clientsFuse.search(q);
		const projectsResults = projectsFuse.search(q);
		const tasksResults = tasksFuse.search(q);
		let taskIndex = -1;

		searchResults = [...groupedData]
			.map((client) => {
				if (!client) {
					return { client: undefined };
				}

				const { projects: clientProjects, value: clientId } = client;
				const clientFound = clientsResults.find((result) => result.item.value === clientId);
				let clientScore = parseFloat(clientFound?.score ?? 1);
				let projectsScore = 1;
				let tasksScore = 1;

				const projects = clientProjects
					?.map((project) => {
						const projectFound = projectsResults.find((result) => result.item.value === project?.value);
						projectsScore = Math.min(projectsScore, parseFloat(projectFound?.score ?? 1));
						let tasksPerProjectScore = 1;

						const tasks = project?.tasks
							?.map((task) => {
								const taskFound = tasksResults.find((result) => result.item.value === task?.value);
								const score = parseFloat(taskFound?.score ?? 1);
								tasksScore = Math.min(tasksScore, score);
								tasksPerProjectScore = Math.min(tasksPerProjectScore, score);

								return clientFound || projectFound || taskFound ? { ...task, score } : undefined;
							})
							.filter((task) => task !== undefined)
							.sort(scoreSort);

						return tasks.length || projectFound
							? { ...project, score: Math.min(parseFloat(projectFound?.score ?? 1), tasksPerProjectScore), tasks }
							: undefined;
					})
					.filter((project) => project !== undefined)
					.sort(scoreSort);

				return projects?.length || clientFound
					? {
							...client,
							projects,
							score: Math.min(parseFloat(clientScore), parseFloat(projectsScore), parseFloat(tasksScore)),
					  }
					: undefined;
			})
			.filter((client) => client !== undefined)
			.sort(scoreSort)
			// Add index to each task for keyboard navigation
			.map((client) => ({
				...client,
				projects: client.projects.map((project) => ({
					...project,
					tasks: project.tasks.map((task) => {
						taskIndex++;
						return { ...task, taskIndex };
					}),
				})),
			}));

		searchResultsNumTasks = taskIndex + 1;
	};

	const handleShowTaskSelector = (event) => {
		event.stopPropagation();
		event.preventDefault();

		showTaskSelector = true;

		// We want to use the task input as a button
		// and then focus the actual search input
		searchInput?.focus();

		currentFocusTaskIndex = -1;
		currentLastestFocusTaskIndex = -1;

		showNoteAutosuggest = false;
		currentFocusNoteIndex = -1;
	};

	const handleHidePopovers = (event) => {
		// Allow clicking on select button
		if (event?.target?.id === "task-selector-button-input") {
			return;
		}

		showTaskSelector = false;
		showNoteAutosuggest = false;

		currentFocusTaskIndex = -1;
		currentLastestFocusTaskIndex = -1;
		currentFocusNoteIndex = -1;
	};

	onMount(() => {
		document.addEventListener("DOMContentLoaded", () => {
			if (noteInput) {
				noteInput.focus();
				setTimeout(() => {
					durationInput.disabled = false;
				}, 500);
			}
		});
		if (noteInput) {
			noteInput.focus();
			setTimeout(() => {
				durationInput.disabled = false;
			}, 500);
		}
		document.addEventListener("click", handleHidePopovers);

		return () => {
			document.removeEventListener("click", handleHidePopovers);
		};
	});

	const save = async () => {
		loading = true;
		taskError = false;
		if (!selected?.task?.value) {
			loading = false;
			taskError = true;
			return;
		}
		try {
			let entry = { duration, date, note, task: selected.task.value };
			const response = await fetch(action, {
				method: "POST",
				body: JSON.stringify(entry),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (response && response.ok) {
				document.querySelector(".app-timemanager [data-current-link]").click();
			}
		} catch (error) {
			console.error(error);
		}
		loading = false;
	};
</script>

<svelte:window on:keydown={handleKeyDown} />
<form
	class={`quick-add${loading ? " icon-loading" : ""}`}
	on:submit={(event) => {
		event.stopPropagation();
		event.preventDefault();

		save();
	}}
>
	<label class="note">
		{translate("timemanager", "Note")}
		<input
			use:noteSuggestPopperRef
			type="text"
			name="note"
			class="note"
			bind:value={note}
			placeholder={translate("timemanager", "Describe what you did...")}
			bind:this={noteInput}
			on:input={(event) => {
				const filterText = event?.target?.value ?? "";
				if (filterText.length > 2) {
					showNoteAutosuggest = true;

					const searchResult = latestEntriesFuse.search(filterText);
					noteAutosuggestList = searchResult.slice(0, 10).map((result) => result.item);
				} else {
					showNoteAutosuggest = false;

					noteAutosuggestList = [];
				}
			}}
			on:focus={(event) => {
				event.preventDefault();
				event.stopPropagation();

				const filterText = event?.target?.value ?? "";
				if (filterText.length > 2) {
					const searchResult = latestEntriesFuse.search(filterText);
					noteAutosuggestList = searchResult.slice(0, 10).map((result) => result.item);
					showNoteAutosuggest = true;
				}

				showTaskSelector = false;
				currentFocusTaskIndex = -1;
				currentLastestFocusTaskIndex = -1;
			}}
			on:click={(event) => {
				event.preventDefault();
				event.stopPropagation();
			}}
			autocapitalize="none"
			autocomplete="off"
			autocorrect="off"
			spellcheck="false"
			aria-autocomplete="list"
		/>
		{#if showNoteAutosuggest && noteAutosuggestList?.length}
			<div class="note-autosuggest popover" use:noteSuggestPopperContent={extraOpts}>
				<ul class="result">
					{#each noteAutosuggestList as suggestion, index}
						<li>
							<a
								class="task"
								href="?"
								bind:this={noteAutosuggestButtons[index]}
								on:click={(event) => {
									event.stopPropagation();
									event.preventDefault();

									const { time } = suggestion;
									if (!time) {
										return;
									}
									note = time.note ?? note;
									const startDate = parseISO(time.start);
									const endDate = parseISO(time.end);
									duration = differenceInMinutes(endDate, startDate) / 60 ?? 1;
									selected = {
										task: { label: suggestion?.task?.name, value: suggestion?.task?.uuid },
										project: { label: suggestion?.project?.name, value: suggestion?.project?.uuid },
										client: { label: suggestion?.client?.name, value: suggestion?.client?.uuid },
									};
									showNoteAutosuggest = false;
									currentFocusNoteIndex = -1;
								}}
								on:focus={() => {
									currentFocusNoteIndex = index;
								}}
								tabindex={-1}
							>
								{suggestion?.time?.note ?? ""} ({suggestion?.client?.name ?? ""} › {suggestion?.project?.name ?? ""} › {suggestion
									?.task?.name ?? ""})
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
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
				bind:this={durationInput}
				on:focus={() => {
					currentFocusNoteIndex = -1;
					showNoteAutosuggest = false;
				}}
				disabled
			/>
			<input type="date" name="date" class="date-input" bind:value={date} />
		</span>
	</label>
	<label class={`task-selector-trigger${taskError ? " error" : ""}`}>
		<!-- This is to make Svelte linter happy -->
		<input type="hidden" />
		{#if selected && !showTaskSelector}
			<a href="?" class="combo-entry-wrapper" on:focus={handleShowTaskSelector} on:click={handleShowTaskSelector}>
				<ul>
					<li>
						<span class="label muted">{translate("timemanager", "Client")}</span>
						<span class="value muted">{selected.client.label}</span>
					</li>
					<li>
						<span class="label muted">{translate("timemanager", "Project")}</span>
						<span class="value muted">{selected.project.label}</span>
					</li>
					<li>
						<span class="label">{translate("timemanager", "Task")}</span>
						<span class="value">{selected.task.label}</span>
					</li>
				</ul></a
			>
		{:else}
			{translate("timemanager", "Client, project or task")}
			<input
				id="task-selector-button-input"
				use:taskSelectorPopperRef
				on:focus={handleShowTaskSelector}
				type="text"
				placeholder={translate("timemanager", "Select...")}
				disabled={showTaskSelector}
				value={selected ? `${selected.client.label} › ${selected.project.label} › ${selected.task.label}` : ""}
				title={selected ? `${selected.client.label} › ${selected.project.label} › ${selected.task.label}` : ""}
			/>
		{/if}
	</label>
	{#if showTaskSelector}
		<div
			class="task-selector-popover popover"
			use:taskSelectorPopperContent={extraOpts}
			on:click={(event) => {
				event.stopPropagation();
				event.preventDefault();
			}}
		>
			<label class="search">
				<span class="hidden-visually">{translate("timemanager", "Type to search for client, project or task")}</span>
				<input
					bind:this={searchInput}
					bind:value={searchValue}
					on:input={() => search(searchValue)}
					class="search-input icon-search button-w-icon"
					type="text"
					placeholder={translate("timemanager", "Type to search for client, project or task")}
					autocapitalize="none"
					autocomplete="off"
					autocorrect="off"
					spellcheck="false"
					aria-autocomplete="list"
					autofocus
				/>
			</label>
			<div class="last-used">
				{#if lastUsed?.length && !searchValue}
					<ul class="result">
						{#each lastUsed as entry, index}
							<li>
								{#if index === 0}<span class="client">{translate("timemanager", "Last used")}</span>{/if}
								<a
									class="task last-used-wrapper"
									href="?"
									bind:this={lastUsedTasksButtons[index]}
									on:click={(event) => {
										event.stopPropagation();
										event.preventDefault();

										selected = {
											task: { label: entry?.task?.name, value: entry?.task?.uuid },
											project: { label: entry?.project?.name, value: entry?.project?.uuid },
											client: { label: entry?.client?.name, value: entry?.client?.uuid },
										};

										showTaskSelector = false;
									}}
									on:focus={() => {
										currentLastestFocusTaskIndex = index;
									}}
									tabindex={-1}
								>
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
					{#each searchResults as client}
						<ul class="result">
							<li>
								<span class="client">{client.label}</span>
								<ul>
									{#each client.projects as project}
										<li>
											<span class="project">{project.label}</span>
											<ul>
												{#each project.tasks as task}
													<li>
														<a
															href="?"
															bind:this={tasksButtons[task.taskIndex]}
															on:click={(event) => {
																event.stopPropagation();
																event.preventDefault();

																selected = {
																	client: { label: client.label, value: client.value },
																	project: { label: project.label, value: project.value },
																	task,
																};

																showTaskSelector = false;
															}}
															on:focus={() => {
																currentFocusTaskIndex = task.taskIndex;
															}}
															class="task"
															tabindex={-1}
														>
															{task.label}
														</a>
													</li>
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
			<!-- <button disabled={loading} type="button" class="icon-add button-w-icon button secondary task-add-button"
				>{translate("timemanager", "Add task")}</button
			> -->
			<div class="popover-arrow" data-popper-arrow />
		</div>
	{/if}
	<span class="actions">
		<!-- TRANSLATORS "Add" refers to adding a time entry. It's a button caption. -->
		<button disabled={loading} type="submit" class="button primary">{translate("timemanager", "Add")}</button>
	</span>
</form>
