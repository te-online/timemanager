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
				<p>Coming soon</p>
			</section>

			<h2>Statistics</h2>
			<div data-svelte="statistics">
				<?php print_unescaped($_['templates']['Statistics.svelte']); ?>
			</div>

			<?php print_unescaped( $this->inc( 'partials/latest' ) ); ?>
		</div>
	</div>
</div>