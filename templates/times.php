<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<?php if($_['client'] && $_['project'] && $_['task']) { ?>
			<div class="section">
				<div class="tm_object-details">
					<h2>
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label">Client</span>
							<?php p($_['client']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $_['project']->getUuid(); ?>">
							<span class="tm_label">Project</span>
							<?php p($_['project']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a class="timemanager-pjax-link" data-current-link href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $_['task']->getUuid(); ?>">
							<span class="tm_label">Task</span>
							<?php p($_['task']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Created</span>
						<?php p($_['task']->getCreatedDate()); ?>
					</div>
					<?php if($_['task']) { ?>
						<span data-svelte="TaskEditorDialog.svelte"></span>
						<span data-svelte="DeleteButton.svelte"></span>
						<span data-svelte-hide="DeleteButton.svelte">
							<?php print_unescaped($_['templates']['DeleteButton.svelte']); ?>
						</span>
					<?php } ?>
				</div>
				<div class="tm_add" data-svelte-hide="TimeEditor.svelte">
					<div id="new-item" class="tm_new-item">
						<?php print_unescaped($_['templates']['TimeEditor.svelte']); ?>
					</div>
				</div>
			</div>
		<?php } ?>
		<div class="section">
			<div class="tm_item-list">
				<h2 class="list-title">Time Entries</h2>
				<?php if($_['task']) { ?>
					<span data-svelte="TimeEditorDialog.svelte"></span>
					<span data-store="<?php p($_['store']); ?>"></span>
				<?php } ?>
				<?php if(!$_['task']) { ?>
					<p>Select a task to show time entries for</p>
					<form action="" method="get">
						<?php if(count($_['tasks']) > 0 ) { ?>
							<select name="task">
								<?php foreach($_['tasks'] as $task) { ?>
									<option value="<?php p($task->getUuid()); ?>"<?php echo ($_['task'] && $_['task']->getUuid() === $task->getUuid()) ? ' selected="selected"' : ''; ?>><?php p($task->getName()); ?></option>
								<?php } ?>
							</select>
							<button type="submit" class="btn">Show</button>
						<?php } else { ?>
							<p>No tasks created yet. Go ahead and <a href="">create one</a>.</p>
						<?php } ?>
					</form>
					<p><strong>Select a task first to show the times for this task.</strong></p>
				<?php } else { ?>
					<?php if(count($_['times']) > 0) {
						foreach($_['times'] as $index => $time) { ?>
							<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
								<h3><?php p($time->getDurationInHours()); ?> hrs.
									<?php
										$paymentStatus = 'unpaid';
										$paymentAction = 'paid';
										if(strtolower($time->getPaymentStatus()) === 'paid') {
											$paymentStatus = 'paid';
											$paymentAction = 'unpaid';
										}
									?>
									<form action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>/<?php p($paymentAction); ?>" method="post" style="display: inline">
										<input type="hidden" name="uuid" value="<?php p($time->getUuid()); ?>" />
										<input type="hidden" name="task" value="<?php p($_['task']->getUuid()); ?>" />
										<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
										<button type="submit" class="icon-checkmark tm_icon-checkmark tm_icon-checkmark-<?php p($paymentStatus); ?>"></button>
									</form>
								</h3>
								<div class="tm_item-excerpt">
									<div class="tm_item-note">
										<?php p($time->getNote()); ?>
									</div>
									<div class="tm_item-date">
										<?php p($time->getStartFormatted()); ?>
										<form action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>/delete" method="post" class="tm_inline-hover-form">
											<input type="hidden" name="uuid" value="<?php p($time->getUuid()); ?>" />
											<input type="hidden" name="task" value="<?php p($_['task']->getUuid()); ?>" />
											<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
											<button type="submit" class="btn">Delete</button>
									</form>
									</div>
								</div>
							</div>
					<?php } } else { ?>
						<div class="tm_item-row">
							<h3>You don't have any time entries, yet. Try adding one by clicking “Add time entry”.</h3>
						</div>
					<?php } ?>
					<div class="tm_summary">
						<p>
							<span class="tm_label">Task Total</span>
							<?php p($_['task']->hours); ?> Hrs.
						</p>
						<p>
							<span class="tm_label">Project</span>
							<?php p($_['project']->hours); ?> Hrs.
						</p>
						<p>
							<span class="tm_label">Client</span>
							<?php p($_['client']->hours); ?> Hrs.
						</p>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>