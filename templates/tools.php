<?php
script("timemanager", "timemanager");
style("timemanager", "timemanager");

$urlGenerator = \OC::$server->getURLGenerator();
$l = \OC::$server->getL10N("timemanager");
?>

<?php print_unescaped($this->inc("partials/navigation")); ?>

<div id="app-content" class="tools">
	<div class="container">
		<section class="section">
			<h2><?php p($l->t("Tools")); ?></h2>
			<h3><?php p($l->t("Import (feature preview)")); ?></h3>

			<div class="tm_object-details-item">
				<p>Select a file to see a preview of your import.</p>
			</div>
			
			<div class="tm_object-details-item">
				<p><strong>Current limitations:</strong></p>
				<ul style="list-style: initial; padding-left: 18px;">
					<li>Imports need to be self-contained, there's no lookup for existing parent clients, projects or tasks</li>
					<li>Within the CSV file, relationships are determined by <code>Name</code>, so make sure there are no duplicate names within each type of object</li>
					<li>UTF-8 is the only supported file encoding</li>
					<li><code>;</code> is the only supported delimiter</li>
					<li>Time entries cannot be imported</li>
				</ul>
			</div>

			<div class="tm_object-details-item">
				<details>
					<summary>Show overview of expected CSV columns</summary>
						<dl class="csv_list">
							<dt><strong>Column name</strong></dt>
							<dd><strong>Description</strong></dd>

							<dt><code>Type</code></dt>
							<dd>
								The type of object
								<code>Client</code>
								,
								<code>Project</code>
								,
								<code>Task</code>
								<!-- , -->
								<!-- <code>Time</code> -->
							</dd>
							
							<dt><code>Name</code></dt>
							<dd>The name of the object</dd>

							<dt><code>Client</code></dt>
							<dd>The parent client name (if type is project)</dd>

							<dt><code>Project</code></dt>
							<dd>The parent project name (if type is task)</dd>

							<!-- <dt><code>Task</code></dt> -->
							<!-- <dd>The parent task name (if time entry)</dd> -->

							<dt><code>Note</code></dt>
							<dd>The note (if type is client or project)</dd>

							<!-- <dt><code>Done</code></dt>
							<dd>
								<code>Yes</code> or <code>No</code>, for time entries
							</dd>

							<dt><code>Start</code></dt>
							<dd>The start date of the time entry</dd>

							<dt><code>Duration</code></dt>
							<dd>The duration of the time entry in minutes</dd> -->
						</dl>
				</details>
			</div>

			<span data-svelte="Import.svelte"></span>
			<span data-store="<?php p($_["store"]); ?>"></span>
		</section>
	</div>
</div>