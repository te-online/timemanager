<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<div class="section" data-svelte-hide="ClientEditor.svelte">
			<div class="tm_add">
				<div id="new-item" class="tm_new-item">
					<?php print_unescaped($_['templates']['ClientEditor.svelte']); ?>
				</div>
			</div>
		</div>

		<div class="section">
			<h2 class="list-title">Clients</h2>
			<span data-svelte="ClientEditorDialog.svelte"></span>
			<span data-store="<?php p($_['store']); ?>"></span>
			<?php if(count($_['clients']) > 0) {
				foreach($_['clients'] as $index => $client) { ?>
					<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $client->getUuid(); ?>">
							<h3><?php p($client->getName()); ?></h3>
							<div class="tm_item-excerpt">
								<span><?php p($client->project_count); ?> projects</span>&nbsp;&middot;&nbsp;<span><?php p($client->hours); ?> hrs.</span>&nbsp;&middot;&nbsp;<span>since <?php p($client->getCreatedYear()); ?></span>
							</div>
						</a>
					</div>
			<?php } } else { ?>
				<div class="tm_item-row">
					<h3>You don't have any clients, yet. Get started by clicking “Add client”.</h3>
				</div>
			<?php } ?>
		</div>
	</div>
</div>