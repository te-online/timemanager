<?php

namespace OCA\TimeManager\Settings;

use OCA\TimeManager\AppInfo\Application;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IGroupManager;
use OCP\Settings\ISettings;
use OCP\Util;

class TimeManagerAdmin implements ISettings
{

    public function __construct(
        private IConfig $config,
        private IGroupManager $groupManager,
    ) { }


    public function getForm(): TemplateResponse
    {
        $groups = [];
        foreach ($this->groupManager->getBackends() as $backend) {
            $groups = array_merge($groups, $backend->getGroups());
        }

        $parameters = [
            'groups' => array_unique($groups),
            'reporter_group' => $this->config->getAppValue(Application::APP_ID, 'reporter_group'),
            'sync_mode' => $this->config->getAppValue(Application::APP_ID, 'sync_mode', 'force_skip_conflict_handling'),
        ];

        Util::addScript(Application::APP_ID, 'settings');

        return new TemplateResponse(Application::APP_ID, 'settings/admin', $parameters);
    }

    public function getSection(): string
    {
        return Application::APP_ID;
    }

    public function getPriority(): int
    {
        return 10;
    }
}
