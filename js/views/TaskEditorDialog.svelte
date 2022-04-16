<script>
	export let action;
	export let editAction;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let isServer;
	export let taskEditorButtonCaption;
	export let taskEditorCaption;
	export let taskUuid;
	export let editTaskData;

	import Overlay from "./Overlay.svelte";
	import TaskEditor from "./TaskEditor.svelte";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: show = false;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("TaskEditor.svelte");
		document.body.classList.add("tm_dialog_ready")
	});

	const save = async ({ name }) => {
		loading = true;
		try {
			let task = { name };
			if (taskUuid) {
				task = { ...task, uuid: taskUuid };
			}
			const response = await fetch(taskUuid ? editAction : action, {
				method: taskUuid ? "PATCH" : "POST",
				body: JSON.stringify(task),
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

<a href="#/" on:click|preventDefault={() => (show = !show)} class="button primary new">
	<span>{taskEditorButtonCaption}</span>
</a>
{#if show}
	<Overlay {loading}>
		<TaskEditor
			{action}
			{requestToken}
			onCancel={() => (show = false)}
			onSubmit={save}
			{clientName}
			{projectName}
			{isServer}
			{taskEditorButtonCaption}
			{taskEditorCaption}
			{editTaskData} />
	</Overlay>
{/if}
