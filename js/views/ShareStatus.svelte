<script>
	export let sharees;
	export let sharedBy;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import { translate } from "@nextcloud/l10n";
	import { generateFilePath, generateUrl, imagePath } from "@nextcloud/router";

	onMount(() => {
		Helpers.hideFallbacks("ShareDialog.svelte");
	});
</script>

{#if sharees && sharees.length}
	<span class="tm_label">{translate("timemanager", "Shared with")}</span>
	<ul class="existing-sharees">
		{#each sharees as sharee, index}
			<li>
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
					`avatar/${sharedBy.author_user_id}/64`
				)} 2x,
					${generateUrl(`avatar/${sharedBy.author_user_id}/128`)} 4x`}
				alt=""
			/>
			{sharedBy.author_display_name || sharedBy.author_user_id}
		</li>
	</ul>
{/if}
