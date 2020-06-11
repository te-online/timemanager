<script>
	export let deleteTimeEntryAction;
	export let deleteTimeEntryUuid;
	export let requestToken;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import Overlay from "./Overlay.svelte";

	$: confirmation = false;

	onMount(() => {
		Helpers.hideFallbacks(`DeleteTimeEntryButton.svelte@${deleteTimeEntryUuid}`);
	});

	const submit = (e) => {
		e.preventDefault();
		confirmation = true;
	};

	const doDelete = async () => {
		confirmation = false;
		try {
			const element = document.querySelector(
				`#content.app-timemanager [data-remove-on-delete='${deleteTimeEntryUuid}']`
			);
			if (element) {
				element.classList.add("warning");
			}
			const response = await window.fetch(deleteTimeEntryAction, {
				method: "POST",
				body: JSON.stringify({
					uuid: deleteTimeEntryUuid,
				}),
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			});
			if (response && response.ok) {
				element.remove();
				document.querySelector(".app-timemanager [data-current-link]").click();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const cancelDelete = () => {
		confirmation = false;
	};
</script>

{#if confirmation}
	<Overlay>
		<div class="inner tm_new-item">
			Do you want to delete this time entry?
			<div class="oc-dialog-buttonrow twobuttons reverse">
				<button class="button primary" on:click|preventDefault={doDelete}>Delete</button>
				<button class="button" on:click|preventDefault={cancelDelete}>Cancel</button>
			</div>
		</div>
	</Overlay>
{/if}

<form action={deleteTimeEntryAction} on:submit={submit} method="post" class="tm_inline-hover-form">
	<input type="hidden" name="uuid" value={deleteTimeEntryUuid} />
	<input type="hidden" name="requesttoken" value={requestToken} />
	<button type="submit" name="action" value="delete" class="btn">Delete</button>
</form>
