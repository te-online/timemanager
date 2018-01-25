<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<div id="app">

	<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

	<div id="app-content">
		<div class="container">
			<h2>Clients</h2>
			<div class="add">
				<h3>New Client</h3>
				<div id="new-item">
					<form action="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>" method="post">
						<label>Client name<br />
							<input type="text" name="name" placeholder="Evil Corp." />
						</label>
						<label>Note<br />
							<textarea name="note" placeholder="A long text ..."></textarea>
						</label>
						<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
						<button type="submit" class="btn primary">Add</button>
					</form>
				</div>
			</div>
			<?php if(count($_['clients']) > 0) {
				foreach($_['clients'] as $index => $client) { ?>
					<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
						<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $client->getUuid(); ?>">
							<h3><?php p($client->getName()); ?></h3>
							<div class="tm_item-excerpt">
								<span><?php p($client->project_count); ?> projects</span> &middot; <span><?php p($client->hours); ?> hrs.</span> &middot; <span>since <?php p($client->getCreatedYear()); ?></span>
							</div>
						</a>
					</div>
			<?php } } ?>
		</div>
	</div>

</div>