<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<div id="app">

	<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

	<div id="app-content">
		<div class="container">
			<?php if($_['client'] && $_['project'] && $_['task']) { ?>
				<div class="tm_object-details">
					<h2>
						<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>">
							<span class="tm_label">Client</span>
							<?php p($_['client']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $_['project']->getUuid(); ?>">
							<span class="tm_label">Project</span>
							<?php p($_['project']->getName()); ?>
						</a>&nbsp;&nbsp;
						<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $_['task']->getUuid(); ?>">
							<span class="tm_label">Task</span>
							<?php p($_['task']->getName()); ?>
						</a>
					</h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Created</span>
						<?php p($_['task']->getCreatedDate()); ?>
					</div>
					<form action="" method="post">
						<button type="submit" name="action" value="edit" class="btn primary">Edit task</button>
					</form>
					<form action="<?php p($urlGenerator->linkToRoute('timemanager.page.tasks')); ?>/delete" method="post">
						<input type="hidden" name="uuid" value="<?php p($_['task']->getUuid()); ?>" />
						<input type="hidden" name="project" value="<?php p($_['project']->getUuid()); ?>" />
						<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
						<button type="submit" name="action" value="delete" class="btn">Delete task</button>
					</form>
				</div>
			<?php } ?>
			<div class="tm_add">
				<h3>New time entry</h3>
				<div id="new-item" class="tm_new-item">
					<form action="" method="post">
						<label>Duration (in hrs.)<br />
							<input type="number" name="duration" step="0.25" placeholder="" />
						</label><br />
						<label>Date<br />
							<input type="date" name="date" value="<?php p(date('Y-m-d')); ?>" />
						</label><br />
						<label>Note<br />
							<textarea name="note"></textarea>
						</label><br />
						<label>For task<br />
							<?php if(count($_['tasks']) > 0 ) { ?>
								<select name="task">
									<?php foreach($_['tasks'] as $task) { ?>
										<option value="<?php p($task->getUuid()); ?>"<?php echo ($_['task'] && $_['task']->getUuid() === $task->getUuid()) ? ' selected="selected"' : ''; ?>><?php p($task->getName()); ?></option>
									<?php } ?>
								</select>
							<?php } else { ?>
								<p>No tasks created yet. Go ahead and <a href="">create one</a>.</p>
							<?php } ?>
						</label><br />
						<label>For project<br />
							<?php if(count($_['projects']) > 0 ) { ?>
								<?php foreach($_['projects'] as $project) { ?>
									<strong><?php echo ($_['project'] && $_['project']->getUuid() === $project->getUuid()) ? p($project->getName()) : p(''); ?></strong>
								<?php } ?>
							<?php } else { ?>
								<p>No projects created yet. Go ahead and <a href="">create one</a>.</p>
							<?php } ?>
						</label><br />
						<label>For client<br />
							<?php if(count($_['clients']) > 0 ) { ?>
								<?php foreach($_['clients'] as $client) { ?>
									<strong><?php echo ($_['client'] && $_['client']->getUuid() === $client->getUuid()) ? p($client->getName()) : p(''); ?></strong>
								<?php } ?>
							<?php } else { ?>
								<p>No clients created yet. Go ahead and <a href="">create one</a>.</p>
							<?php } ?>
						</label><br />
						<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
						<button type="submit" class="btn primary">Add time entry</button>
					</form>
				</div>
			</div>
			<div class="tm_item-list">
				<h2>Time Entries</h2>
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
				<?php if(!$_['task']) { ?>
					<p><strong>Select a task first to show the times for this task.</strong></p>
				<?php } else { ?>
					<?php if(count($_['times']) > 0) {
						foreach($_['times'] as $index => $time) { ?>
							<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
								<h3><?php p($time->getDurationInHours()); ?> hrs.</h3>
								<div class="tm_item-excerpt">
									<span>
										<?php p($time->getStartFormatted()); ?>
									</span>
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