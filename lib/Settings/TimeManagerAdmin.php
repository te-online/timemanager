<?php

namespace OCA\TimeManager\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IGroupManager;
use OCP\Settings\ISettings;
use OCP\Util;

class TimeManagerAdmin implements ISettings
{
    private string $appName = 'timemanager';

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
            'groups' => $groups,
            'reporter_group' => $this->config->getAppValue($this->appName, 'reporter_group'),
            'sync_mode' => $this->config->getAppValue($this->appName, 'sync_mode', 'force_skip_conflict_handling'),
        ];

        Util::addScript($this->appName, 'settings');

        return new TemplateResponse($this->appName, 'settings/admin', $parameters);
    }

    public function getSection(): string
    {
        return $this->appName;
    }

    public function getPriority(): int
    {
        return 10;
    }
}
