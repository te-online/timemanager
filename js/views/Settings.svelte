<script>
	export let settingsAction;
	export let requestToken;
	export let settings = {
		handle_conflicts: false
	};

	import { onMount } from "svelte";
	import { translate } from "@nextcloud/l10n";

	$: handleConflicts = false;
	$: loading = false;

	onMount(() => {
		handleConflicts = settings.handle_conflicts;
	});

	const save = async () => {
		loading = true;
		await fetch(settingsAction, {
			method: "POST",
			body: JSON.stringify({
				handle_conflicts: !!handleConflicts
			}),
			headers: {
				requesttoken: requestToken,
				"content-type": "application/json"
			}
		});
		loading = false;
	};
</script>

<span class="checkbox-action">
	<input
		type="checkbox"
		class="checkbox"
		id="settings_handle_conflicts"
		checked={handleConflicts}
		disabled={loading}
		on:change|preventDefault={e => {
			handleConflicts = e.target.checked;
			save();
		}} />
	<label for="settings_handle_conflicts">
		{translate('timemanager', "My (mobile) apps can handle conflicts (leave unchecked if you're unsure)")}
	</label>
</span>
<span class={`checkbox-action-loading${loading ? ' icon-loading' : ''}`} style="left: 5px;" />
