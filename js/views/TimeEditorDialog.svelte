<script>
	import { InputMethods } from "../lib/constants";

	export let action;
	export let editTimeEntryAction;
	export let timeUuid;
	export let requestToken;
	export let clientName;
	export let projectName;
	export let taskName;
	export let timeEditorButtonCaption;
	export let timeEditorCaption;
	export let editTimeEntryData;
	export let isServer;
	export let settings = {
		timemanager_input_method: InputMethods.decimal,
	};

	import Overlay from "./Overlay.svelte";
	import TimeEditor from "./TimeEditor.svelte";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import { parseISO, format } from "date-fns";

	const localeOptions = Helpers.getDateLocaleOptions();
	const dateFormat = "yyyy-MM-dd HH:mm:ss";

	$: show = false;
	$: loading = false;

	onMount(() => {
		Helpers.hideFallbacks("TimeEditor.svelte");
	});

	const save = async ({ duration, date, note }) => {
		loading = true;
		try {
			let entry = {
				duration,
				date: format(Helpers.toUTC(parseISO(date)), dateFormat, localeOptions),
				note,
			};
			if (timeUuid) {
				entry.uuid = timeUuid;
			}
			const response = await fetch(timeUuid ? editTimeEntryAction : action, {
				method: timeUuid ? "PATCH" : "POST",
				body: JSON.stringify(entry),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (response && response.ok) {
				show = false;
				document.querySelector(".app-timemanager [data-current-link]").click();
			}
		} catch (error) {
			console.error(error);
		}
		loading = false;
	};
</script>

{#if !timeUuid}
	<a href="#/" on:click|preventDefault={() => (show = !show)} class="button primary new">
		<span>{timeEditorButtonCaption}</span>
	</a>
{:else}
	<div class="tm_inline-hover-form">
		<button type="button" class="btn" on:click|preventDefault={() => (show = !show)}>{timeEditorButtonCaption}</button>
	</div>
{/if}
{#if show}
	<Overlay {loading}>
		<TimeEditor
			{action}
			{requestToken}
			onCancel={() => (show = false)}
			onSubmit={save}
			{clientName}
			{projectName}
			{taskName}
			{timeEditorButtonCaption}
			{timeEditorCaption}
			{editTimeEntryData}
			{isServer}
			{settings}
		/>
	</Overlay>
{/if}
