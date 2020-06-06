<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<h2>Clients</h2>
		<div class="tm_add">
			<h3>New client</h3>
			<div id="new-item" class="tm_new-item">
				<form action="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>" method="post">
					<label>Client name<br />
						<input type="text" name="name" placeholder="Example Corp." />
					</label><br />
					<label>Note<br />
						<textarea name="note" placeholder="A long text ..."></textarea>
					</label>
					<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
					<button type="submit" class="btn primary">Add client</button>
				</form>
			</div>
		</div>
		<?php if(count($_['clients']) > 0) {
			foreach($_['clients'] as $index => $client) { ?>
				<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
					<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $client->getUuid(); ?>">
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