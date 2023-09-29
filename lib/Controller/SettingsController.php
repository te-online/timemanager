<?php

namespace OCA\TimeManager\Controller;


use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\Response;
use OCP\IConfig;
use OCP\IRequest;

class SettingsController extends Controller
{
    public function __construct(
        $appName,
        IRequest $request,
        private IConfig $config,
    ) {
        parent::__construct($appName, $request);
    }

    #[AuthorizedAdminSetting(settings: 'OCA\TimeManager\Settings\TimeManagerAdmin')]
    public function saveSettings(string $reporter = null, bool $handle_conflicts = null): Response
    {
        if ($reporter) {
            $this->config->setAppValue('timemanager', 'reporter_group', $reporter);
        }

        if ($handle_conflicts !== null) {
            $this->config->setAppValue(
                "timemanager",
                "sync_mode",
                $handle_conflicts ? "handle_conflicts" : "force_skip_conflict_handling"
            );
        }

        return new JSONResponse([]);
    }
}
