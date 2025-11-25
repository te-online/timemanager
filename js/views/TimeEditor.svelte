<script>
	export let action;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let taskName;
	export let isServer;
	export let onCancel;
	export let onSubmit;
	export let editTimeEntryData = {};
	export let timeEditorCaption;
	export let timeEditorButtonCaption;

	import { translate } from "@nextcloud/l10n";
	import { Helpers } from "../lib/helpers";
	import { format, parseISO } from "date-fns";

	const localeOptions = Helpers.getDateLocaleOptions();
	const timeFormat = "HH:mm";
	const dateFormat = "yyyy-MM-dd";
	const hasDate = Boolean(editTimeEntryData.date);

	const inputMethods = {
		decimal: "decimal",
		minutes: "minutes"
	}

	const startDate = hasDate ? parseISO(editTimeEntryData.date) : new Date();
	let date = format(startDate, dateFormat, localeOptions);
	let duration = editTimeEntryData.duration;
	let startTime = format(startDate, timeFormat, localeOptions);
	let endTime = Helpers.calculateEndTime(startTime, parseFloat(duration));
	let note = editTimeEntryData.note || "";
	$: inputMethod = inputMethods.decimal;

	const submit = () => {
		onSubmit({ duration, date: `${date}T${startTime}:00`, note });
	};
</script>

<div class="inner tm_new-item">
	<h3>{timeEditorCaption}</h3>
	<form {action} on:submit|preventDefault={submit} method="post">
		<span class="flex-fields">
			<span>
				<label>
					{translate("timemanager", "Duration (in hrs.)")}
					<br />
					{#if inputMethod === inputMethods.decimal}
						<input
							autofocus
							type="text"
							name="duration"
							placeholder=""
							class="duration-input"
							bind:value={duration}
							on:input={() => {
								duration = Helpers.normalizeDuration(duration);
								endTime = Helpers.calculateEndTime(startTime, parseFloat(duration));
							}}
							required
						/>
					{:else}
						<input
							autofocus
							type="time"
							name="duration"
							placeholder=""
							class="duration-input"
							bind:value={duration}
							on:input={() => {
								endTime = Helpers.calculateEndTime(
									startTime, parseFloat(Helpers.convertTimeDurationToDecimals(duration))
								);
							}}
							required
						/>
					{/if}
				</label>
				<a href="#/" on:click|preventDefault={() => {
					if(inputMethod === inputMethods.decimal) {
						inputMethod = inputMethods.minutes;
						const newDuration = duration.replace('.', ':');
						const [, minutes] = newDuration.split(':');
						duration = newDuration.replace(`:${minutes}`, +`0.${minutes}` * 60);
					} else {
						inputMethod = inputMethods.decimal;
						duration = duration.replace(':', '.');
						const [, minutes] = duration.split('.');
						duration = duration.replace(`.${minutes}`, minutes/60);
					}
				}}>Switch input method</a>
			</span>
			<span class="flex-fields">
				<label>
					{translate("timemanager", "Start time")}
					<br />
					<input
						type="time"
						name="startTime"
						placeholder="--:--"
						class="time-input"
						bind:value={startTime}
						on:input={() => (duration = Helpers.calculateDuration(startTime, endTime))}
						pattern="[0-9]{2}:[0-9]{2}"
						required
					/>
				</label>
				<label>
					{translate("timemanager", "End time")}
					<br />
					<input
						type="time"
						name="endTime"
						placeholder="--:--"
						class="time-input"
						pattern="[0-9]{2}:[0-9]{2}"
						bind:value={endTime}
						on:input={() => (duration = Helpers.calculateDuration(startTime, endTime))}
						required
					/>
				</label>
			</span>
		</span>
		<br />
		<label>
			{translate("timemanager", "Date")}
			<br />
			<input type="date" name="date" style="width: 100%" class="input-wide" bind:value={date} />
		</label>
		<br />
		<label>
			{translate("timemanager", "Note")}
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
			{translate("timemanager", "For task")}
			<br />
			<strong>{taskName}</strong>
		</label>
		<label class="space-top">
			{translate("timemanager", "For project")}
			<br />
			<strong>{projectName}</strong>
		</label>
		<label class="space-top">
			{translate("timemanager", "For client")}
			<br />
			<strong>{clientName}</strong>
		</label>
		<br />
		<input type="hidden" name="requesttoken" value={requestToken} />
		<div class="oc-dialog-buttonrow twobuttons reverse">
			<button type="submit" class="button primary">{timeEditorButtonCaption}</button>
			{#if !isServer}
				<button type="reset" class="button" on:click|preventDefault={onCancel}>
					{translate("timemanager", "Cancel")}
				</button>
			{/if}
		</div>
	</form>
</div>
