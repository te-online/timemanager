<?php
	$urlGenerator = \OC::$server->getURLGenerator();
	$l = \OC::$server->getL10N('timemanager');
?>

<h2><?php p($l->t('Latest time entries')); ?></h2>

<?php foreach($_['latest_entries'] as $entry) { ?>
	<div class="tm_item-row">
		<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $entry->task->getUuid(); ?>">
			<h3><?php p($entry->client->getName()); ?> › <?php p($entry->project->getName()); ?> › <?php p($entry->task->getName()); ?></h3>
			<div class="tm_item-excerpt">
				<span><?php p($entry->time->getStartFormatted()); ?></span>
				&nbsp;&middot;&nbsp;<span><?php p($entry->time->getDurationInHours()); ?> <?php p($l->t('hrs.')); ?></span>
				&nbsp;&middot;&nbsp;<span class="trim"><?php p($entry->time->getNote()); ?></span>
			</div>
		</a>
	</div>
<?php } ?>

<?php if(count($_['latest_entries']) < 1) { ?>
	<p><?php p($l->t('No activity, yet. Check back later.')); ?></p>
<?php } ?>