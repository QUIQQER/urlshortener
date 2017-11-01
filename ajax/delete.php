<?php

/**
 * This file contains package_quiqqer_urlshortener_ajax_create
 */

/**
 * Delete an url entry
 *
 * @param string $params - JSON query params
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_urlshortener_ajax_delete',
    function ($urlIds) {
        $urlIds = json_decode($urlIds, true);

        $Shortener = new QUI\Url\Shortener();
        $Shortener->deleteUrl($urlIds);
    },
    array('urlIds'),
    'Permission::checkAdminUser'
);
