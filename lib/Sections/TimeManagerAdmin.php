<?php

namespace OCA\TimeManager\Sections;

use OCA\TimeManager\AppInfo\Application;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class TimeManagerAdmin implements IIconSection
{
    public function __construct(
        private IL10N $l,
        private IURLGenerator $urlGenerator,
    ) {
    }


    public function getID(): string
    {
        return Application::APP_ID;
    }

    public function getName(): string
    {
        return $this->l->t("TimeManager");
    }

    public function getPriority(): int
    {
        return 98;
    }

    public function getIcon(): string
    {
        return $this->urlGenerator->imagePath(Application::APP_ID, 'timemanager-dark.svg');
    }
}
