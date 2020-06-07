<script>
	export let action;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let isServer;

	import Overlay from "./Overlay.svelte";
	import TaskEditor from "./TaskEditor.svelte";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: show = false;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("TaskEditor.svelte");
	});

	const save = async ({ name }) => {
		loading = true;
		try {
			const response = await fetch(action, {
				method: "POST",
				body: JSON.stringify({ name }),
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
	<span>Add task</span>
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
			{isServer} />
	</Overlay>
{/if}
