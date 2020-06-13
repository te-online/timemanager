<script>
	import { onDestroy, onMount } from "svelte";

	onMount(() => {
		// Subscribe to changes of the viewmode
		// console.log("Mount")
	});

	onDestroy(() => {
		// Unsubscribe from store to avoid memory leaks
		// console.log("Unmount")
	});
</script>

<section class="section">
	<p>Coming soon</p>
</section>
