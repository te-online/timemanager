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
				<h3>New</h3>
				<div id="new-item">
					<form action="" method="post">
						<label>Client name<br />
							<input type="text" name="name" placeholder="Evil Corp." />
						</label>
						<label>Note<br />
							<textarea name="note" placeholder="A long text ..."></textarea>
						</label>
						<input type="hidden" name="csrf_token" value="<?php p($_['csrf_token']); ?>" />
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
								<span>0 projects</span> &middot; <span>0 hrs.</span> &middot; <span>since 2018</span>
							</div>
						</a>
					</div>
			<?php } } ?>
		</div>
	</div>

</div>