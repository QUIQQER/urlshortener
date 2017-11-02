<?php

/**
 * This file contains package_quiqqer_urlshortener_ajax_getHosts
 */

/**
 * Returns all available hosts for the shortened links
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_urlshortener_ajax_getHosts',
    function () {
        return QUI\Url\Shortener::getAvailableHosts();
    },
    false,
    'Permission::checkAdminUser'
);
