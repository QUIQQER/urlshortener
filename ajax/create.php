<?php

/**
 * This file contains package_quiqqer_urlshortener_ajax_create
 */

/**
 * Create a new url entry
 *
 * @param string $target
 * @param string|bool $shortened - optional
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_urlshortener_ajax_create',
    function ($target, $shortened) {
        $Shortener = new QUI\Url\Shortener();

        return $Shortener->addUrl($target, $shortened);
    },
    ['target', 'shortened'],
    'Permission::checkAdminUser'
);
