<script>
	export let sharees;
	export let sharedBy;

	import { onMount } from "svelte";
	import { Helpers } from "../lib/helpers";
	import { translate } from "@nextcloud/l10n";
	import { generateUrl } from "@nextcloud/router";

	$: dialogVisible = false;
	let form;
	let selectedSharee;

	onMount(() => {
		Helpers.hideFallbacks("ShareDialog.svelte");
	});
</script>

{#if sharees && sharees.length}
	<span class="tm_label">{translate('timemanager', 'Shared with')}</span>
	<ul class="existing-sharees">
		{#each sharees as sharee, index}
			<li>
				<img
					src={generateUrl(`avatar/${sharee.recipient_user_id}/32`)}
					srcset={`${generateUrl(`avatar/${sharee.recipient_user_id}/32`)} 1x, ${generateUrl(`avatar/${sharee.recipient_user_id}/64`)} 2x,
					${generateUrl(`avatar/${sharee.recipient_user_id}/128`)} 4x`}
					alt="" />
				{sharee.recipient_display_name || sharee.recipient_user_id}
			</li>
		{/each}
	</ul>
{/if}

{#if sharedBy}
	<span class="tm_label">{translate('timemanager', 'Shared with you by')}</span>
	<ul class="existing-sharees">
		<li>
			<img
				src={generateUrl(`avatar/${sharedBy.author_user_id}/32`)}
				srcset={`${generateUrl(`avatar/${sharedBy.author_user_id}/32`)} 1x, ${generateUrl(`avatar/${sharedBy.author_user_id}/64`)} 2x,
					${generateUrl(`avatar/${sharedBy.author_user_id}/128`)} 4x`}
				alt="" />
			{sharedBy.author_display_name || sharedBy.author_user_id}
		</li>
	</ul>
{/if}
