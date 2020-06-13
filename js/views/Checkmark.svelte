<script>
	export let uuid;
	export let initialState;
	export let action;
	export let requestToken;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	let state = initialState;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("Checkmark.svelte");
	});

	const save = async () => {
		loading = true;
		try {
			const response = await fetch(`${action}/${state}`, {
				method: "POST",
				body: JSON.stringify({ uuid }),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (!response || !response.ok) {
				// Roll back selection
				state = state === "paid" ? "unpaid" : "paid";
			}
		} catch (error) {
			console.error(error);
		}
		loading = false;
	};
</script>

<span class="checkbox-action">
	<input
		type="checkbox"
		id={`check_${uuid}`}
		class="checkbox"
		checked={initialState === 'paid'}
		disabled={loading}
		on:change|preventDefault={() => {
			state = state === 'paid' ? 'unpaid' : 'paid';
			save();
		}} />
	<label for={`check_${uuid}`} />
</span>
<span class={`checkbox-action-loading${loading ? ' icon-loading' : ''}`} />
