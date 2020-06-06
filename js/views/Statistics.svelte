<script>
	import { onDestroy, onMount } from "svelte";

	onMount(() => {
		// Subscribe to changes of the viewmode
		console.log("Mount")
	});

	onDestroy(() => {
		// Unsubscribe from store to avoid memory leaks
		console.log("Unmount")
	});
</script>

<h1>Hello World</h1>
