<?php

/**
 * This file contains package_quiqqer_urlshortener_ajax_get
 */

/**
 * Returns an url entry
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_urlshortener_ajax_get',
    function ($urlId) {
        $Handler = new QUI\Url\Handler();

        return $Handler->getChild($urlId)->getAttributes();
    },
    ['urlId'],
    'Permission::checkAdminUser'
);
