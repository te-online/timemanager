<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
$l = \OC::$server->getL10N('timemanager');
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<?php if($_['client'] && $_['project'] && $_['task']) { ?>
			<div class="section">
				<div class="tm_object-details">
					<h2>
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label"><?php p($l->t('Client')); ?></span>
							<?php p($_['client']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $_['project']->getUuid(); ?>">
							<span class="tm_label"><?php p($l->t('Project')); ?></span>
							<?php p($_['project']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a class="timemanager-pjax-link" data-current-link href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $_['task']->getUuid(); ?>">
							<span class="tm_label"><?php p($l->t('Task')); ?></span>
							<?php p($_['task']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label"><?php p($l->t('Created')); ?></span>
						<?php p($_['task']->getCreatedDate()); ?>
					</div>
					<div class="tm_object-details-item">
						<span data-svelte="ShareStatus.svelte"></span>
						<span data-svelte-hide="ShareStatus.svelte">
							<?php print_unescaped($_['templates']['ShareStatus.svelte']); ?>
						</span>
					</div>
					<?php if($_['task'] && $_['canEdit']) { ?>
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
				<h2 class="list-title"><?php p($l->t('Time entries')); ?></h2>
				<?php if($_['task']) { ?>
					<span data-svelte="TimeEditorDialog.svelte"></span>
					<span data-store="<?php p($_['store']); ?>"></span>
				<?php } ?>
				<?php if(!$_['task']) { ?>
					<p><?php p($l->t('Select a task to show time entries for')); ?></p>
					<form action="" method="get">
						<?php if(count($_['tasks']) > 0) { ?>
							<select name="task">
								<?php foreach(array_reverse($_['tasks']) as $task) {
									// Look up project for task
									$project = array_reduce($_['projects'], function ($carry, $oneProject) use(&$task) {
										if ($oneProject->getUuid() === $task->getProjectUuid()) {
											$carry = $oneProject;
										}
										return $carry;
									});
									// Look up client for project
									$client = array_reduce($_['clients'], function ($carry, $oneClient) use(&$project) {
										if ($oneClient->getUuid() === $project->getClientUuid()) {
											$carry = $oneClient;
										}
										return $carry;
									});
									?>
									<option value="<?php p($task->getUuid()); ?>"><?php p($client->getName() . ' › ' . $project->getName() . ' › ' . $task->getName()); ?></option>
								<?php } ?>
							</select>
							<button type="submit" class="btn"><?php p($l->t('Show')); ?></button>
						<?php } else { ?>
							<p><?php p($l->t('No tasks created yet. Go ahead and create one.')); ?></p>
						<?php } ?>
					</form>
					<p><strong><?php p($l->t('Select a task first to show the times for this task.')); ?></strong></p>
				<?php } else { ?>
					<?php if(count($_['times']) > 0) {
						foreach($_['times'] as $time) { ?>
							<div
								class="tm_item-row"
								data-remove-on-delete="<?php p($time->getUuid()); ?>"
							>
								<h3>
									<?php
										$paymentStatus = 'unpaid';
										$paymentAction = 'paid';
										if(strtolower($time->getPaymentStatus()) === 'paid') {
											$paymentStatus = 'paid';
											$paymentAction = 'unpaid';
										}
									?>
									<span
										data-svelte="Checkmark.svelte"
										data-uuid="<?php p($time->getUuid()); ?>"
										data-action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>"
										data-initialState="<?php p($paymentStatus); ?>"
									>
									</span>
									<?php p($time->getDurationInHours()); ?> <?php p($l->t('hrs.')); ?>
									<form
										action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>/<?php p($paymentAction); ?>"
										method="post"
										style="display: inline"
										data-svelte-hide="Checkmark.svelte"
									>
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
										<?php p($time->getStartLocalized()); ?>
										<?php if (isset($time->author_display_name) && !$time->current_user_is_author) { ?>
											&nbsp;&middot;&nbsp;
											<span>
												<ul class="existing-sharees compact">
													<li>
														<img
															src="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $time->getUserId() . '/16'); ?>"
															srcset="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $time->getUserId() . '/16'); ?> 1x, 
															<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $time->getUserId() . '/32'); ?> 2x, 
															<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $time->getUserId() . '/64'); ?> 4x"
															alt="" 
														/>
														<?php p($time->author_display_name); ?>
													</li>
												</ul>
											</span>
										<?php } ?>
										<span
											data-svelte="EditTimeEntryButton.svelte"
											data-uuid="<?php p($time->getUuid()); ?>"
											data-edit-data="<?php p(json_encode([
												"duration" => $time->getDurationInHours(),
												"date" => $time->getStartFormatted('Y-m-d'),
												"note" => $time->getNote()
											])); ?>"
										>
										</span>
										<span
											data-svelte="DeleteTimeEntryButton.svelte"
											data-uuid="<?php p($time->getUuid()); ?>"
										>
										</span>
										<form
											action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>/delete"
											method="post"
											class="tm_inline-hover-form"
											data-svelte-hide="DeleteTimeEntryButton.svelte@<?php p($time->getUuid()); ?>"
										>
											<input type="hidden" name="uuid" value="<?php p($time->getUuid()); ?>" />
											<input type="hidden" name="task" value="<?php p($_['task']->getUuid()); ?>" />
											<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
											<button type="submit" class="btn"><?php p($l->t('Delete')); ?></button>
									</form>
									</div>
								</div>
							</div>
					<?php } } else { ?>
						<div class="tm_item-row">
							<h3><?php p($l->t("You don't have any time entries, yet. Try adding one by clicking “Add time entry”.")); ?></h3>
						</div>
					<?php } ?>
					<div class="tm_summary">
						<p>
							<span class="tm_label"><?php p($l->t('Task total')); ?></span>
							<?php p($_['task']->hours); ?> <?php p($l->t('hrs.')); ?>
						</p>
						<p>
							<span class="tm_label"><?php p($l->t('Project')); ?></span>
							<?php p($_['project']->hours); ?> <?php p($l->t('hrs.')); ?>
						</p>
						<p>
							<span class="tm_label"><?php p($l->t('Client')); ?></span>
							<?php p($_['client']->hours); ?> <?php p($l->t('hrs.')); ?>
						</p>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>