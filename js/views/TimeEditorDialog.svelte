<script>
	export let action;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let taskName;
	export let initialDate;
	export let isServer;

	import Overlay from "./Overlay.svelte";
	import TimeEditor from "./TimeEditor.svelte";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: show = false;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("TimeEditor.svelte");
	});

	const save = async ({ duration, date, note }) => {
		loading = true;
		try {
			const response = await fetch(action, {
				method: "POST",
				body: JSON.stringify({ duration, date, note }),
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
	<span>Add time entry</span>
</a>
{#if show}
	<Overlay {loading}>
		<TimeEditor
			{action}
			{requestToken}
			onCancel={() => (show = false)}
			onSubmit={save}
			{clientName}
			{projectName}
			{taskName}
			{initialDate}
			{isServer} />
	</Overlay>
{/if}
