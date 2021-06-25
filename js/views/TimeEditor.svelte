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
	export let editTimeEntryData = {};
	export let timeEditorCaption;
	export let timeEditorButtonCaption;

	import { translate } from "@nextcloud/l10n";

	let duration = editTimeEntryData.duration;
	let date = editTimeEntryData.date || initialDate;
	let note = editTimeEntryData.note || "";

	const submit = () => {
		onSubmit({ duration, date, note });
	};
</script>

<div class="inner tm_new-item">
	<h3>{timeEditorCaption}</h3>
	<form {action} on:submit|preventDefault={submit} method="post">
		<label>
			{translate('timemanager', 'Duration (in hrs.)')}
			<br />
			<input
				autofocus
				type="number"
				name="duration"
				step="0.01"
				placeholder=""
				style="width: 100%"
				class="input-wide"
				bind:value={duration}
				required />
		</label>
		<br />
		<label>
			{translate('timemanager', 'Date')}
			<br />
			<input type="date" name="date" style="width: 100%" class="input-wide" bind:value={date} />
		</label>
		<br />
		<label>
			{translate('timemanager', 'Note')}
			<br />
			<!-- prettier-ignore -->
			<textarea
				style="width: 100%;"
				class="input-wide"
				name="note"
				placeholder={translate('timemanager', 'Describe what you did...')}
				on:input={(e) => (note = e.target.value)}>{note}</textarea>
		</label>
		<br />
		<label class="space-top">
			{translate('timemanager', 'For task')}
			<br />
			<strong>{taskName}</strong>
		</label>
		<label class="space-top">
			{translate('timemanager', 'For project')}
			<br />
			<strong>{projectName}</strong>
		</label>
		<label class="space-top">
			{translate('timemanager', 'For client')}
			<br />
			<strong>{clientName}</strong>
		</label>
		<br />
		<input type="hidden" name="requesttoken" value={requestToken} />
		<div class="oc-dialog-buttonrow twobuttons reverse">
			<button type="submit" class="button primary">{timeEditorButtonCaption}</button>
			{#if !isServer}
				<button type="reset" class="button" on:click|preventDefault={onCancel}>
					{translate('timemanager', 'Cancel')}
				</button>
			{/if}
		</div>
	</form>
</div>
