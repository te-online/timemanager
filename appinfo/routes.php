<?php

return [
	'routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'api#get', 'url' => '/api/items', 'verb' => 'GET'],
		['name' => 'api#post', 'url' => '/api/items', 'verb' => 'POST'],
	]
];