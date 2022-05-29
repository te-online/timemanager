<?php
	$urlGenerator = \OC::$server->getURLGenerator();
	$l = \OC::$server->getL10N('timemanager');
?>

<h2><?php p($l->t('Latest time entries')); ?></h2>

<?php if ($_['hasSharedTimeEntries']) { ?>
	<span data-svelte="UserFilter.svelte"></span>
<?php } ?>

<?php foreach($_['latestEntries'] as $entry) { ?>
	<div class="tm_item-row with-link">
		<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>?task=<?php echo $entry->task->getUuid(); ?>">
			<h3><?php p($entry->client->getName()); ?> › <?php p($entry->project->getName()); ?> › <?php p($entry->task->getName()); ?></h3>
			<div class="tm_item-excerpt">
				<span><?php p($entry->time->getStartLocalized()); ?></span>
				&nbsp;&middot;&nbsp;<span><?php p($entry->time->getDurationInHours()); ?> <?php p($l->t('hrs.')); ?></span>
				<?php if (isset($entry->time->author_display_name) && !$entry->time->current_user_is_author) { ?>
					&nbsp;&middot;&nbsp;
					<span class="author">
						<ul class="existing-sharees compact">
							<li>
								<img
									src="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $entry->time->getUserId() . '/16'); ?>"
									srcset="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $entry->time->getUserId() . '/16'); ?> 1x, 
									<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $entry->time->getUserId() . '/32'); ?> 2x, 
									<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $entry->time->getUserId() . '/64'); ?> 4x"
									alt="" 
								/>
								<?php p($entry->time->author_display_name); ?>
							</li>
						</ul>
					</span>
				<?php } ?>
				&nbsp;&middot;&nbsp;<span class="trim"><?php p($entry->time->getNote()); ?></span>
			</div>
		</a>
	</div>
<?php } ?>

<?php if(count($_['latestEntries']) < 1) { ?>
	<p><?php p($l->t('No activity, yet. Check back later.')); ?></p>
<?php } ?>