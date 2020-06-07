<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<?php if($_['client'] && $_['project']) { ?>
			<div class="section">
				<div class="tm_object-details">
					<h2>
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label">Client</span>
							<?php p($_['client']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a class="timemanager-pjax-link" data-current-link href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $_['project']->getUuid(); ?>">
							<span class="tm_label">Project</span>
							<?php p($_['project']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Created</span>
						<?php p($_['project']->getCreatedDate()); ?>
					</div>
					<form action="" method="post">
						<button type="submit" name="action" value="edit" class="btn primary">Edit project</button>
					</form>
					<form action="<?php p($urlGenerator->linkToRoute('timemanager.page.projects')); ?>/delete" method="post">
						<input type="hidden" name="uuid" value="<?php p($_['project']->getUuid()); ?>" />
						<input type="hidden" name="client" value="<?php p($_['client']->getUuid()); ?>" />
						<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
						<button type="submit" name="action" value="delete" class="btn">Delete project</button>
					</form>
				</div>
				<div class="tm_add" data-svelte-hide="TaskEditor.svelte">
					<div id="new-item" class="tm_new-item">
						<?php print_unescaped($_['templates']['TaskEditor.svelte']); ?>
					</div>
				</div>
			</div>
		<?php } ?>
		<div class="section">
			<div class="tm_item-list">
				<h2 class="list-title">Tasks</h2>
				<?php if($_['project']) { ?>
					<span data-svelte="TaskEditorDialog.svelte"></span>
					<span data-store="<?php p($_['store']); ?>"></span>
				<?php } ?>
				<?php if(!$_['project']) { ?>
					<p>Select a project to show tasks for</p>
					<form action="" method="get">
						<?php if(count($_['projects']) > 0 ) { ?>
							<select name="project">
								<?php foreach($_['projects'] as $project) { ?>
									<option value="<?php p($project->getUuid()); ?>"<?php echo ($_['project'] && $_['project']->getUuid() === $project->getUuid()) ? ' selected="selected"' : ''; ?>><?php p($project->getName()); ?></option>
								<?php } ?>
							</select>
							<button type="submit" class="btn">Show</button>
						<?php } else { ?>
							<p>No projects created yet. Go ahead and <a href="">create one</a>.</p>
						<?php } ?>
					</form>
					<p><strong>Select a project first to show the tasks for this project.</strong></p>
				<?php } else { ?>
					<?php if(count($_['tasks']) > 0) {
						foreach($_['tasks'] as $index => $task) { ?>
							<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
								<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $task->getUuid(); ?>">
									<h3><?php p($task->getName()); ?></h3>
									<div class="tm_item-excerpt">
										<span><?php p($task->hours); ?> Hrs.</span>
									</div>
								</a>
							</div>
					<?php } } else { ?>
						<div class="tm_item-row">
							<h3>You don't have any tasks, yet. Try adding one by clicking “Add task”.</h3>
						</div>
					<?php } ?>
					<div class="tm_summary">
						<p>
							<span class="tm_label">Project Total</span>
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