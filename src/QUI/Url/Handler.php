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
    public function getDataBaseTableName()
    {
        return 'urlshortener';
    }

    /**
     * @return array
     */
    public function getChildAttributes()
    {
        return array(
            'shortened',
            'url',
            'title',
            'description',
            'params'
        );
    }

    /**
     * @return string
     */
    public function getChildClass()
    {
        return 'QUI\Url\Url';
    }
}
