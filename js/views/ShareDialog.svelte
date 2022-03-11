<script>
	export let shareAction;
	export let deleteShareAction;
	export let shares;
	export let clientUuid;
	export let requestToken;
	export let userId;

	import Select from "svelte-select";
	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import Overlay from "./Overlay.svelte";
	import { translate } from "@nextcloud/l10n";
	import { generateOcsUrl, generateUrl } from "@nextcloud/router";

	$: dialogVisible = false;
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
		dialogVisible = true;
	};

	const addShare = () => {
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

	const closeDialog = () => {
		dialogVisible = false;
	};

	const handleSelectSharee = event => {
		selectedSharee = event.detail;
	};
</script>

{#if dialogVisible}
	<Overlay>
		<div class="inner tm_new-item sharing-dialog">
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
			<div class="sharee-list">
				<h4 class="tm_label">{translate('timemanager', 'Existing shares')}</h4>
				{#if !shares || !shares.length}
					<p>
						<em>{translate('timemanager', "You haven't shared this client with anyone")}</em>
					</p>
				{/if}
				<ul>
					{#each shares as share}
						<li>
							<figure>
								<img
									src={generateUrl(`avatar/${share.recipient_user_id}/32`)}
									srcset={`${generateUrl(`avatar/${share.recipient_user_id}/32`)} 1x, ${generateUrl(`avatar/${share.recipient_user_id}/64`)} 2x,
					${generateUrl(`avatar/${share.recipient_user_id}/128`)} 4x`}
									alt="" />
								<figcaption>{share.recipient_user_id}</figcaption>
							</figure>
							<form action={deleteShareAction} method="post">
								<input type="hidden" name="client_uuid" value={clientUuid} />
								<input type="hidden" name="uuid" value={share.uuid} />
								<input type="hidden" name="requesttoken" value={requestToken} />
								<button type="submit" name="action" value="delete" class="btn small">
									{translate('timemanager', 'Delete')}
								</button>
							</form>
						</li>
					{/each}
				</ul>
			</div>
			<div class="oc-dialog-buttonrow twobuttons reverse">
				<button class="button primary" on:click|preventDefault={addShare}>{translate('timemanager', 'Add')}</button>
				<button class="button" on:click|preventDefault={closeDialog}>{translate('timemanager', 'Close')}</button>
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

{#if shares && shares.length}
	<ul class="existing-sharees">
		<li>{translate('timemanager', 'Shared with')}</li>
		{#each shares as share, index}
			<li>
				<img
					src={generateUrl(`avatar/${share.recipient_user_id}/32`)}
					srcset={`${generateUrl(`avatar/${share.recipient_user_id}/32`)} 1x, ${generateUrl(`avatar/${share.recipient_user_id}/64`)} 2x,
					${generateUrl(`avatar/${share.recipient_user_id}/128`)} 4x`}
					alt="" />
				{share.recipient_user_id}
				{#if index < shares.length - 1}&nbsp;&middot;{/if}
			</li>
		{/each}
	</ul>
{/if}
