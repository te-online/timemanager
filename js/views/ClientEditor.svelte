<script>
	export let action;
	export let requestToken;
	export let isServer;
	export let onCancel;
	export let onSubmit;
	export let clientEditorButtonCaption;
	export let clientEditorCaption;
	export let editClientData;

	import { translate } from "@nextcloud/l10n";

	let name = editClientData ? editClientData.name : "";
	let note = editClientData ? editClientData.note : "";

	const submit = () => {
		onSubmit({ name, note });
	};
</script>

<div class="inner tm_new-item">
	<h3>{clientEditorCaption}</h3>
	<form {action} on:submit|preventDefault={submit} method="post">
		<label class="space-top">
			{translate('timemanager', 'Client name')}
			<br />
			<input
				autofocus
				type="text"
				style="width: 100%;"
				class="input-wide"
				name="name"
				placeholder={translate('timemanager', 'Example Corp.')}
				bind:value={name}
				required />
		</label>
		<label class="space-top">
			{translate('timemanager', 'Note')}
			<br />
			<!-- prettier-ignore -->
			<textarea
				style="width: 100%;"
				class="input-wide"
				name="note"
				placeholder=""
				on:input={(e) => (note = e.target.value)}>{note}</textarea>
		</label>
		<input type="hidden" name="requesttoken" value={requestToken} />
		<div class="oc-dialog-buttonrow twobuttons reverse">
			<button type="submit" class="button primary">{clientEditorButtonCaption}</button>
			{#if !isServer}
				<button type="reset" class="button" on:click|preventDefault={onCancel}>
					{translate('timemanager', 'Cancel')}
				</button>
			{/if}
		</div>
	</form>
</div>
