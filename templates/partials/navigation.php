<?php
$urlGenerator = \OC::$server->getURLGenerator();
$l = \OC::$server->getL10N('timemanager');
?>

<div id="app-navigation">
  <ul>
		<li>
			<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'index' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.index'); ?>"
				<?php echo $_['page'] === 'index' ? ' data-current-link' : ''; ?>
			>
				<img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/monitoring.svg')); ?>" /><span><?php p($l->t('Dashboard')); ?></span>
			</a>
		</li>
    <li>
    	<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'reports' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.reports'); ?>"
			>
				<img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'actions/details.svg')); ?>">
				<span><?php p($l->t('Reports')); ?></span>
			</a>
    </li>
    <li>
    	<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'clients' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>"
			>
				<img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'places/contacts.svg')); ?>">
				<span><?php p($l->t('Clients')); ?></span>
			</a>
    </li>
		<li>
			<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'projects' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>"
			>
				<img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/office.svg')); ?>">
				<span><?php p($l->t('Projects')); ?></span>
			</a>
		</li>
		<li>
			<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'tasks' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>"
			>
				<img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/organization.svg')); ?>">
				<span><?php p($l->t('Tasks')); ?></span>
			</a>
		</li>
    <li>
      <a
				class="timemanager-pjax-link<?php echo $_['page'] === 'times' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>"
			>
				<img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'actions/quota.svg')); ?>">
				<span><?php p($l->t('Time entries')); ?></span>
			</a>
    </li>
  </ul>

	<div id="app-settings">
		<div id="app-settings-header">
			<button class="settings-button" data-apps-slide-toggle="#app-settings-content">
				<?php p($l->t('Settings')); ?>
			</button>
		</div>
		<div id="app-settings-content">
			<span class="settings" data-svelte="Settings.svelte"></section>
		</div>
	</div>
</div>