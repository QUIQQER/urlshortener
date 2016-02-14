<?php

/**
 * This file contains package_quiqqer_urlshortener_ajax_list
 */

/**
 * Returns url list for a grid
 *
 * @param string $params - JSON query params
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_urlshortener_ajax_list',
    function ($params) {
        $Urls   = new QUI\Url\Handler();
        $result = array();
        $Grid   = new \QUI\Utils\Grid();

        $data = $Urls->getChildrenData(
            $Grid->parseDBParams(json_decode($params, true))
        );

        foreach ($data as $entry) {
            $result[] = array(
                'id' => $entry['id'],
                'url' => $entry['url'],
                'shortened' => $entry['shortened']
            );
        }

        return $Grid->parseResult($result, $Urls->countChildren());
    },
    array('params'),
    'Permission::checkAdminUser'
);
