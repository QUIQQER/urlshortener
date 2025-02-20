<?php

/**
 * This file contains package_quiqqer_urlshortener_ajax_update
 */

/**
 * Updates an url entry
 *
 * @param string $urlId - ID of the url
 * @param string $target
 * @param string|bool $shortened - optional
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_urlshortener_ajax_update',
    function ($urlId, $params) {
        $Handler = new QUI\Url\Handler();
        $Url = $Handler->getChild($urlId);

        $Url->setAttributes(json_decode($params, true));
        $Url->update();
    },
    ['urlId', 'params'],
    'Permission::checkAdminUser'
);
