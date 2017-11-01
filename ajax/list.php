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
        $Handler = new QUI\Url\Handler();
        $Grid    = new QUI\Utils\Grid();
        $result  = array();

        $data = $Handler->getChildrenData(
            $Grid->parseDBParams(json_decode($params, true))
        );

        $defaultHost = QUI\Url\Shortener::getDefaultHost();
        $defaultHost = rtrim($defaultHost, '/').'/';

        foreach ($data as $entry) {
            // default host
            if (empty($entry['host'])) {
                $entry['host'] = $defaultHost;
            }

            $result[] = array(
                'id'        => $entry['id'],
                'url'       => $entry['url'],
                'shortened' => $entry['shortened'],
                'host'      => $entry['host']
            );
        }

        return $Grid->parseResult($result, $Handler->countChildren());
    },
    array('params'),
    'Permission::checkAdminUser'
);
