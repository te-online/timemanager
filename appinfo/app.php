<?php

\OC::$server->getNavigationManager()->add(function () {
	$urlGenerator = \OC::$server->getURLGenerator();
	$l = \OC::$server->getL10N('timemanager');
	return [
		'id' => 'timemanager',
		'order' => 10,
		'href' => $urlGenerator->linkToRoute('timemanager.page.index'),
		'icon' => $urlGenerator->imagePath('timemanager', 'app.svg'),
		'name' => $l->t('TimeManager'),
	];
});