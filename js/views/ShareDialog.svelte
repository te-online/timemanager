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
	import { generateOcsUrl, generateUrl, imagePath } from "@nextcloud/router";

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
			}
		);

		loading = false;

		if (response.ok) {
			const { users, exact, groups } = (await response.json()).ocs.data;
			const existing_users = sharees.filter(s => s.recipient_type === 'user').map((share) => share.recipient_id);
			const existing_groups = sharees.filter(s => s.recipient_type === 'group').map((share) => share.recipient_id);
			return [...users, ...exact.users, ...groups, ...exact.groups].filter(
				(user) => !existing_users.includes(user.value.shareWith) && user.value.shareWith !== userId
			).filter(
				(group) => !existing_groups.includes(group.value.shareWith)
			).sort(
				(a, b) => a.label.localeCompare(b.label)
			);
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
								{#if sharee.recipient_type == "group"}
									<img src={imagePath('core', 'places/contacts.svg')} alt="" class="sharee-group" />
								{:else}
								<img
									src={generateUrl(`avatar/${sharee.recipient_id}/32`)}
									srcset={`${generateUrl(`avatar/${sharee.recipient_id}/32`)} 1x, ${generateUrl(
										`avatar/${sharee.recipient_id}/64`
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
							"You can see all time entries, while others can only see and edit their own time entries."
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
	<input type="hidden" name="user_id" value={selectedSharee && selectedSharee.value.shareType == 0 ? selectedSharee.value.shareWith : ""} />
	<input type="hidden" name="group_id" value={selectedSharee && selectedSharee.value.shareType == 1 ? selectedSharee.value.shareWith : ""} />
	<input type="hidden" name="requesttoken" value={requestToken} />
	<button type="submit" name="action" value="share" class="btn">{translate("timemanager", "Share client")}</button>
</form>
