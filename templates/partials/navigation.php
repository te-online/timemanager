<?php

use \OCP\Util;

$urlGenerator = \OC::$server->getURLGenerator();
$l = Util::getL10N('timemanager');
?>

<div id="app-navigation">
  <ul class="app-navigation-list">
    <li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.index'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'index' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/monitoring.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Dashboard')); ?>
        </span>
      </a>
    </li>
    <li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.reports'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'reports' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'actions/details.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Reports')); ?>
        </span>
      </a>
    </li>
		<li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'clients' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'places/contacts.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Clients')); ?>
        </span>
      </a>
    </li>
		<li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'projects' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/office.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Projects')); ?>
        </span>
      </a>
    </li>
		<li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'tasks' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" style="width: 18px; height: auto;" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/organization.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Tasks')); ?>
        </span>
      </a>
    </li>
		<li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'times' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'actions/quota.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Time entries')); ?>
        </span>
      </a>
    </li>
		<li class="app-navigation-entry">
      <a href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tools'); ?>" class="timemanager-pjax-link app-navigation-entry-link<?php echo $_['page'] === 'tools' ? ' active' : ''; ?>">
        <span class="app-navigation-entry-icon">
          <img alt="" src="<?php echo $urlGenerator->getAbsoluteURL($urlGenerator->imagePath('core', 'categories/integration.svg')); ?>" />
        </span>
        <span class="app-navigation-entry-title">
          <?php p($l->t('Tools')); ?>
        </span>
      </a>
    </li>
  </ul>
</div>