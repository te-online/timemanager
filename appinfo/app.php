<?php

\OC::$server->getNavigationManager()->add(function () {
	$urlGenerator = \OC::$server->getURLGenerator();
	$l = \OC::$server->getL10N('expo');
	return [
		'id' => 'expo_index',
		'order' => 10,
		'href' => $urlGenerator->linkToRoute('expo.page.index'),
		'icon' => $urlGenerator->imagePath('expo', 'app.svg'),
		'name' => $l->t('Expo'),
	];
});