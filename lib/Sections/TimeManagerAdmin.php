<?php

namespace OCA\TimeManager\Sections;

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
        return 'timemanager';
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
        return $this->urlGenerator->imagePath('timemanager', 'timemanager-dark.svg');
    }
}
