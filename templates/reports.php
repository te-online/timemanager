<?php
	script("timemanager", "timemanager");
	style("timemanager", "timemanager");

	$urlGenerator = \OC::$server->getURLGenerator();
	$l = \OC::$server->getL10N('timemanager');
?>

<?php print_unescaped($this->inc("partials/navigation")); ?>

<div id="app-content">
	<div class="container">
		<div class="section">
			<h2><?php p($l->t('Reports')); ?></h2>
			<section class="section">
				<span data-svelte="Filters.svelte">
					<?php // @TODO: This is broken: print_unescaped($_['templates']['Filters.svelte']); ?>
				</span>
				<span data-svelte="Timerange.svelte">
					<?php // @TODO: This is broken: print_unescaped($_['templates']['Timerange.svelte']); ?>
				</span>
				<span data-store="<?php p($_["store"]); ?>"></span>
				<a href="" class="timemanager-pjax-link hidden-visually hidden-filter-link">Apply filters</a>
			</section>
			<section class="section">
				<?php
					if ($_["times_grouped_by_client"] && is_array($_["times_grouped_by_client"]) && count($_["times_grouped_by_client"]) > 0) {
						foreach ($_["times_grouped_by_client"] as $times_for_client) {
							?>
				<div class="tm_item-row with-link">
					<a class="timemanager-pjax-link"
						href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $times_for_client->client->getUuid(); ?>">
						<span class="tm_label inline"><?php p($l->t('Client')); ?></span>
						<h3><?php p($times_for_client->client->getName()); ?></h3>
						<div class="tm_item-excerpt">
							<span class="tm_label inline"><?php p($l->t('Duration')); ?></span>
							<span><?php p($times_for_client->totalHours); ?> <?php p($l->t('hrs.')); ?></span>
							&nbsp;&middot;&nbsp;<span class="trim"><?php p($times_for_client->percentageHours); ?>&thinsp;%</span>
						</div>
					</a>
				</div>
				<?php
						}
					}
				?>
			</section>
			<section class="section">
				<ul>
					<li>Here we'll show the results</li>
					<li>There should be a CSV export button as well</li>
					<li>Times can be grouped by project or grouped by client</li>
					<li>Times can be checked as "Paid" here</li>
					<li>There are links to the specific client, project, task and time</li>
					<li>There should be a total at the end of the page</li>
				</ul>
				<div>
					Project XY &middot; Client XY | Duration: 7 hrs.
					<details>
						<div>
							Task something something | Duration: 5 hrs.
							<details>
								<p>Fri 28 May | Description | Duration: 3 hrs.</p>
								<p>Fri 28 May | Description | Duration: 2 hrs.</p>
							</details>
						</div>
						<div>
							Task 2 | Duration: 2 hrs.
							<details>
								<p>Thu 27 May | Desc | Duration: 1 hr.</p>
								<p>Wed 26 May | Desc 2 | Duration: 1 hr.</p>
							</details>
						</div>
					</details>
				</div>
				<div>
					Project 2 &middot; Client 2 | Duration: 7 hrs.
					<details>
						<div>
							Task something something | Duration: 5 hrs.
							<details>
								<p>Fri 28 May | Description | Duration: 3 hrs.</p>
								<p>Fri 28 May | Description | Duration: 2 hrs.</p>
							</details>
						</div>
						<div>
							Task 2 | Duration: 2 hrs.
							<details>
								<p>Thu 27 May | Desc | Duration: 1 hr.</p>
								<p>Wed 26 May | Desc 2 | Duration: 1 hr.</p>
							</details>
						</div>
					</details>
				</div>
			</section>
		</div>
	</div>
</div>