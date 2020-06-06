<?php
$urlGenerator = \OC::$server->getURLGenerator(); ?>

<div id="app-navigation">
  <ul>
		<li>
			<a
				class="<?php echo $_['page'] === 'index' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.index'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/categories/monitoring.svg" /><span>Dashboard</span>
			</a>
		</li>
    <li>
    	<a
				class="<?php echo $_['page'] === 'clients' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/places/contacts.svg">
				<span>Clients</span>
			</a>
    </li>
		<li>
			<a
				class="<?php echo $_['page'] === 'projects' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/categories/office.svg">
				<span>Projects</span>
			</a>
		</li>
		<li>
			<a
				class="<?php echo $_['page'] === 'tasks' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/categories/organization.svg">
				<span>Tasks</span>
			</a>
		</li>
    <li>
      <a
				class="<?php echo $_['page'] === 'times' ? ' active' : ''; ?>"
				href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>"
			>
				<img alt="" src="http://localhost:8888/nextcloud-server/core/img/actions/quota.svg">
				<span>Time Entries</span>
			</a>
    </li>
  </ul>
</div>