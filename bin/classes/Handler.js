/**
 * URL shortener handler
 * Create and edit urls
 *
 * @module package/quiqqer/urlshortener/bin/classes/Handler
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/urlshortener/bin/classes/Handler', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,
        Type   : 'package/quiqqer/urlshortener/bin/classes/Handler',

        /**
         * Search an url
         *
         * @param {Object} [params] - query params
         * @returns {Promise}
         */
        search: function (params) {
            params = params || {};

            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_urlshortener_ajax_search', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    params   : JSON.encode(params)
                });
            });
        },

        /**
         *
         * @return {Promise}
         */
        getHosts: function () {
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_urlshortener_ajax_getHosts', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject
                });
            });
        },

        /**
         * Return the data of an url
         *
         * @param {number} urlId
         * @returns {Promise}
         */
        getChild: function (urlId) {
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_urlshortener_ajax_get', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    id       : parseInt(urlId)
                });
            });
        },

        /**
         * Search shortened urls and return the result for a grid
         *
         * @param {Object} params
         * @returns {Promise}
         */
        getList: function (params) {
            params = params || {};

            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_urlshortener_ajax_list', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    params   : JSON.encode(params)
                });
            });
        },

        /**
         * Create a new shortened url
         *
         * @params {String} url
         * @params {String} [shortened]
         * @returns {Promise}
         */
        createChild: function (url, shortened) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post('package_quiqqer_urlshortener_ajax_create', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    target   : url,
                    shortened: shortened || false
                });
            });
        },

        /**
         * Delete an shortened url
         *
         * @param {Number} urlId - URL-ID
         * @returns {Promise}
         */
        deleteChild: function (urlId) {
            return this.deleteChildren([urlId]);
        },

        /**
         * Delete multiple shortened urls
         *
         * @param {Array} urlIds - array of URL-IDs
         * @returns {Promise}
         */
        deleteChildren: function (urlIds) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post('package_quiqqer_urlshortener_ajax_delete', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    urlIds   : JSON.encode(urlIds)
                });
            });
        },

        /**
         * Save an shortened url
         *
         * @param {Number} urlId
         * @param {Object} data - url attributes
         * @returns {Promise}
         */
        update: function (urlId, data) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post('package_quiqqer_urlshortener_ajax_update', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    urlId    : urlId,
                    params   : JSON.encode(data)
                });
            });
        }
    });
});
