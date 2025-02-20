<?php

/**
 * This file contains QUI\Url\Handler
 */

namespace QUI\Url;

use QUI;

/**
 * Class Handler
 *
 * @package QUI\Url
 */
class Handler extends QUI\CRUD\Factory
{
    /**
     * @return string
     */
    public function getDataBaseTableName(): string
    {
        return 'urlshortener';
    }

    /**
     * @return array
     */
    public function getChildAttributes(): array
    {
        return [
            'shortened',
            'url',
            'title',
            'description',
            'params',
            'host'
        ];
    }

    /**
     * @return string
     */
    public function getChildClass(): string
    {
        return 'QUI\Url\Url';
    }
}
