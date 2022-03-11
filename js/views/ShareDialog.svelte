<script>
	export let shareAction;
	export let shares;
	export let clientUuid;
	export let requestToken;
	export let userId;

	import Select from "svelte-select";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import Overlay from "./Overlay.svelte";
	import { translate } from "@nextcloud/l10n";
	import { generateOcsUrl } from "@nextcloud/router";

	$: confirmation = false;
	let form;
	let selectedSharee;

	onMount(() => {
		Helpers.hideFallbacks("ShareDialog.svelte");
		form.addEventListener("submit", submit);

		return () => {
			form.removeEventListener("submit", submit);
		};
	});

	const submit = e => {
		e.preventDefault();
		confirmation = true;
	};

	const addShare = () => {
		confirmation = false;
		form.removeEventListener("submit", submit);
		form.submit();
	};

	const search = async query => {
		if (typeof query === "undefined") {
			return;
		}

		const response = await fetch(
			generateOcsUrl(`apps/files_sharing/api/v1/sharees?search=${query}&format=json&perPage=20&itemType=[0]`),
			{
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json"
				}
			}
		);
		if (response.ok) {
			const { users, exact } = (await response.json()).ocs.data;
			const existing = shares.map(share => share.recipient_user_id);
			return [...users, ...exact.users].filter(
				user => !existing.includes(user.value.shareWith) && user.value.shareWith !== userId
			);
		}
	};

	const cancelShare = () => {
		confirmation = false;
	};

	const handleSelectSharee = event => {
		selectedSharee = event.detail;
	};
</script>

{#if confirmation}
	<Overlay>
		<div class="inner tm_new-item sharing">
			<label for="sharee-select" class="sharees">
				{translate('timemanager', 'Share with')}
				<Select
					noOptionsMessage={translate('timemanager', 'No options')}
					placeholder={translate('timemanager', 'Search...')}
					inputAttributes={{ id: 'sharee-select' }}
					on:select={handleSelectSharee}
					loadOptions={search}
					value={selectedSharee} />
			</label>
			Existing shares
			<ul>
				{#each shares as share}
					<li>{share.recipient_user_id}</li>
				{/each}
			</ul>
			<div class="oc-dialog-buttonrow twobuttons reverse">
				<button class="button primary" on:click|preventDefault={addShare}>{translate('timemanager', 'Add')}</button>
				<button class="button" on:click|preventDefault={cancelShare}>{translate('timemanager', 'Cancel')}</button>
			</div>
		</div>
	</Overlay>
{/if}

<form action={shareAction} bind:this={form} method="post">
	<input type="hidden" name="client_uuid" value={clientUuid} />
	<input type="hidden" name="user_id" value={selectedSharee ? selectedSharee.value.shareWith : ''} />
	<input type="hidden" name="requesttoken" value={requestToken} />
	<button type="submit" name="action" value="share" class="btn">{translate('timemanager', 'Share client')}</button>
</form>
