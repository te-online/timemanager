<script>
	export let action;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let taskName;
	export let initialDate;
	export let isServer;
	export let onCancel;
	export let onSubmit;

	let duration;
	let date = initialDate;
	let note = "";

	const submit = () => {
		onSubmit({ duration, date, note });
	};
</script>

<div class="inner tm_new-item">
	<h3>New time entry</h3>
	<form {action} on:submit|preventDefault={submit} method="post">
		<label>
			Duration (in hrs.)
			<br />
			<input
				autofocus
				type="number"
				name="duration"
				step="0.25"
				placeholder=""
				style="width: 100%"
				class="input-wide"
				bind:value={duration}
				required />
		</label>
		<br />
		<label>
			Date
			<br />
			<input type="date" name="date" style="width: 100%" class="input-wide" bind:value={date} />
		</label>
		<br />
		<label>
			Note
			<br />
			<!-- prettier-ignore -->
			<textarea
				style="width: 100%;"
				class="input-wide"
				name="note"
				placeholder="A long text ..."
				on:input={(e) => (note = e.target.value)}>{note}</textarea>
		</label>
		<br />
		<label class="space-top">
			For task
			<br />
			<strong>{taskName}</strong>
		</label>
		<label class="space-top">
			For project
			<br />
			<strong>{projectName}</strong>
		</label>
		<label class="space-top">
			For client
			<br />
			<strong>{clientName}</strong>
		</label>
		<br />
		<input type="hidden" name="requesttoken" value={requestToken} />
		<div class="oc-dialog-buttonrow twobuttons reverse">
			<button type="submit" class="button primary">Add time entry</button>
			{#if !isServer}
				<button type="reset" class="button" on:click|preventDefault={onCancel}>Cancel</button>
			{/if}
		</div>
	</form>
</div>
