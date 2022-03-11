<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
$l = \OC::$server->getL10N('timemanager');
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<?php if($_['client']) { ?>
			<div class="section">
				<div class="tm_object-details">
					<h2>
						<a class="timemanager-pjax-link" data-current-link href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label"><?php p($l->t('Client')); ?></span>
							<?php p($_['client']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label"><?php p($l->t('Client since')); ?></span>
						<?php p($_['client']->getCreatedYear()); ?>
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label"><?php p($l->t('Note')); ?></span>
						<?php p($_['client']->getNote()); ?>
					</div>
					<?php if ($_['client']->getStreet() || $_['client']->getPostcode() || $_['client']->getCity()) { ?>
						<div class="tm_object-details-item">
							<span class="tm_label"><?php p($l->t('Address')); ?></span>
							<?php p($_['client']->getStreet()); ?><br />
							<?php p($_['client']->getPostcode()); ?> <?php p($_['client']->getCity()); ?>
						</div>
					<?php } ?>
					<?php if($_['client']) { ?>
						<div class="tm_object-details-item">
							<span data-svelte="ShareStatus.svelte"></span>
							<span data-svelte-hide="ShareStatus.svelte">
								<?php print_unescaped($_['templates']['ShareStatus.svelte']); ?>
							</span>
						</div>
						<?php if($_['canEdit']) { ?>
							<span data-svelte="ClientEditorDialog.svelte"></span>
							<span data-svelte="DeleteButton.svelte"></span>
							<span data-svelte-hide="DeleteButton.svelte">
								<?php print_unescaped($_['templates']['DeleteButton.svelte']); ?>
							</span>
							<span data-svelte="ShareDialog.svelte"></span>
							<span data-svelte-hide="ShareDialog.svelte">
								<?php print_unescaped($_['templates']['ShareDialog.svelte']); ?>
							</span>
						<?php } ?>
					<?php } ?>
				</div>
				<?php if($_['canEdit']) { ?>
					<div class="tm_add" data-svelte-hide="ProjectEditor.svelte">
						<div id="new-item" class="tm_new-item">
							<?php print_unescaped($_['templates']['ProjectEditor.svelte']); ?>
						</div>
					</div>
				<?php } ?>
			</div>
		<?php } ?>
		<div class="section">
			<div class="tm_item-list">
				<h2 class="list-title"><?php p($l->t('Projects')); ?></h2>
				<?php if($_['client'] && $_['canEdit']) { ?>
					<span data-svelte="ProjectEditorDialog.svelte"></span>
				<?php } ?>
				<span data-store="<?php p($_['store']); ?>"></span>
				<?php if(!$_['client']) { ?>
					<p><?php p($l->t('Select a client to show projects for')); ?></p>
					<form action="" method="get">
						<?php if(count($_['clients']) > 0 ) { ?>
							<select name="client">
								<?php foreach(array_reverse($_['clients']) as $client) { ?>
									<option value="<?php p($client->getUuid()); ?>"><?php p($client->getName()); ?></option>
								<?php } ?>
							</select>
							<button type="submit" class="btn"><?php p($l->t('Show')); ?></button>
						<?php } else { ?>
							<p><?php p($l->t('No clients created yet. Go ahead and create one.')); ?></p>
						<?php } ?>
					</form>
					<p><strong><?php p($l->t('Select a client first to show projects for this client.')); ?></strong></p>
				<?php } else { ?>
					<?php if(count($_['projects']) > 0) {
						foreach($_['projects'] as $project) { ?>
							<div class="tm_item-row with-link">
								<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $project->getUuid(); ?>">
									<h3><?php p($project->getName()); ?></h3>
									<div class="tm_item-excerpt">
										<span><?php p($l->t('%s tasks', [$project->task_count])); ?></span>&nbsp;&middot;&nbsp;<span><?php p($project->hours); ?> <?php p($l->t('hrs.')); ?></span>
									</div>
								</a>
							</div>
					<?php } } else { ?>
						<div class="tm_item-row">
							<h3><?php p($l->t("You don't have any projects, yet. Try adding one by clicking “Add project”.")); ?></h3>
						</div>
					<?php } ?>
					<div class="tm_summary">
						<p>
							<span class="tm_label"><?php p($l->t('Client total')); ?></span>
							<?php p($_['client']->hours); ?> <?php p($l->t('hrs.')); ?>
						</p>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>