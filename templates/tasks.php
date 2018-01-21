<?php
script('timemanager', 'app');
style('timemanager', 'timemanager');

?>

<div id="app">

	<?php print_unescaped( $this->inc( 'partials/navigation' ) ); ?>

	<div id="app-content">
		<div class="container">
			<?php if(!$_['project'] && !$_['client']) { ?>
				<div class="tm_object-details">
					<h2><a href="#">Evil Corp.</a> > <a href="#">Special secret project</a></h2>
					<div class="tm_object-details-item">
						<span class="tm_label">Started</span>
						21. January 2018
					</div>
					<form action="" method="post">
						<button type="submit" value="edit" class="btn primary">Edit</button>
					</form>
					<form action="" method="post">
						<button type="submit" value="delete" class="btn">Delete</button>
					</form>
				</div>
			<?php } ?>
			<h2>Tasks</h2>
			<?php if(count($_['tasks']) > 0) {
				foreach($_['tasks'] as $task) { ?>
					<h3><?php p($task->getName()); ?></h3>
			<?php } } ?>
		</div>
	</div>

</div>