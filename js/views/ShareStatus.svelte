<script>
	export let sharees;
	export let sharedBy;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import { translate } from "@nextcloud/l10n";
	import { generateUrl } from "@nextcloud/router";

	onMount(() => {
		Helpers.hideFallbacks("ShareDialog.svelte");
	});
</script>

{#if sharees && sharees.length}
	<span class="tm_label">{translate("timemanager", "Shared with")}</span>
	<ul class="existing-sharees">
		{#each sharees as sharee}
			<li>
				{#if sharee.recipient_type == "group"}
					<span aria-hidden="true" role="img" class="material-design-icon account-group-icon"
						><svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" class="material-design-icon__svg"
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
				{sharee.recipient_display_name || sharee.recipient_id}
			</li>
		{/each}
	</ul>
{/if}

{#if sharedBy}
	<span class="tm_label">{translate("timemanager", "Shared with you by")}</span>
	<ul class="existing-sharees">
		<li>
			<img
				src={generateUrl(`avatar/${sharedBy.author_user_id}/32`)}
				srcset={`${generateUrl(`avatar/${sharedBy.author_user_id}/32`)} 1x, ${generateUrl(
					`avatar/${sharedBy.author_user_id}/64`,
				)} 2x,
					${generateUrl(`avatar/${sharedBy.author_user_id}/128`)} 4x`}
				alt=""
			/>
			{sharedBy.author_display_name || sharedBy.author_user_id}
		</li>
	</ul>
{/if}
