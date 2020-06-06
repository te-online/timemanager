<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<div class="section">
			<?php if($_['client']) { ?>
				<div class="tm_object-details">
					<h2>
						<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label">Client</span>
							<?php p($_['client']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Client since</span>
						<?php p($_['client']->getCreatedYear()); ?>
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label">Note</span>
						<?php p($_['client']->getNote()); ?>
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label">Address</span>
						<?php p($_['client']->getStreet()); ?><br />
						<?php p($_['client']->getPostcode()); ?> <?php p($_['client']->getCity()); ?>
					</div>
					<form action="" method="post">
						<button type="submit" name="action" value="edit" class="btn primary">Edit client</button>
					</form>
					<form action="<?php p($urlGenerator->linkToRoute('timemanager.page.clients')); ?>/delete" method="post">
						<input type="hidden" name="uuid" value="<?php p($_['client']->getUuid()); ?>" />
						<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
						<button type="submit" name="action" value="delete" class="btn">Delete client</button>
					</form>
				</div>
				<div class="tm_add">
					<h3>New project</h3>
					<div id="new-item" class="tm_new-item">
						<form action="" method="post">
							<label>Project name<br />
								<input type="text" name="name" placeholder="Very special project" />
							</label><br />
							<label>For client<br />
								<?php if(count($_['clients']) > 0 ) {
									foreach($_['clients'] as $client) { ?>
									<strong><?php echo ($_['client'] && $_['client']->getUuid() === $client->getUuid()) ? p($client->getName()) : p(''); ?></strong>
								<?php } } else { ?>
									<p>No clients created yet. Go ahead and <a href="">create one</a>.</p>
								<?php } ?>
							</label><br />
							<input type="hidden" name="client" value="<?php echo $_['client'] ? $_['client']->getUuid() : ''; ?>">
							<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
							<button type="submit" class="btn primary">Add project</button>
						</form>
					</div>
				</div>
			<?php } ?>
		</div>
		<div class="section">
			<div class="tm_item-list">
				<h2>Projects</h2>
				<p>Select a client to show projects for</p>
				<form action="" method="get">
					<?php if(count($_['clients']) > 0 ) { ?>
						<select name="client">
							<?php foreach($_['clients'] as $client) { ?>
								<option value="<?php p($client->getUuid()); ?>"<?php echo ($_['client'] && $_['client']->getUuid() === $client->getUuid()) ? ' selected="selected"' : ''; ?>><?php p($client->getName()); ?></option>
							<?php } ?>
						</select>
						<button type="submit" class="btn">Show</button>
					<?php } else { ?>
						<p>No clients created yet. Go ahead and <a href="">create one</a>.</p>
					<?php } ?>
				</form>
				<?php if(!$_['client']) { ?>
					<p><strong>Select a client first to show projects for this client.</strong></p>
				<?php } else { ?>
					<?php if(count($_['projects']) > 0) {
						foreach($_['projects'] as $index => $project) { ?>
							<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
								<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $project->getUuid(); ?>">
									<h3><?php p($project->getName()); ?></h3>
									<div class="tm_item-excerpt">
										<span><?php p($project->task_count); ?> tasks</span>&nbsp;&middot;&nbsp;<span><?php p($project->hours); ?> Hrs.</span>
									</div>
								</a>
							</div>
					<?php } } else { ?>
						<div class="tm_item-row">
							<h3>You don't have any projects, yet. Try adding one by clicking “Add project.</h3>
						</div>
					<?php } ?>
					<div class="tm_summary">
						<p>
							<span class="tm_label">Client Total</span>
							<?php p($_['client']->hours); ?> Hrs.
						</p>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>