<script>
	export let shareesForTimeEntries;

	import Select from "svelte-select";
	import { translate } from "@nextcloud/l10n";
	import { generateUrl } from "@nextcloud/router";
	import { onMount } from "svelte";

	let selectedSharee;

	const handleSelectSharee = event => {
		console.log({ selectedSharee, event });
		if (selectedSharee === event.detail.value || selectedSharee.value === event.detail.value) {
			return;
		}
		selectedSharee = event.detail;
		document.location.href = `${generateUrl("apps/timemanager")}?latestUserFilter=${selectedSharee.value}`;
	};

	const handleClearSharee = () => {
		document.location.href = generateUrl("apps/timemanager");
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
				if (name === "latestUserFilter" && value) {
					selectedSharee = value;
				}
			});
		}
	});
</script>

<label for="sharee-select" class="sharees">
	{translate('timemanager', 'Show entries for user')}
	<Select
		noOptionsMessage={translate('timemanager', 'No options')}
		placeholder={translate('timemanager', 'Select user...')}
		inputAttributes={{ id: 'sharee-select' }}
		on:select={handleSelectSharee}
		on:clear={handleClearSharee}
		items={shareesForTimeEntries}
		value={selectedSharee} />
</label>
