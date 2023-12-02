<script>
	export let shareAction;
	export let deleteShareAction;
	export let sharees;
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
	$: loading = false;
	let form;
	let selectedSharee;

	onMount(() => {
		Helpers.hideFallbacks("ShareDialog.svelte");
		if (form) {
			form.addEventListener("submit", submit);

			return () => {
				form.removeEventListener("submit", submit);
			};
		}
	});

	const submit = (e) => {
		e.preventDefault();
		dialogVisible = true;
	};

	const addShare = () => {
		form.submit();
	};

	const search = async (query) => {
		if (typeof query === "undefined") {
			return;
		}

		loading = true;

		const response = await fetch(
			generateOcsUrl(`apps/files_sharing/api/v1/sharees?search=${query}&format=json&perPage=20&itemType=[0]`),
			{
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
			},
		);

		loading = false;

		if (response.ok) {
			const { users, exact, groups } = (await response.json()).ocs.data;
			const existing_users = sharees.filter((s) => s.recipient_type === "user").map((share) => share.recipient_id);
			const existing_groups = sharees.filter((s) => s.recipient_type === "group").map((share) => share.recipient_id);
			return [...users, ...exact.users, ...groups, ...exact.groups]
				.filter((user) => !existing_users.includes(user.value.shareWith) && user.value.shareWith !== userId)
				.filter((group) => !existing_groups.includes(group.value.shareWith));
		}
	};

	const closeDialog = () => {
		dialogVisible = false;
	};

	const handleSelectSharee = (event) => {
		selectedSharee = event.detail;
	};
</script>

{#if dialogVisible}
	<Overlay>
		<div class="inner tm_new-item sharing-dialog">
			<label for="sharee-select" class="sharees">
				{translate("timemanager", "Share with")}
				<Select
					noOptionsMessage={loading ? translate("timemanager", "Loading...") : translate("timemanager", "No options")}
					placeholder={translate("timemanager", "Search...")}
					inputAttributes={{ id: "sharee-select" }}
					on:select={handleSelectSharee}
					loadOptions={search}
					value={selectedSharee}
				/>
			</label>
			<div class="sharee-list">
				<h4 class="tm_label">{translate("timemanager", "Existing shares")}</h4>
				{#if !sharees || !sharees.length}
					<p>
						<em>{translate("timemanager", "You haven't shared this client with anyone")}</em>
					</p>
				{/if}
				<ul>
					{#each sharees as sharee}
						<li>
							<figure>
								{#if sharee.recipient_type === "group"}
									<span aria-hidden="true" role="img" class="material-design-icon account-group-icon"
										><svg
											fill="currentColor"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											class="material-design-icon__svg"
											><path
												d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"
											></path></svg
										></span
									>
								{:else}
									<img
										src={generateUrl(`avatar/${sharee.recipient_id}/32`)}
										srcset={`${generateUrl(`avatar/${sharee.recipient_id}/32`)} 1x, ${generateUrl(
											`avatar/${sharee.recipient_id}/64`,
										)} 2x,
					${generateUrl(`avatar/${sharee.recipient_id}/128`)} 4x`}
										alt=""
									/>
								{/if}
								<figcaption>{sharee.recipient_display_name || sharee.recipient_id}</figcaption>
							</figure>
							<form action={deleteShareAction} method="post">
								<input type="hidden" name="client_uuid" value={clientUuid} />
								<input type="hidden" name="uuid" value={sharee.uuid} />
								<input type="hidden" name="requesttoken" value={requestToken} />
								<button type="submit" name="action" value="delete" class="btn small">
									{translate("timemanager", "Delete")}
								</button>
							</form>
						</li>
					{/each}
				</ul>
				<aside>
					<p>
						{translate("timemanager", "You automatically grant read-only access to projects and tasks by sharing.")}
					</p>
					<p>{translate("timemanager", "Users you share with can create time entries.")}</p>
					<p>
						{translate(
							"timemanager",
							"You can see all time entries, while others can only see and edit their own time entries.",
						)}
					</p>
				</aside>
			</div>
			<div class="oc-dialog-buttonrow twobuttons reverse">
				<button class="button primary" on:click|preventDefault={addShare}>{translate("timemanager", "Add")}</button>
				<button class="button" on:click|preventDefault={closeDialog}>{translate("timemanager", "Cancel")}</button>
			</div>
		</div>
	</Overlay>
{/if}

<form action={shareAction} bind:this={form} method="post">
	<input type="hidden" name="client_uuid" value={clientUuid} />
	<input
		type="hidden"
		name="user_id"
		value={selectedSharee && selectedSharee.value.shareType === 0 ? selectedSharee.value.shareWith : ""}
	/>
	<input
		type="hidden"
		name="group_id"
		value={selectedSharee && selectedSharee.value.shareType === 1 ? selectedSharee.value.shareWith : ""}
	/>
	<input type="hidden" name="requesttoken" value={requestToken} />
	<button type="submit" name="action" value="share" class="btn">{translate("timemanager", "Share client")}</button>
</form>
