<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');

?>

<div id="app">

	<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

	<div id="app-content">
		<div class="container">
			<?php if(!$_['client']) { ?>
				<div class="tm_object-details">
					<h2><a href="#">Evil Corp.</a></h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Client since</span>
						21. January 2018
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label">Note</span>
						No note.
					</div>
					<div class="tm_object-details-item">
						<span class="tm_label">Address</span>
						21st Second Street<br />
						2345 Highlands<br />
						UK
					</div>
					<form action="" method="post">
						<button type="submit" value="edit" class="btn primary">Edit</button>
					</form>
					<form action="" method="post">
						<button type="submit" value="delete" class="btn">Delete</button>
					</form>
				</div>
			<?php } ?>
			<h2>Projects</h2>
			<?php if(count($_['projects']) > 0) {
				foreach($_['projects'] as $project) { ?>
					<h3><?php p($project->getName()); ?></h3>
			<?php } } ?>
		</div>
	</div>

</div>