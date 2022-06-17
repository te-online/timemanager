<script>
	export let requestToken;
	export let startOfMonth;
	export let endOfMonth;

	import Select from "svelte-select";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import startOfYesterday from "date-fns/startOfYesterday";
	import format from "date-fns/format";
	import startOfToday from "date-fns/startOfToday";
	import startOfWeek from "date-fns/startOfWeek";
	import endOfWeek from "date-fns/endOfWeek";
	import startOfMonthMethod from "date-fns/startOfMonth";
	import endOfMonthMethod from "date-fns/endOfMonth";
	import startOfYear from "date-fns/startOfYear";
	import endOfYear from "date-fns/endOfYear";
	import sub from "date-fns/sub";
	import { getFirstDay, translate } from "@nextcloud/l10n";
	import { isFilterVisible } from "../lib/stores";
	import UserFilterSelect from "./UserFilterSelect.svelte";

	const dateFormat = "yyyy-MM-dd";
	$: loading = false;
	$: start = startOfMonth;
	$: end = endOfMonth;

	const presets = [
		{ label: translate("timemanager", "Today"), value: "today" },
		{ label: translate("timemanager", "Yesterday"), value: "yesterday" },
		{ label: translate("timemanager", "This Week"), value: "week" },
		{ label: translate("timemanager", "Last week"), value: "week-1" },
		{ label: translate("timemanager", "This month"), value: "month" },
		{ label: translate("timemanager", "Last month"), value: "month-1" },
		{ label: translate("timemanager", "This year"), value: "year" },
		{ label: translate("timemanager", "Last year"), value: "year-1" }
	];

	const applyRange = () => {
		// Prepare a link with get attributes
		const filterLinkElement = Helpers.getLinkEl();
		// Base off current url
		let newUrl = document.location.href;
		// Add filter attributes to url
		newUrl = Helpers.getUpdatedFilterUrl("start", start ? start : "", newUrl);
		newUrl = Helpers.getUpdatedFilterUrl("end", end ? end : "", newUrl);
		// Attach url to hidden pjax link
		filterLinkElement.href = newUrl;
		// Navigate
		filterLinkElement.click();
	};

	const handleSelectPreset = selectedValue => {
		const preset = selectedValue.detail.value;
		switch (preset) {
			case "today":
				start = format(startOfToday(), dateFormat);
				end = format(startOfToday(), dateFormat);
				break;
			case "yesterday":
				start = format(startOfYesterday(), dateFormat);
				end = format(startOfYesterday(), dateFormat);
				break;
			case "week":
				start = format(startOfWeek(startOfToday(), { weekStartsOn: getFirstDay() }), dateFormat);
				end = format(endOfWeek(startOfToday(), { weekStartsOn: getFirstDay() }), dateFormat);
				break;
			case "week-1":
				start = format(startOfWeek(sub(startOfToday(), { weeks: 1 }), { weekStartsOn: getFirstDay() }), dateFormat);
				end = format(endOfWeek(sub(startOfToday(), { weeks: 1 }), { weekStartsOn: getFirstDay() }), dateFormat);
				break;
			case "month":
				start = format(startOfMonthMethod(startOfToday()), dateFormat);
				end = format(endOfMonthMethod(startOfToday()), dateFormat);
				break;
			case "month-1":
				start = format(startOfMonthMethod(sub(startOfToday(), { months: 1 })), dateFormat);
				end = format(endOfMonthMethod(sub(startOfToday(), { months: 1 })), dateFormat);
				break;
			case "year":
				start = format(startOfYear(startOfToday()), dateFormat);
				end = format(endOfYear(startOfToday()), dateFormat);
				break;
			case "year-1":
				start = format(startOfYear(sub(startOfToday(), { years: 1 })), dateFormat);
				end = format(endOfYear(sub(startOfToday(), { years: 1 })), dateFormat);
				break;
		}
	};

	onMount(() => {
		// Parse current URL
		const urlParts = document.location.href.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			// Map over all query params
			queryStringParts.map(part => {
				// Split query params
				const partParts = part.split("=");
				const [name, value] = partParts;
				// Apply filters from query params
				if (name === "start" && value) {
					start = value;
				}
				if (name === "end" && value) {
					end = value;
				}
			});
		}

		isFilterVisible.set(true);
	});
</script>

<form class={`reports-timerange${loading ? ' icon-loading' : ''}`} on:submit|preventDefault={applyRange}>
	<UserFilterSelect {requestToken} />

	<label for="start" class="start">
		{translate('timemanager', 'From')}
		<input id="start" type="date" pattern="Y-m-d" bind:value={start} />
	</label>

	<label for="end" class="end">
		{translate('timemanager', 'To')}
		<input id="end" type="date" pattern="Y-m-d" bind:value={end} />
	</label>

	<label for="preset-select" class="status">
		{translate('timemanager', 'Presets')}
		<Select
			noOptionsMessage={translate('timemanager', 'No options')}
			placeholder={translate('timemanager', 'Select...')}
			inputAttributes={{ id: 'preset-select' }}
			items={presets}
			on:select={handleSelectPreset} />
	</label>

	<span class="actions">
		<button disabled={loading} type="submit" class="button primary">{translate('timemanager', 'Apply range')}</button>
	</span>

</form>
