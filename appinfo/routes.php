<?php

return [
	'routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'page#clients', 'url' => '/clients', 'verb' => 'GET'],
		['name' => 'page#addClient', 'url' => '/clients', 'verb' => 'POST'],
		['name' => 'page#projects', 'url' => '/projects', 'verb' => 'GET'],
		['name' => 'page#tasks', 'url' => '/tasks', 'verb' => 'GET'],
		// ['name' => 'timemanager_api#preflighted_cors', 'url' => '/api/options', 'verb' => 'OPTIONS', 'requirements' => array('path' => '.+')],
		['name' => 't_api#get', 'url' => '/api/items', 'verb' => 'GET'],
		['name' => 't_api#post', 'url' => '/api/items', 'verb' => 'POST'],
		['name' => 't_api#updateObjects', 'url' => '/api/updateObjects', 'verb' => 'POST']
	]
];