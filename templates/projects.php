<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');
$urlGenerator = \OC::$server->getURLGenerator();
?>

<div id="app">

	<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

	<div id="app-content">
		<div class="container">
			<?php if($_['client']) { ?>
				<div class="tm_object-details">
					<h2><a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>?client=<?php echo $_['client']->getUuid(); ?>"><?php p($_['client']->getName()); ?></a></h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Client since</span>
						<?php p($_['client']->getCreated()); ?>
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label">Note</span>
						<?php p($_['client']->getNote()); ?>
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label">Address</span>
						<?php p($_['client']->getStreet()); ?><br />
						<?php p($_['client']->getPostcode()); ?> <?php p($_['client']->getCity()); ?>
					</div>
					<form action="" method="post">
						<button type="submit" name="action" value="edit" class="btn primary">Edit</button>
					</form>
					<form action="" method="post">
						<button type="submit" name="action" value="delete" class="btn">Delete</button>
					</form>
				</div>
			<?php } ?>
			<div class="add">
				<h3>New</h3>
				<div id="new-item">
					<form action="" method="post">
						<label>Project name<br />
							<input type="text" name="name" placeholder="Very special project" />
						</label>
						<label>For client<br />
							<select name="client">
								<?php if(count($_['clients']) > 0 ) {
									foreach($_['clients'] as $client) { ?>
										<option value="<?php p($client->getUuid()); ?>"><?php echo p($client->getName()); ?></option>
								<?php } } else { ?>
									<p>No clients created yet. Go ahead and <a href="">create one</a>.</p>
								<?php } ?>
							</select>
						</label><br />
						<input type="hidden" name="csrf_token" value="<?php p($_['csrf_token']); ?>" />
						<button type="submit" class="btn primary">Add</button>
					</form>
				</div>
			</div>
			<div class="tm_item-list">
				<h2>Projects</h2>
				<?php if(count($_['projects']) > 0) {
					foreach($_['projects'] as $index => $project) { ?>
						<div class="tm_item-row<?php if($index %2 !== 0) { p(' odd'); } ?>">
							<a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>?project=<?php echo $project->getUuid(); ?>">
								<h3><?php p($project->getName()); ?></h3>
								<div class="tm_item-excerpt">
									<span>0 tasks</span> &middot; <span>0 hrs.</span>
								</div>
							</a>
						</div>
				<?php } } ?>
			</div>
		</div>
	</div>

</div>