<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');

?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<div class="section">
			<h2>Quickly add time entry</h2>
			<section class="section">
				<span data-svelte="QuickAdd.svelte"></span>
				<span data-store="<?php p($_['store']); ?>"></span>
			</section>

			<h2>Statistics</h2>
			<section class="section statistics" data-svelte="Statistics.svelte"></section>

			<?php print_unescaped( $this->inc( 'partials/latest' ) ); ?>
		</div>
	</div>
</div>