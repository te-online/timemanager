<script>
	import { onMount } from "svelte";
	import { translate } from "@nextcloud/l10n";

	onMount(() => {
		const openDetailsBeforePrint = () => {
			const details = document.querySelectorAll("details");
			details &&
				details.length &&
				details.forEach(details => {
					if (!details.open) {
						details.setAttribute("open", "open");
						details.setAttribute("data-print", "true");
					}
				});
		};
		const closeDetailsAfterPrint = () => {
			const details = document.querySelectorAll("details[data-print=true]");
			details &&
				details.length &&
				details.forEach(details => {
					details.removeAttribute("open");
					details.removeAttribute("data-print");
				});
		};
		window.addEventListener("beforeprint", openDetailsBeforePrint);
		window.addEventListener("afterprint", closeDetailsAfterPrint);

		return () => {
			window.removeEventListener("beforeprint", openDetailsBeforePrint);
			window.removeEventListener("afterprint", closeDetailsAfterPrint);
		};
	});
</script>

<button on:click={() => window.print()} type="button" class="button secondary">
	{translate('timemanager', 'Print report')}
</button>
