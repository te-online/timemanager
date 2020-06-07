<script>
	export let loading = false;
</script>

<div class="oc-dialog-dim" />
<div class={`oc-dialog ${loading ? 'icon-loading' : ''}`} style="position: fixed;">
	<slot />
</div>
