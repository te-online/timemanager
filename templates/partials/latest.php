<?php
	$urlGenerator = \OC::$server->getURLGenerator();
?>

<h2>Latests time entries</h2>

<?php foreach($_['latest_entries'] as $index => $entry) { ?>
	<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
		<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $entry->task->getUuid(); ?>">
			<h3><?php p($entry->client->getName()); ?> › <?php p($entry->project->getName()); ?> › <?php p($entry->task->getName()); ?></h3>
			<div class="tm_item-excerpt">
				<span><?php p($entry->time->getStartFormatted()); ?></span>
				&nbsp;&middot;&nbsp;<span><?php p($entry->time->getDurationInHours()); ?> hrs.</span>
				&nbsp;&middot;&nbsp;<span class="trim"><?php p($entry->time->getNote()); ?></span>
			</div>
		</a>
	</div>
<?php } ?>

<?php if(count($_['latest_entries']) < 1) { ?>
	<p>No activity, yet. Check back later.</p>
<?php } ?>