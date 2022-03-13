<?php
script('timemanager', 'timemanager');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
$l = \OC::$server->getL10N('timemanager');
?>

<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

<div id="app-content">
	<div class="container">
		<div class="section" data-svelte-hide="ClientEditor.svelte">
			<div class="tm_add">
				<div id="new-item" class="tm_new-item">
					<?php print_unescaped($_['templates']['ClientEditor.svelte']); ?>
				</div>
			</div>
		</div>

		<div class="section">
			<h2 class="list-title"><?php p($l->t('Clients')); ?></h2>
			<span data-svelte="ClientEditorDialog.svelte"></span>
			<span data-store="<?php p($_['store']); ?>"></span>
			<?php if(count($_['clients']) > 0) {
				foreach($_['clients'] as $client) { ?>
					<div class="tm_item-row with-link">
						<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $client->getUuid(); ?>">
							<h3><?php p($client->getName()); ?></h3>
							<div class="tm_item-excerpt">
								<span>
									<?php p($l->t('%s projects', [$client->project_count])); ?>
								</span>&nbsp;&middot;&nbsp;
								<span>
									<?php p($client->hours); ?> <?php p($l->t('hrs.')); ?>
								</span>&nbsp;&middot;&nbsp;
								<span>
									<?php p($l->t('since %s', [$client->getCreatedYear()])); ?>
								</span>
								<?php if(isset($client->sharees) && count($client->sharees) > 0) { ?>
									&nbsp;&middot;&nbsp;
									<span>
										<?php p($l->t('shared with:')); ?>
										<ul class="existing-sharees compact">
											<?php foreach($client->sharees as $sharee) { ?>
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
								<?php if(isset($client->sharedBy)) { ?>
									&nbsp;&middot;&nbsp;
									<span>
										<?php p($l->t('shared with you by:')); ?>
										<ul class="existing-sharees compact">
											<li>
												<img
													src="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $client->sharedBy['author_user_id'] . '/16'); ?>"
													srcset="<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $client->sharedBy['author_user_id'] . '/16'); ?> 1x, 
														<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $client->sharedBy['author_user_id'] . '/32'); ?> 2x, 
														<?php echo $urlGenerator->getAbsoluteURL('avatar/' . $client->sharedBy['author_user_id'] . '/64'); ?> 4x"
													alt="" 
												/>
												<?php p($client->sharedBy['author_display_name']); ?>
											</li>
										</ul>
									</span>
								<?php } ?>
							</div>
						</a>
					</div>
			<?php } } else { ?>
				<div class="tm_item-row">
					<h3><?php p($l->t("You don't have any clients, yet. Get started by clicking “Add client”.")); ?></h3>
				</div>
			<?php } ?>
		</div>
	</div>
</div>