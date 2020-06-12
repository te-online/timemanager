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
					<?php if($_['project']) { ?>
						<span data-svelte="ProjectEditorDialog.svelte"></span>
						<span data-svelte="DeleteButton.svelte"></span>
						<span data-svelte-hide="DeleteButton.svelte">
							<?php print_unescaped($_['templates']['DeleteButton.svelte']); ?>
						</span>
					<?php } ?>
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
								<?php foreach(array_reverse($_['projects']) as $project) {
									// Look up client for project
									$client = array_reduce($_['clients'], function ($carry, $oneClient) use(&$project) {
										if ($oneClient->getUuid() === $project->getClientUuid()) {
											$carry = $oneClient;
										}
										return $carry;
									});
									?>
									<option value="<?php p($project->getUuid()); ?>"><?php p($client->getName() . ' › ' . $project->getName()); ?></option>
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
						foreach($_['tasks'] as $task) { ?>
							<div class="tm_item-row">
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