<script>
	export let requestToken;

	import { onMount } from "svelte";
	import { isFilterSet } from "../lib/stores";
	import { translate } from "@nextcloud/l10n";
	import UserFilterSelect from "./UserFilterSelect.svelte";
	import { createPopperActions } from "svelte-popperjs";

	const [popperRef, popperContent] = createPopperActions({
		placement: "bottom",
		strategy: "fixed"
	});
	const extraOpts = {
		modifiers: [{ name: "offset", options: { offset: [0, 8] } }]
	};

	let showTooltip = false;

	onMount(() => {
		const hideTooltip = e => {
			if (e.key === "Escape") {
				showTooltip = false;
			}
		};
		document.addEventListener("keyup", hideTooltip);

		isFilterSet.set(false);

		// Parse current URL
		const urlParts = document.location.href.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			// Map over all query params
			for (const part of queryStringParts) {
				// Split query params
				const partParts = part.split("=");
				const [name, value] = partParts;
				// Apply filters from query params
				if (name === "userFilter" && value) {
					isFilterSet.set(true);
				}
			}
		}

		return () => {
			document.removeEventListener("keyup", hideTooltip);
			isFilterSet.set(false);
		};
	});
</script>

<button
	class={`filter-button icon-filter ${$isFilterSet ? 'active' : ''}`}
	use:popperRef
	on:click={() => {
		showTooltip = !showTooltip;
	}}>
	{translate('timemanager', 'Filter by person')}
</button>
{#if showTooltip}
	<div class="popover" use:popperContent={extraOpts}>
		<UserFilterSelect isVisible={showTooltip} {requestToken} />
	</div>
{/if}
