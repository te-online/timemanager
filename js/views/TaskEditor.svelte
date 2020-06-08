<script>
	export let action;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let isServer;
	export let onCancel;
	export let onSubmit;
	export let taskEditorButtonCaption;
	export let taskEditorCaption;
	export let editData;

	let name = editData ? editData.name : "";

	const submit = () => {
		onSubmit({ name });
	};
</script>

<div class="inner tm_new-item">
	<h3>{taskEditorCaption}</h3>
	<form {action} on:submit|preventDefault={submit} method="post">
		<label class="space-top">
			Task name
			<br />
			<input
				autofocus
				type="text"
				style="width: 100%;"
				class="input-wide"
				name="name"
				placeholder="Very special task"
				bind:value={name}
				required />
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
			<button type="submit" class="button primary">{taskEditorButtonCaption}</button>
			{#if !isServer}
				<button type="reset" class="button" on:click|preventDefault={onCancel}>Cancel</button>
			{/if}
		</div>
	</form>
</div>
