<?php

namespace OCA\TimeManager\Db;

interface ICurrentUser
{
    function setCurrentUser(string $userId): void;
}
