<script>
	export let action;
	export let editAction;
	export let requestToken;
	export let clientEditorButtonCaption;
	export let clientEditorCaption;
	export let clientUuid;
	export let editClientData;

	import Overlay from "./Overlay.svelte";
	import ClientEditor from "./ClientEditor.svelte";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: show = false;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("ClientEditor.svelte");
	});

	const save = async ({ name, note }) => {
		loading = true;
		try {
			let client = { name, note };
			if (clientUuid) {
				client = { ...client, uuid: clientUuid };
			}
			const response = await fetch(clientUuid ? editAction : action, {
				method: clientUuid ? "PATCH" : "POST",
				body: JSON.stringify(client),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (response && response.ok) {
				show = false;
				if (clientUuid) {
					document.querySelector(".app-timemanager [data-current-link]").click();
				} else {
					document.querySelector("#app-navigation a.active").click();
				}
			}
		} catch (error) {
			console.error(error);
		}
		loading = false;
	};
</script>

<button type="button" on:click|preventDefault={() => (show = !show)} class="button primary new">
	<span>{clientEditorButtonCaption}</span>
</button>
{#if show}
	<Overlay {loading}>
		<ClientEditor
			{action}
			{requestToken}
			onCancel={() => (show = false)}
			onSubmit={save}
			{clientEditorButtonCaption}
			{clientEditorCaption}
			{editClientData}
		/>
	</Overlay>
{/if}
