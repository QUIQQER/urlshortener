/**
 * Shortend Handler Panel
 * Shows all shortend urls
 *
 * @module package/quiqqer/urlshortener/bin/controls/Panel
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/desktop/Panel
 * @require Locale
 * @require controls/grid/Grid
 * @require package/quiqqer/urlshortener/bin/classes/Handler
 */
define('package/quiqqer/urlshortener/bin/controls/Panel', [

    'qui/QUI',
    'qui/controls/desktop/Panel',
    'Locale',
    'controls/grid/Grid',
    'package/quiqqer/urlshortener/bin/classes/Handler'

], function (QUI, QUIPanel, QUILocale, Grid, UrlShortener) {
    "use strict";

    var lg      = 'quiqqer/urlshortener',
        Handler = new UrlShortener();

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/urlshortener/bin/controls/Panel',

        Binds: [
            '$onCreate',
            '$onResize',
            'refresh'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Grid = null;

            this.setAttributes({
                'title': QUILocale.get(lg, 'menu.urlshortener.title')
            });

            this.addEvents({
                onCreate: this.$onCreate,
                onResize: this.$onResize
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {


            // Grid
            var self = this;

            var Container = new Element('div').inject(
                this.getContent()
            );

            this.$Grid = new Grid(Container, {
                multipleSelection: true,
                pagination       : true,
                columnModel      : [{
                    header   : QUILocale.get('quiqqer/system', 'id'),
                    dataIndex: 'id',
                    dataType : 'number',
                    width    : 60
                }, {
                    header   : QUILocale.get(lg, 'grid.title.shortend'),
                    dataIndex: 'shortend',
                    dataType : 'string',
                    width    : 200
                }, {
                    header   : QUILocale.get(lg, 'grid.title.url'),
                    dataIndex: 'url',
                    dataType : 'string',
                    width    : 400
                }]
            });

            this.$Grid.addEvents({
                onRefresh : this.refresh,
                onDblClick: function (event) {
                    self.editChild(
                        self.$Grid.getDataByRow(event.row).id
                    );
                },
                onClick   : function () {
                    var selected = self.$Grid.getSelectedData();

                    if (selected.length) {
                        self.getButtons('delete').enable();
                    } else {
                        self.getButtons('delete').disable();
                    }
                }
            });

            this.$Grid.refresh();
        },

        /**
         * event : on resize
         */
        $onResize: function () {
            if (!this.$Grid) {
                return;
            }

            var Body = this.getContent();

            if (!Body) {
                return;
            }


            var size = Body.getSize();

            this.$Grid.setHeight(size.y - 40);
            this.$Grid.setWidth(size.x - 40);
        },

        /**
         * refresh the display
         */
        refresh: function () {

            var self = this;

            this.Loader.show();

            Handler.getList({
                perPage: this.$Grid.options.perPage,
                page   : this.$Grid.options.page
            }).then(function (data) {
                self.$Grid.setData(data);
                self.Loader.hide();
            });
        }
    });
});
