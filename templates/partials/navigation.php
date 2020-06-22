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
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/categories/monitoring.svg" /><span><?php p($l->t('Dashboard')); ?></span>
			</a>
		</li>
    <li>
    	<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'clients' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/places/contacts.svg">
				<span><?php p($l->t('Clients')); ?></span>
			</a>
    </li>
		<li>
			<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'projects' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/categories/office.svg">
				<span><?php p($l->t('Projects')); ?></span>
			</a>
		</li>
		<li>
			<a
				class="timemanager-pjax-link<?php echo $_['page'] === 'tasks' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/categories/organization.svg">
				<span><?php p($l->t('Tasks')); ?></span>
			</a>
		</li>
    <li>
      <a
				class="timemanager-pjax-link<?php echo $_['page'] === 'times' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/actions/quota.svg">
				<span><?php p($l->t('Time entries')); ?></span>
			</a>
    </li>
  </ul>
</div>