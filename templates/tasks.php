<?php

use OCA\TimeManager\Helper\DurationHelper;
use \OCP\Util;

Util::addScript('timemanager', 'bundle');
style('timemanager', 'timemanager');

$urlGenerator = \OC::$server->getURLGenerator();
$l = Util::getL10N('timemanager');
?>

<?php print_unescaped($this->inc('partials/navigation')); ?>

<div id="app-content">
	<div class="container">
		<?php if ($_['client'] && $_['project']) { ?>
			<div class="section">
				<div class="tm_object-details">
					<h2>
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label"><?php p($l->t('Client')); ?></span>
							<?php p($_['client']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a class="timemanager-pjax-link" data-current-link href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $_['project']->getUuid(); ?>">
							<span class="tm_label"><?php p($l->t('Project')); ?></span>
							<?php p($_['project']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label"><?php p($l->t('Created')); ?></span>
						<span data-datetime="<?php p($_['project']->getCreatedDateISO()); ?>"><?php p($_['project']->getCreatedDate()); ?></span>
					</div>
					<div class="tm_object-details-item">
						<span data-svelte="ShareStatus.svelte"></span>
						<span data-svelte-hide="ShareStatus.svelte">
							<?php print_unescaped($_['templates']['ShareStatus.svelte']); ?>
						</span>
					</div>
					<?php if ($_['project'] && $_['canEdit']) { ?>
						<span data-svelte="ProjectEditorDialog.svelte"></span>
						<span data-svelte="DeleteButton.svelte"></span>
						<span data-svelte-hide="DeleteButton.svelte">
							<?php print_unescaped($_['templates']['DeleteButton.svelte']); ?>
						</span>
					<?php } ?>
				</div>
				<?php if ($_['canEdit']) { ?>
					<div class="tm_add" data-svelte-hide="TaskEditor.svelte">
						<div id="new-item" class="tm_new-item">
							<?php print_unescaped($_['templates']['TaskEditor.svelte']); ?>
						</div>
					</div>
				<?php } ?>
			</div>
		<?php } ?>
		<div class="section">
			<?php if (!$_['project']) { ?>
				<div class="tm_item-list space-bottom">
					<h2 class="list-title"><?php p($l->t('All tasks')); ?></h2>
					<?php if (count($_['tasks']) > 0) {
						foreach ($_['tasks'] as $task) {
					?>
							<div class="tm_item-row with-link">
								<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $task->getUuid(); ?>">
									<h3><em><?php p($task->client->getName()); ?></em> › <em><?php p($task->project->getName()); ?></em> › <?php p($task->getName()); ?></h3>
									<div class="tm_item-excerpt">
										<span>
											<span data-duration="<?php p($task->hours); ?>">
												<?php p(DurationHelper::format_duration($task->hours, $_["store"])); ?>
											</span><?php p($l->t('hrs.')); ?>
										</span>
										<?php print_unescaped($this->inc('partials/sharestatus', ['entity' => $task])); ?>
									</div>
								</a>
							</div>
					<?php }
					} ?>
				</div>
			<?php } ?>
			<div class="tm_item-list">
				<h2 class="list-title"><?php p($l->t('Tasks')); ?></h2>
				<?php if ($_['project'] && $_['canEdit']) { ?>
					<span data-svelte="TaskEditorDialog.svelte"></span>
				<?php } ?>
				<span data-store="<?php p($_['store']); ?>"></span>
				<?php if (!$_['project']) { ?>
					<p><?php p($l->t('Select a project to show tasks for')); ?></p>
					<form action="" method="get">
						<?php if (count($_['projects']) > 0) { ?>
							<select name="project">
								<?php foreach ($_['projects'] as $project) {
									// Look up client for project
									$client = array_reduce($_['clients'], function ($carry, $oneClient) use (&$project) {
										if ($oneClient->getUuid() === $project->getClientUuid()) {
											$carry = $oneClient;
										}
										return $carry;
									});
								?>
									<option value="<?php p($project->getUuid()); ?>"><?php p($client->getName() . ' › ' . $project->getName()); ?></option>
								<?php } ?>
							</select>
							<button type="submit" class="btn"><?php p($l->t('Show')); ?></button>
						<?php } else { ?>
							<p><?php p($l->t('No projects created yet. Go ahead and create one.')); ?></p>
						<?php } ?>
					</form>
					<p><em><?php p($l->t('Select a project first to show the tasks for this project.')); ?></em></p>
				<?php } else { ?>
					<?php if (count($_['tasks']) > 0) {
						foreach ($_['tasks'] as $task) { ?>
							<div class="tm_item-row with-link">
								<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $task->getUuid(); ?>">
									<h3><?php p($task->getName()); ?></h3>
									<div class="tm_item-excerpt">
										<span>
											<span data-duration="<?php p($task->hours); ?>">
												<?php p(DurationHelper::format_duration($task->hours, $_["store"])); ?>
											</span><?php p($l->t('hrs.')); ?>
										</span>
									</div>
								</a>
							</div>
						<?php }
					} else { ?>
						<div class="tm_item-row">
							<h3><?php p($l->t("You don't have any tasks, yet. Try adding one by clicking “Add task”.")); ?></h3>
						</div>
					<?php } ?>
					<div class="tm_summary">
						<p>
							<span class="tm_label"><?php p($l->t('Project total')); ?></span>
							<span data-duration="<?php p($_['project']->hours); ?>">
								<?php p(DurationHelper::format_duration($_['project']->hours, $_["store"])); ?>
							</span><?php p($l->t('hrs.')); ?>
						</p>
						<p>
							<span class="tm_label"><?php p($l->t('Client')); ?></span>
							<span data-duration="<?php p($_['client']->hours); ?>">
								<?php p(DurationHelper::format_duration($_['client']->hours, $_["store"])); ?>
							</span><?php p($l->t('hrs.')); ?>
						</p>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>