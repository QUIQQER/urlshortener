<?php

/**
 * This file contains QUI\Url\Shortener
 */
namespace QUI\Url;

use QUI;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Shortener
 * @package QUI\Url
 */
class Shortener
{
    /**
     * Return the database table name
     *
     * @return string
     */
    public static function getDataBaseTableName()
    {
        return QUI::getDBTableName('urlshortener');
    }

    /**
     * Event : on request
     *
     * @param QUI\Rewrite $Rewrite
     * @param string $url
     */
    public static function onRequest($Rewrite, $url)
    {
        // media files are irrelevant
        if (strpos($url, 'media/cache') !== false) {
            return;
        }

        if (empty($url)) {
            return;
        }

        $result = QUI::getDataBase()->fetch(array(
            'from'  => self::getDataBaseTableName(),
            'where' => array(
                'shortened' => $url
            )
        ));

        if (!isset($result[0])) {
            return;
        }

        if (class_exists('QUI\Piwik\Piwik')) {
            $Project = $Rewrite->getProject();
            $Piwik   = QUI\Piwik\Piwik::getPiwikClient($Project);

            $Piwik->setIp(QUI\Utils\System::getClientIP());
            $Piwik->doTrackPageView($url);
        }

        // nexgam switch
        $url = parse_url($result[0]['url']);
        parse_str($url['query'], $query);

        $query['customid'] = '5337485606';
        $query['campid']   = 5337485606;

        $url['query'] = http_build_query($query);

        $_url = 'http://' . $url['host'] . $url['path'] . '?' . $url['query'];

        //$Redirect = new RedirectResponse($result[0]['url']);
        $Redirect = new RedirectResponse($_url);
        $Redirect->setStatusCode(Response::HTTP_SEE_OTHER);

        echo $Redirect->getContent();
        $Redirect->send();
        exit;
    }

    /**
     * Add a new url and return the shorten link
     *
     * @param string $url
     * @return string
     */
    public function addUrl($url)
    {
        $random = $this->random();

        QUI::getDataBase()->insert(
            $this->getDataBaseTableName(),
            array(
                'shortened' => $random,
                'url'       => $url
            )
        );

        return rtrim(HOST, '/') . URL_DIR . $random;
    }

    /**
     * Return random shortend
     *
     * @return string
     */
    public function random()
    {
        $random = substr(
            str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"),
            0,
            10
        );

        $result = QUI::getDataBase()->fetch(array(
            'from'  => $this->getDataBaseTableName(),
            'where' => array(
                'shortened' => $random
            )
        ));

        if (!isset($result[0])) {
            return $random;
        }

        return $this->random();
    }
}
