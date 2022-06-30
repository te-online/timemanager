<script>
	export let requestToken;
	export let isVisible = true;

	import Select from "svelte-select";
	import { translate } from "@nextcloud/l10n";
	import { generateOcsUrl, generateUrl } from "@nextcloud/router";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import { isFilterSet } from "../lib/stores";

	let selectedSharee;
	$: loading = false;

	const handleSelectSharee = event => {
		if (selectedSharee && selectedSharee.value.shareWith === event.detail.value.shareWith) {
			return;
		}
		selectedSharee = event.detail;
		// Prepare a link with get attributes
		const filterLinkElement = Helpers.getLinkEl();
		// Base off current url
		let newUrl = document.location.href;
		// Add filter attributes to url
		newUrl = Helpers.getUpdatedFilterUrl("userFilter", selectedSharee ? selectedSharee.value.shareWith : "", newUrl);
		// Attach url to hidden pjax link
		filterLinkElement.href = newUrl;
		// Navigate
		filterLinkElement.click();
	};

	const handleClearSharee = () => {
		handleSelectSharee({ detail: { value: { shareWith: "" }, label: "" } });
		isFilterSet.set(false);
	};

	const search = async query => {
		if (typeof query === "undefined") {
			return;
		}

		loading = true;

		const response = await fetch(
			generateOcsUrl(`apps/files_sharing/api/v1/sharees?search=${query}&format=json&perPage=20&itemType=[0]`),
			{
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json"
				}
			}
		);

		loading = false;

		if (response.ok) {
			const { users, exact } = (await response.json()).ocs.data;
			return [...users, ...exact.users];
		}
	};

	onMount(async () => {
		// Parse current URL
		const urlParts = document.location.href.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			// Map over all query params
			for (const part of queryStringParts) {
				// Split query params
				const partParts = part.split("=");
				const [name, value] = partParts;
				// Apply filters from query params
				if (name === "userFilter" && value) {
					const result = await search(value);
					if (result && result.length) {
						selectedSharee = result[0];
						isFilterSet.set(true);
					}
				}
			}
		}
	});
</script>

{#if isVisible}
	<label for="sharee-filter-select" class="sharee-filter-label">
		{translate('timemanager', 'Created by')}
		<Select
			noOptionsMessage={loading ? translate('timemanager', 'Loading...') : translate('timemanager', 'No options')}
			placeholder={translate('timemanager', 'Search...')}
			inputAttributes={{ id: 'sharee-filter-select' }}
			on:select={handleSelectSharee}
			on:clear={handleClearSharee}
			loadOptions={search}
			value={selectedSharee} />
	</label>
{/if}
