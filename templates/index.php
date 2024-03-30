<?php

use \OCP\Util;

Util::addScript('timemanager', 'bundle');
style('timemanager', 'timemanager');

$l = Util::getL10N('timemanager');

?>

<?php print_unescaped($this->inc('partials/navigation')); ?>

<div id="app-content">
	<div class="container">
		<div class="section">
			<section class="section quick-add-section">
				<span data-svelte="QuickAdd.svelte"></span>
				<span data-store="<?php p($_['store']); ?>"></span>
			</section>

			<?php print_unescaped($this->inc('partials/latest')); ?>

			<section class="section statistics" data-svelte="Statistics.svelte"></section>
		</div>
	</div>
</div>