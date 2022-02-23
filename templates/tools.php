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
			<h3><?php p($l->t("Import (Experimental)")); ?></h3>
		</section>

		<section class="section">
			<p>Select a file to create a preview of your import.</p><br>
			<p>
				<strong>Note:</strong>
				Imports need to be self-contained for now. There's no lookup for existing parent clients, projects or tasks. Within
				the CSV file, relationships are determined by
				<code>Name</code>
				, so make sure there are no duplicate names within each type of object.
			</p><br>
			<p>Remember to use UTF8 and <code>;</code> as separators.</p><br>

			<details>
				<summary>Show CSV format</summary>
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
						<dd>The parent client name, if project</dd>

						<dt><code>Project</code></dt>
						<dd>The parent project name, if task</dd>

						<dt><code>Task</code></dt>
						<dd>The parent task name, if time entry</dd>

						<dt><code>Note</code></dt>
						<dd>The note (for clients, projects and time entries)</dd>

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
		</section>

		<section class="section">
			<span data-svelte="Import.svelte"></span>
			<span data-store="<?php p($_["store"]); ?>"></span>
		</section>
	</div>
</div>