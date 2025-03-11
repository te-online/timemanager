<script>
	export let action;
	export let editAction;
	export let requestToken;
	export let clientName;
	export let isServer;
	export let projectEditorButtonCaption;
	export let projectEditorCaption;
	export let projectUuid;
	export let editProjectData;

	import Overlay from "./Overlay.svelte";
	import ProjectEditor from "./ProjectEditor.svelte";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: show = false;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("ProjectEditor.svelte");
	});

	const save = async ({ name }) => {
		loading = true;
		try {
			let project = { name };
			if (projectUuid) {
				project = { ...project, uuid: projectUuid };
			}
			const response = await fetch(projectUuid ? editAction : action, {
				method: projectUuid ? "PATCH" : "POST",
				body: JSON.stringify(project),
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

<button type="button" on:click|preventDefault={() => (show = !show)} class="button primary new">
	<span>{projectEditorButtonCaption}</span>
</button>
{#if show}
	<Overlay {loading}>
		<ProjectEditor
			{action}
			{requestToken}
			onCancel={() => (show = false)}
			onSubmit={save}
			{clientName}
			{isServer}
			{projectEditorButtonCaption}
			{projectEditorCaption}
			{editProjectData}
		/>
	</Overlay>
{/if}
