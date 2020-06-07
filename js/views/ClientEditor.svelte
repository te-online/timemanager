<script>
	export let action;
	export let requestToken;
	export let isServer;
	export let onCancel;
	export let onSubmit;

	const value = "";
	let name;
	let note;

	const submit = () => {
		onSubmit({ name, note });
	};
</script>

<div class="inner">
	<h3>New client</h3>
	<form {action} on:submit|preventDefault={submit} method="post">
		<label>
			Client name
			<br />
			<input
				autofocus
				type="text"
				style="width: 100%;"
				class="input-wide"
				name="name"
				placeholder="Example Corp."
				bind:value={name} />
		</label>
		<label>
			Note
			<br />
			<textarea
				style="width: 100%;"
				class="input-wide"
				name="note"
				placeholder="A long text ..."
				on:input={(e) => (note = e.target.value)}>
				{value}
			</textarea>
		</label>
		<input type="hidden" name="requesttoken" value={requestToken} />
		<div class="oc-dialog-buttonrow twobuttons">
			{#if !isServer}
				<button type="reset" class="button" on:click|preventDefault={onCancel}>Cancel</button>
			{/if}
			<button type="submit" class="button primary">Add client</button>
		</div>
	</form>
</div>
