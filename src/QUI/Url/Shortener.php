<?php

/**
 * This file contains QUI\Url\Shortener
 */

namespace QUI\Url;

use QUI;
use QUI\Database\Exception;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Shortener
 *
 * @package QUI\Url
 */
class Shortener
{
    protected static QUI\Config | null $Config = null;

    /**
     * Return the database table name
     *
     * @return string
     */
    public static function getDataBaseTableName(): string
    {
        return QUI::getDBTableName('urlshortener');
    }

    /**
     * Return the shortener config object
     *
     * @return bool|null|QUI\Config
     */
    protected static function getConfig(): QUI\Config | bool | null
    {
        if (self::$Config === null) {
            self::$Config = QUI::getPackage('quiqqer/urlshortener')->getConfig();
        }

        return self::$Config;
    }

    /**
     * Return the default host for the links
     *
     * @return string
     */
    public static function getDefaultHost(): string
    {
        $host = self::getConfig()->get('general', 'host');

        if (!empty($host)) {
            if (!str_contains($host, 'https://') && !str_contains($host, 'http://')) {
                $host = 'https://' . $host;
            }
        } else {
            $host = QUI::getProjectManager()->get()->getVHost(true, true);
        }

        return rtrim($host, '/') . '/';
    }

    /**
     * Return the available hosts
     *
     * @return array
     */
    public static function getAvailableHosts(): array
    {
        $hosts = array();

        foreach (QUI::vhosts() as $host => $data) {
            if (!str_contains($host, 'https://') && !str_contains($host, 'http://')) {
                $host = 'https://' . $host;
            }

            $hosts[] = rtrim($host, '/') . '/';
        }

        return $hosts;
    }

    /**
     * Locale tracking?
     *
     * @return bool
     */
    protected static function isLocaleTrackingOn(): bool
    {
        return self::getConfig()->get('general', 'localeTracking');
    }

    /**
     * Piwik tracking?
     *
     * @return bool
     */
    protected static function isPiwikTrackingOn(): bool
    {
        return self::getConfig()->get('general', 'piwikTracking');
    }

    /**
     * Event : on request
     *
     * @param QUI\Rewrite $Rewrite
     * @param string $url
     */
    public static function onRequest($Rewrite, $url): void
    {
        // media files are irrelevant
        if (str_contains($url, 'media/cache')) {
            return;
        }

        if (empty($url)) {
            return;
        }

        $result = QUI::getDataBase()->fetch(array(
            'from' => self::getDataBaseTableName(),
            'where' => array(
                'shortened' => $url
            ),
            'limit' => 1
        ));

        if (!isset($result[0])) {
            return;
        }


        // piwik tracking
        if (class_exists('QUI\Piwik\Piwik') && self::isPiwikTrackingOn()) {
            $Project = $Rewrite->getProject();
            $Piwik = QUI\Piwik\Piwik::getPiwikClient($Project);

            $Piwik->setIp(QUI\Utils\System::getClientIP());
            $Piwik->doTrackPageView($url);
        }

        // locale tracking
        if (self::isLocaleTrackingOn()) {
            if (empty($result[0]['count'])) {
                $result[0]['count'] = 0;
            }

            QUI::getDataBase()->update(self::getDataBaseTableName(), array(
                'count' => $result[0]['count'] + 1
            ), array(
                'id' => $result[0]['id']
            ));
        }

        $url = $result[0]['url'];

        if (strpos($url, 'http://') === false && strpos($url, 'https://') === false) {
            $url = 'https://' . $url;
        }

        // nexgam switch
//        $url = parse_url($result[0]['url']);
//        parse_str($url['query'], $query);
//
//        $query['customid'] = '5337485606';
//        $query['campid']   = 5337485606;
//
//        $url['query'] = http_build_query($query);
//
//        $_url = 'http://'.$url['host'].$url['path'].'?'.$url['query'];
//        $Redirect = new RedirectResponse($_url);

        $Redirect = new RedirectResponse($url);
        $Redirect->setStatusCode(Response::HTTP_SEE_OTHER);

        echo $Redirect->getContent();
        $Redirect->send();
        exit;
    }

    /**
     * Add a new url and return the shorten link
     *
     * @param string $url - target url
     * @param bool|string $shortened - default = if false = random shortened url
     * @return string - new url
     *
     * @throws Exception|QUI\Database\Exception
     */
    public function addUrl(string $url, bool | string $shortened = false): string
    {
        if (!is_string($shortened) || empty($shortened)) {
            $shortened = $this->random();
        }

        if (empty($url)) {
            throw new Exception(array(
                'quiqqer/urlshortener',
                'exception.url.empty'
            ));
        }

        $result = QUI::getDataBase()->fetch(array(
            'from' => self::getDataBaseTableName(),
            'where' => array(
                'shortened' => $shortened
            ),
            'limit' => 1
        ));

        if (isset($result[0])) {
            throw new Exception(array(
                'quiqqer/urlshortener',
                'exception.url.already.exists'
            ));
        }

        QUI::getDataBase()->insert($this->getDataBaseTableName(), array(
            'shortened' => $shortened,
            'url' => $url
        ));

        return rtrim(HOST, '/') . URL_DIR . $shortened;
    }

    /**
     * Delete an url or multiple urls
     *
     * @param integer|array $urlId
     * @throws Exception
     */
    public function deleteUrl(int | array $urlId): void
    {
        if (!is_array($urlId)) {
            $urlId = array($urlId);
        }

        foreach ($urlId as $id) {
            QUI::getDataBase()->delete($this->getDataBaseTableName(), array(
                'id' => $id
            ));
        }
    }

    /**
     * Return random shortened
     *
     * @return string
     * @throws Exception
     */
    public function random(): string
    {
        $random = substr(
            str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"),
            0,
            10
        );

        $result = QUI::getDataBase()->fetch(array(
            'from' => $this->getDataBaseTableName(),
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
