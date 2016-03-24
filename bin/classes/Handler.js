/**
 * URL shortener handler
 * Create and edit urls
 *
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/classes/DOM
 * @require Ajax
 */
define('package/quiqqer/urlshortener/bin/classes/Handler', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, Ajax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,
        Type   : 'package/quiqqer/urlshortener/bin/classes/Handler',

        /**
         * Search url shortenr
         *
         * @param {Object} [params] - query params
         * @returns {Promise}
         */
        search: function (params) {
            params = params || {};

            return new Promise(function (resolve, reject) {
                Ajax.get('package_quiqqer_urlshortener_ajax_search', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    params   : JSON.encode(params)
                });
            });
        },

        /**
         *
         * @param {number} urlId
         * @returns {Promise}
         */
        getChild: function (urlId) {
            return new Promise(function (resolve, reject) {
                Ajax.get('package_quiqqer_urlshortener_ajax_get', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    id       : parseInt(urlId)
                });
            });
        },

        /**
         * Search shortend urls and return the result for a grid
         *
         * @param {Object} params
         * @returns {Promise}
         */
        getList: function (params) {
            params = params || {};

            return new Promise(function (resolve, reject) {
                Ajax.get('package_quiqqer_urlshortener_ajax_list', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    params   : JSON.encode(params)
                });
            });
        },

        /**
         * Create a new shortend url
         *
         * @params {Array} [params] - url attributes
         * @returns {Promise}
         */
        createChild: function (params) {
            return new Promise(function (resolve, reject) {
                Ajax.post('package_quiqqer_urlshortener_ajax_create', function (result) {

                    require([
                        'package/quiqqer/translator/bin/classes/Translator'
                    ], function (Translator) {
                        new Translator().refreshLocale().then(function () {
                            resolve(result);
                        });
                    });
                }, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    params   : JSON.encode(params)
                });
            });
        },

        /**
         * Delete an shortend url
         *
         * @param {Number} urlId - URL-ID
         * @returns {Promise}
         */
        deleteChild: function (urlId) {
            return new Promise(function (resolve, reject) {
                Ajax.post('package_quiqqer_urlshortener_ajax_deleteChild', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    urlId    : urlId
                });
            });
        },

        /**
         * Delete multible shortend urls
         *
         * @param {Array} urlIds - array of URL-IDs
         * @returns {Promise}
         */
        deleteChildren: function (urlIds) {
            return new Promise(function (resolve, reject) {
                Ajax.post('package_quiqqer_urlshortener_ajax_deleteChildren', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    urlIds   : JSON.encode(urlIds)
                });
            });
        },

        /**
         * Save an shortend url
         *
         * @param {Number} urlId
         * @param {Object} data - url attributes
         */
        save: function (urlId, data) {
            return new Promise(function (resolve, reject) {
                Ajax.post('package_quiqqer_urlshortener_ajax_update', resolve, {
                    'package': 'quiqqer/urlshortener',
                    onError  : reject,
                    urlId    : urlId,
                    params   : JSON.encode(data)
                });
            });
        }
    });
});