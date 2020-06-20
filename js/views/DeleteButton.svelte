<script>
	export let deleteAction;
	export let deleteUuid;
	export let deleteButtonCaption;
	export let deleteItemName;
	export let requestToken;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import Overlay from "./Overlay.svelte";

	$: confirmation = false;
	let form;

	onMount(() => {
		Helpers.hideFallbacks("DeleteButton.svelte");
		form.addEventListener("submit", submit);
	});

	const submit = (e) => {
		e.preventDefault();
		confirmation = true;
	};

	const doDelete = () => {
		confirmation = false;
		form.removeEventListener("submit", submit);
		form.submit();
	};

	const cancelDelete = () => {
		confirmation = false;
	};
</script>

{#if confirmation}
	<Overlay>
		<div class="inner tm_new-item">
			{(window.t('timemanager', 'Do you want to delete {deleteItemName}?'), { deleteItemName })}
			<div class="oc-dialog-buttonrow twobuttons reverse">
				<button class="button primary" on:click|preventDefault={doDelete}>{window.t('timemanager', 'Delete')}</button>
				<button class="button" on:click|preventDefault={cancelDelete}>{window.t('timemanager', 'Cancel')}</button>
			</div>
		</div>
	</Overlay>
{/if}

<form action={deleteAction} bind:this={form} method="post">
	<input type="hidden" name="uuid" value={deleteUuid} />
	<input type="hidden" name="requesttoken" value={requestToken} />
	<button type="submit" name="action" value="delete" class="btn">{deleteButtonCaption}</button>
</form>
