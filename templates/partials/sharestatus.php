<?php

/**
 * Displays a short in-line version of the sharing status of an entity,
 * provided it has the `sharees` array and `sharer` property set.
 * Expects the full entity passed in as `entity` template variable
 */
?>
<?php

use \OCP\Util;

$urlGenerator = \OC::$server->getURLGenerator();
$l = Util::getL10N('timemanager');
?>
<?php if (isset($_['entity']->sharees) && count($_['entity']->sharees) > 0) { ?>
	&nbsp;&middot;&nbsp;
	<span>
		<?php p($l->t('shared with:')); ?>
		<ul class="existing-sharees compact">
			<?php foreach($_['entity']->sharees as $sharee) { ?>
				<li>
					<img
						src="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $sharee['recipient_user_id'] . '/16'); ?>"
						srcset="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $sharee['recipient_user_id'] . '/16'); ?> 1x, 
						<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $sharee['recipient_user_id'] . '/32'); ?> 2x, 
						<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $sharee['recipient_user_id'] . '/64'); ?> 4x"
						alt="" 
					/>
					<?php p($sharee['recipient_display_name']); ?>
				</li>
			<?php } ?>
		</ul>
	</span>
<?php } ?>
<?php if (isset($_['entity']->sharedBy)) { ?>
	&nbsp;&middot;&nbsp;
	<span>
		<?php p($l->t('shared with you by:')); ?>
		<ul class="existing-sharees compact">
			<li>
				<img
					src="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $_['entity']->sharedBy['author_user_id'] . '/16'); ?>"
					srcset="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $_['entity']->sharedBy['author_user_id'] . '/16'); ?> 1x, 
						<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $_['entity']->sharedBy['author_user_id'] . '/32'); ?> 2x, 
						<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $_['entity']->sharedBy['author_user_id'] . '/64'); ?> 4x"
					alt="" 
				/>
				<?php p($_['entity']->sharedBy['author_display_name']); ?>
			</li>
		</ul>
	</span>
<?php } ?>