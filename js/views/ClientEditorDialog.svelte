<script>
	export let action;
	export let requestToken;

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
			const response = await fetch(window.location.href, {
				method: "POST",
				body: JSON.stringify({ name, note }),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (response && response.ok) {
				show = false;
				document.querySelector("#app-navigation a.active").click();
			}
		} catch (error) {
			console.error(error);
		}
		loading = false;
	};
</script>

<a href="#/" on:click|preventDefault={() => (show = !show)} class="button primary new">
	<span>Add client</span>
</a>
{#if show}
	<Overlay {loading}>
		<ClientEditor {action} {requestToken} onCancel={() => (show = false)} onSubmit={save} />
	</Overlay>
{/if}
