<script>
	export let requestToken;

	import { onMount, onDestroy } from "svelte";
	import { isFilterVisible } from "../lib/stores";
	import UserFilterSelect from "./UserFilterSelect.svelte";

	$: isVisible = false;

	const unsubscribe = isFilterVisible.subscribe(value => {
		isVisible = value;
	});

	onDestroy(unsubscribe);
</script>

<div class={isVisible ? 'sharee-filter' : ''}>
	<UserFilterSelect {isVisible} {requestToken} />
</div>
