<?php

namespace OCA\Expo\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;

class PageController extends Controller {

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	function index() {
		return new TemplateResponse('expo', 'index');
	}
}