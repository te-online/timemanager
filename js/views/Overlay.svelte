<script>
	export let loading = false;
</script>

<div class="tm-oc-dialog-dim" />
<div class={`tm-oc-dialog ${loading ? 'icon-loading' : ''}`} style="position: fixed;">
	<slot />
</div>
