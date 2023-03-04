<?php
script("timemanager", "timemanager");
style("timemanager", "timemanager");

$urlGenerator = \OC::$server->getURLGenerator();
$l = \OC::$server->getL10N("timemanager");
?>

<?php print_unescaped($this->inc("partials/navigation")); ?>

<div id="app-content">
	<div class="container">
		<main class="reports">
			<section class="section reports-section">
				<h2><?php p($l->t("Reports")); ?></h2>
				<h3 class="tm_label filters-form-title"><?php p($l->t("Filter by")); ?></h3>
				<span data-svelte="Filters.svelte"></span>
				<span data-svelte="Timerange.svelte"></span>
				<span data-store="<?php p($_["store"]); ?>"></span>
				<a href=""
					class="timemanager-pjax-link hidden-visually hidden-filter-link"><?php p($l->t("Apply filters")); ?></a>
			</section>
			<?php if ($_["times_grouped_by_client"] &&
				is_array($_["times_grouped_by_client"]) &&
				count($_["times_grouped_by_client"]) > 0
			) { ?>
				<section class="section statistics" data-svelte="Statistics.svelte"></section>
			<?php } ?>
			<section class="section">
				<?php if (
				$_["times_grouped_by_client"] &&
				is_array($_["times_grouped_by_client"]) &&
				count($_["times_grouped_by_client"]) > 0
			) {
				foreach ($_["times_grouped_by_client"] as $times_for_client) { ?>
				<div class="tm_item-row with-link">
					<a class="timemanager-pjax-link" href="<?php echo $urlGenerator->linkToRoute(
					"timemanager.page.projects"
				); ?>?client=<?php echo $times_for_client->client->getUuid(); ?>">
						<div>
							<span class="tm_label"><?php p($l->t("Client")); ?></span>
							<h3><?php p($times_for_client->client->getName()); ?></h3>
						</div>
						<div>
							<span class="tm_label"><?php p($l->t("Duration")); ?></span>
							<?php p($times_for_client->totalHours); ?> <?php p($l->t("hrs.")); ?>
							&nbsp;&middot;&nbsp;<?php p($times_for_client->percentageHours); ?>&thinsp;%
						</div>
					</a>
					<details>
						<?php if(count($times_for_client->entries) > 0) {
							foreach($times_for_client->entries as $entry) { $time = $entry->time; ?>
						<div class="tm_item-row" data-remove-on-delete="<?php p($time->getUuid()); ?>">
							<h3>
								<?php
											$paymentStatus = 'unpaid';
											$paymentAction = 'paid';
											if ($time->getPaymentStatus() !== null && strtolower($time->getPaymentStatus()) === 'paid') {
												$paymentStatus = 'paid';
												$paymentAction = 'unpaid';
											}
										?>
								<span data-svelte="Checkmark.svelte" data-uuid="<?php p($time->getUuid()); ?>"
									data-action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>"
									data-initialState="<?php p($paymentStatus); ?>">
								</span>
								<?php p($time->getDurationInHours()); ?> <?php p($l->t('hrs.')); ?>
								<form
									action="<?php p($urlGenerator->linkToRoute('timemanager.page.times')); ?>/<?php p($paymentAction); ?>"
									method="post" style="display: inline" data-svelte-hide="Checkmark.svelte">
									<input type="hidden" name="uuid" value="<?php p($time->getUuid()); ?>" />
									<input type="hidden" name="requesttoken" value="<?php p($_['requesttoken']); ?>" />
									<button type="submit"
										class="icon-checkmark tm_icon-checkmark tm_icon-checkmark-<?php p($paymentStatus); ?>"></button>
								</form>
							</h3>
							<div class="tm_item-excerpt">
								<div class="tm_item-note">
									<?php p($time->getNote()); ?>
								</div>
								<div class="tm_item-date">
									<?php p($entry->project->getName()); ?>&nbsp;&middot;&nbsp;<?php p($entry->task->getName()); ?>&nbsp;&middot;&nbsp;<span data-datetime="<?php p($time->getStartFormatted("c")); ?>"><?php p($time->getStartLocalized()); ?></span>
									<?php if (isset($time->author_display_name) && !$time->current_user_is_author) { ?>
										&nbsp;&middot;&nbsp;
										<span class="author">
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
								</div>
							</div>
						</div>
						<?php } } ?>
					</details>
				</div>
				<?php } ?>
				<div class="tm_summary">
					<p>
						<span class="tm_label"><?php p($l->t("Report total")); ?></span>
						<?php p($_["hoursTotal"]); ?> <?php p($l->t("hrs.")); ?>
					</p>
					<p>
						<span class="tm_label"><?php p($l->t("Number of entries")); ?></span>
						<?php p($_["numEntries"]); ?> <?php p($_["numEntries"] === 1 ? $l->t("entry") : $l->t("entries")); ?>
					</p>
				</div>
				<span data-svelte="PrintButton.svelte"></span>
				<a href="<?php p($_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] . '&' : '?'); ?>format=csv" download class="button secondary export-button">
					<?php p($l->t("Export report to CSV")); ?>
				</a>
				<?php
			} else {
				?>
				<p><?php p($l->t("Nothing found. If you have any filters set, try adjusting them.")); ?></p>
				<?php
			} ?>
			</section>
		</main>
	</div>
</div>