<script>
	import { onMount } from "svelte";
	import { isFilterVisible } from "../lib/stores";
	import { translate } from "@nextcloud/l10n";

	onMount(() => {
		isFilterVisible.set(false);
	});
</script>

<button
	class="filter-button icon-filter"
	on:click={() => {
		isFilterVisible.update(isVisible => !isVisible);
	}}>
	{translate('timemanager', 'Filter')}
</button>
