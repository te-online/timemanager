<script>
	export let startOfMonth;
	export let endOfMonth;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";

	$: loading = false;
	$: start = startOfMonth;
	$: end = endOfMonth;

	const applyRange = e => {
		// Prepare a link with get attributes
		const filterLinkElement = Helpers.getLinkEl();
		// Base off current url
		let newUrl = document.location.href;
		// Add filter attributes to url
		newUrl = Helpers.getUpdatedFilterUrl("start", start ? start : "", newUrl);
		newUrl = Helpers.getUpdatedFilterUrl("end", end ? end : "", newUrl);
		// Attach url to hidden pjax link
		filterLinkElement.href = newUrl;
		// Navigate
		filterLinkElement.click();
	};

	const getLinkEl = () => document.querySelector(".hidden-filter-link");

	onMount(() => {
		// Parse current URL
		const urlParts = document.location.href.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			// Map over all query params
			queryStringParts.map(part => {
				// Split query params
				const partParts = part.split("=");
				const [name, value] = partParts;
				// Apply filters from query params
				if (name === "start" && value) {
					start = value;
				}
				if (name === "end" && value) {
					end = value;
				}
			});
		}
	});
</script>

<form class={`reports-timerange${loading ? ' icon-loading' : ''}`} on:submit|preventDefault={applyRange}>
	<label for="start" class="start">
		{window.t('timemanager', 'From')}
		<input id="start" type="date" pattern="Y-m-d" bind:value={start} />
	</label>

	<label for="end" class="end">
		{window.t('timemanager', 'To')}
		<input id="end" type="date" pattern="Y-m-d" bind:value={end} />
	</label>

	<span class="actions">
		<button disabled={loading} type="submit" class="button primary">{window.t('timemanager', 'Apply range')}</button>
	</span>

</form>
