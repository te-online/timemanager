<?php

use \OCP\Util;

Util::addScript('timemanager', 'bundle');
style('timemanager', 'timemanager');

$l = Util::getL10N('timemanager');
?>

<?php print_unescaped($this->inc("partials/navigation")); ?>

<div id="app-content">
    <div class="container">
        <main class="settings">
            <section class="section">
                <h2><?php p($l->t("Settings")); ?></h2>
                <span data-svelte="Settings.svelte"></span>
								<span data-store="<?php p($_["store"]); ?>"></span>
            </section>
        </main>
    </div>
</div>