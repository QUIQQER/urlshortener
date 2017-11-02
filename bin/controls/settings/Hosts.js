/**
 * @module package/quiqqer/urlshortener/bin/controls/settings/Hosts
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/urlshortener/bin/controls/settings/Hosts', [

    'qui/QUI',
    'qui/controls/Control',
    'package/quiqqer/urlshortener/bin/Handler'

], function (QUI, QUIControl, Handler) {
    "use strict";

    var lg = 'quiqqer/urlshortener';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/urlshortener/bin/controls/settings/Hosts',

        Binds: [
            '$deleteEntry',
            '$addEntry'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * event: on import
         */
        $onImport: function () {
            var self = this;

            this.$Select = this.getElm();

            Handler.getHosts().then(function (result) {
                self.$Select.set('html', '');

                for (var i = 0, len = result.length; i < len; i++) {
                    new Element('option', {
                        html: result[i]
                    }).inject(self.$Select);
                }
            });
        }
    });
});
