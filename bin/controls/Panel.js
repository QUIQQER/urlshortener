/**
 * Shortend Handler Panel
 * Shows all shortend urls
 *
 * @module package/quiqqer/urlshortener/bin/controls/Panel
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/urlshortener/bin/controls/Panel', [

    'qui/QUI',
    'qui/controls/desktop/Panel',
    'qui/controls/windows/Confirm',
    'Locale',
    'Mustache',
    'controls/grid/Grid',
    'package/quiqqer/urlshortener/bin/classes/Handler',

    'text!package/quiqqer/urlshortener/bin/controls/Window.Add.html',
    'css!package/quiqqer/urlshortener/bin/controls/Panel.css'

], function (QUI, QUIPanel, QUIConfirm, QUILocale, Mustache, Grid, UrlShortener, templateAdd) {
    "use strict";

    var lg      = 'quiqqer/urlshortener',
        Handler = new UrlShortener();

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/urlshortener/bin/controls/Panel',

        Binds: [
            '$onCreate',
            '$onResize',
            'refresh',
            'add',
            'edit',
            'remove'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Grid = null;

            this.setAttributes({
                title: QUILocale.get(lg, 'menu.urlshortener.title')
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
            this.addButton({
                name     : 'add',
                textimage: 'fa fa-plus',
                text     : QUILocale.get('quiqqer/system', 'add'),
                events   : {
                    onClick: this.add
                }
            });

            this.addButton({
                name     : 'edit',
                textimage: 'fa fa-edit',
                text     : QUILocale.get('quiqqer/system', 'edit'),
                disabled : true,
                events   : {
                    onClick: this.edit
                }
            });

            this.addButton({
                type: 'separator'
            });

            this.addButton({
                name     : 'delete',
                textimage: 'fa fa-trash',
                text     : QUILocale.get('quiqqer/system', 'remove'),
                disabled : true,
                events   : {
                    onClick: this.remove
                }
            });

            // Grid
            var self = this;

            var Container = new Element('div').inject(
                this.getContent()
            );

            this.$Grid = new Grid(Container, {
                multipleSelection: true,
                pagination       : true,
                columnModel      : [{
                    header   : '',
                    dataIndex: 'copy',
                    dataType : 'button',
                    width    : 40
                }, {
                    header   : QUILocale.get('quiqqer/system', 'id'),
                    dataIndex: 'id',
                    dataType : 'number',
                    width    : 60
                }, {
                    header   : QUILocale.get(lg, 'grid.title.shortened'),
                    dataIndex: 'shortened',
                    dataType : 'string',
                    width    : 120
                }, {
                    header   : QUILocale.get(lg, 'grid.title.url'),
                    dataIndex: 'url',
                    dataType : 'string',
                    width    : 300
                }, {
                    dataIndex: 'host',
                    dataType : 'string',
                    hidden   : true
                }]
            });

            this.$Grid.addEvents({
                onRefresh : this.refresh,
                onDblClick: this.edit,
                onClick   : function () {
                    var selected = self.$Grid.getSelectedData();

                    self.getButtons('delete').disable();
                    self.getButtons('edit').disable();

                    if (selected.length) {
                        self.getButtons('delete').enable();
                    }

                    if (selected.length === 1) {
                        self.getButtons('edit').enable();
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
         *
         * @return {Promise}
         */
        refresh: function () {
            var self = this;

            this.Loader.show();

            return Handler.getList({
                perPage: this.$Grid.options.perPage,
                page   : this.$Grid.options.page
            }).then(function (data) {
                for (var i = 0, len = data.data.length; i < len; i++) {
                    data.data[i].copy = {
                        icon  : 'fa fa-copy',
                        url   : data.data[i].host + data.data[i].shortened,
                        title : QUILocale.get(lg, 'copy.to.clipboard', {
                            url: data.data[i].host + data.data[i].shortened
                        }),
                        styles: {
                            'float'   : 'none',
                            lineHeight: 10,
                            margin    : '5px 0 0',
                            padding   : 2
                        }
                    };
                }

                self.$Grid.setData(data);

                // clipboard copy
                var copyButtons = self.$Grid.getElm().getElements('.fa-copy').getParent('button');

                require([URL_OPT_DIR + 'bin/clipboard/dist/clipboard'], function (Clipboard) {
                    for (var i = 0, len = copyButtons.length; i < len; i++) {
                        new Clipboard(copyButtons[i], {
                            text: function (trigger) {
                                var quiid  = trigger.get('data-quiid'),
                                    Button = QUI.Controls.getById(quiid);

                                return Button.getAttribute('url').trim();
                            }
                        });
                    }

                    self.Loader.hide();
                });
            });
        },

        /**
         * Open the add dialog
         */
        add: function () {
            var self = this;

            new QUIConfirm({
                title    : QUILocale.get(lg, 'window.add.title'),
                icon     : 'fa fa-plus',
                maxHeight: 400,
                maxWidth : 600,
                autoclose: false,
                events   : {
                    onOpen  : function (Win) {
                        var Content = Win.getContent();

                        Content.set('html', Mustache.render(templateAdd));

                        var Hosts = Content.getElement('[name="hosts"]');

                        Handler.getHosts().then(function (hosts) {
                            for (var i = 0, len = hosts.length; i < len; i++) {
                                new Element('option', {
                                    html : hosts[i],
                                    value: hosts[i]
                                }).inject(Hosts);
                            }

                            Win.Loader.hide();
                        });
                    },
                    onSubmit: function (Win) {
                        Win.Loader.show();

                        var Content   = Win.getContent();
                        var Shortened = Content.getElement('[name="shortened"]');
                        var Url       = Content.getElement('[name="url"]');

                        Handler.createChild(
                            Url.value,
                            Shortened.value
                        ).then(function () {
                            return self.refresh();
                        }).then(function () {
                            Win.close();
                        }).catch(function () {
                            Win.Loader.hide();
                        });
                    }
                }
            }).open();
        },

        /**
         * Edit an url entry
         */
        edit: function () {
            var selected = this.$Grid.getSelectedData();

            if (selected.length !== 1) {
                return;
            }

            var self = this,
                data = selected[0],
                id   = data.id;

            new QUIConfirm({
                title    : QUILocale.get(lg, 'window.edit.title'),
                icon     : 'fa fa-edit',
                maxHeight: 400,
                maxWidth : 600,
                autoclose: false,
                events   : {
                    onOpen  : function (Win) {
                        var Content = Win.getContent();

                        Win.Loader.show();

                        Content.set('html', Mustache.render(templateAdd));

                        var Shortened = Content.getElement('[name="shortened"]');
                        var Url       = Content.getElement('[name="url"]');
                        var Hosts     = Content.getElement('[name="hosts"]');

                        Shortened.value = data.shortened;
                        Url.value       = data.url;

                        Handler.getHosts().then(function (hosts) {
                            for (var i = 0, len = hosts.length; i < len; i++) {
                                new Element('option', {
                                    html : hosts[i],
                                    value: hosts[i]
                                }).inject(Hosts);
                            }

                            Hosts.value = data.host;

                            Win.Loader.hide();
                        });
                    },
                    onSubmit: function (Win) {
                        Win.Loader.show();

                        var Content   = Win.getContent(),
                            Shortened = Content.getElement('[name="shortened"]'),
                            Url       = Content.getElement('[name="url"]'),
                            Hosts     = Content.getElement('[name="hosts"]');

                        Handler.update(id, {
                            shortened: Shortened.value,
                            url      : Url.value,
                            host     : Hosts.value
                        }).then(function () {
                            return self.refresh();
                        }).then(function () {
                            Win.close();
                        }).catch(function () {
                            Win.Loader.hide();
                        });
                    }
                }
            }).open();
        },

        /**
         * Open the remove dialog
         */
        remove: function () {
            var self     = this,
                selected = this.$Grid.getSelectedData(),
                ids      = '<ul>';

            var i, len, id, url, shortened;

            for (i = 0, len = selected.length; i < len; i++) {
                id        = selected[i].id;
                url       = selected[i].url;
                shortened = selected[i].shortened;

                ids = ids + '<li>#' + id + ' ' + url + ' - ' + shortened + '</li>';
            }

            ids = ids + '</ul>';

            new QUIConfirm({
                title      : QUILocale.get(lg, 'window.remove.title'),
                icon       : 'fa fa-trash',
                texticon   : 'fa fa-trash',
                text       : QUILocale.get(lg, 'window.remove.text'),
                information: QUILocale.get(lg, 'window.remove.information', {
                    ids: ids
                }),
                maxHeight  : 400,
                maxWidth   : 600,
                autoclose  : false,
                ok_button  : {
                    text     : QUILocale.get('quiqqer/system', 'remove'),
                    textimage: 'fa fa-trash'
                },
                events     : {
                    onSubmit: function (Win) {
                        Win.Loader.show();

                        var selectedIds = selected.map(function (entry) {
                            return entry.id;
                        });

                        Handler.deleteChildren(selectedIds).then(function () {
                            return self.refresh();
                        }).catch(function () {
                            return self.refresh();
                        }).then(function () {
                            Win.close();
                        });
                    }
                }
            }).open();
        }
    });
});
