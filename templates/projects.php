<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<?php if($_['client']) { ?>
			<div class="section">
				<div class="tm_object-details">
					<h2>
						<a class="timemanager-pjax-link" data-current-link href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
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
					<?php if ($_['client']->getStreet() || $_['client']->getPostcode() || $_['client']->getCity()) { ?>
						<div class="tm_object-details-item">
							<span class="tm_label">Address</span>
							<?php p($_['client']->getStreet()); ?><br />
							<?php p($_['client']->getPostcode()); ?> <?php p($_['client']->getCity()); ?>
						</div>
					<?php } ?>
					<?php if($_['client']) { ?>
						<span data-svelte="ClientEditorDialog.svelte"></span>
						<span data-svelte="DeleteButton.svelte"></span>
						<span data-svelte-hide="DeleteButton.svelte">
							<?php print_unescaped($_['templates']['DeleteButton.svelte']); ?>
						</span>
					<?php } ?>
				</div>
				<div class="tm_add" data-svelte-hide="ProjectEditor.svelte">
					<div id="new-item" class="tm_new-item">
						<?php print_unescaped($_['templates']['ProjectEditor.svelte']); ?>
					</div>
				</div>
			</div>
		<?php } ?>
		<div class="section">
			<div class="tm_item-list">
				<h2 class="list-title">Projects</h2>
				<?php if($_['client']) { ?>
					<span data-svelte="ProjectEditorDialog.svelte"></span>
					<span data-store="<?php p($_['store']); ?>"></span>
				<?php } ?>
				<?php if(!$_['client']) { ?>
					<p>Select a client to show projects for</p>
					<form action="" method="get">
						<?php if(count($_['clients']) > 0 ) { ?>
							<select name="client">
								<?php foreach($_['clients'] as $client) { ?>
									<option value="<?php p($client->getUuid()); ?>"<?php p($_['client'] && $_['client']->getUuid() === $client->getUuid()) ? ' selected="selected"' : ''; ?>><?php p($client->getName()); ?></option>
								<?php } ?>
							</select>
							<button type="submit" class="btn">Show</button>
						<?php } else { ?>
							<p>No clients created yet. Go ahead and <a href="">create one</a>.</p>
						<?php } ?>
					</form>
					<p><strong>Select a client first to show projects for this client.</strong></p>
				<?php } else { ?>
					<?php if(count($_['projects']) > 0) {
						foreach($_['projects'] as $index => $project) { ?>
							<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
								<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $project->getUuid(); ?>">
									<h3><?php p($project->getName()); ?></h3>
									<div class="tm_item-excerpt">
										<span><?php p($project->task_count); ?> tasks</span>&nbsp;&middot;&nbsp;<span><?php p($project->hours); ?> Hrs.</span>
									</div>
								</a>
							</div>
					<?php } } else { ?>
						<div class="tm_item-row">
							<h3>You don't have any projects, yet. Try adding one by clicking “Add project”.</h3>
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