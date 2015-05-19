define([
        'require',
        'jquery',
        'handlebars',
        'underscore',
        'text!faostat-ui-analysis-ghg-spatial/html/templates.hbs',
        'i18n!faostat-ui-analysis-ghg-spatial/nls/translate',

        // TODO Change it
        //'text!faostat-ui-analysis-ghg-spatial/config/data.json',
        'text!geobricks_ui_distribution/config/data.json',
        //'jstree',
        'chosen',
        'sweetAlert'
        ], function (
    Require,
    $,
    Handlebars,
    _,
    templates,
    i18n,
    data) {

    'use strict';

    function GHG_SPATIAL() {
        this.o = {
            placeholder: 'container',
            placeholder_tab: 'container_tab',
            //default_module: 'GEOBRICKS-UI-DISTRIBUTION',
            default_module: 'ghg_spatial_download',
            cached_modules: {}
        };
    }

    GHG_SPATIAL.prototype.init = function(config) {
        console.log(config);
        this.o = $.extend(true, {}, this.o, config);
        console.log(this.o);
        this.render();
    };

    GHG_SPATIAL.prototype.render = function() {

        /* Load template. */
        var source = $(templates).filter('#main_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            spatial_download : i18n.spatial_download,
            spatial_browse: i18n.spatial_browse
        };
        var html = template(dynamic_data);
        $('#' + this.o.placeholder).html(html);


        var _this = this;
        $('#ghg-spatial-tab-panel').on('shown.bs.tab',  function (e) {
            try {
                console.log(_this.getModuleCode());
                _this.o.cached_modules[_this.getModuleCode()].refresh();
            }catch(e){}
        });

        // Init
        this.init_module("ghg_spatial_download", "ghg_spatial_download_panel", true);
        this.init_module("ghg_spatial_browse", "ghg_spatial_browse_panel", false);
    };

    GHG_SPATIAL.prototype.getModuleCode = function(moduleCode, id, isActive) {
        return $($('#ghg-spatial-tab-panel').find('ul').find('li.active').find('a')[0]).attr('aria-controls');
    };


    GHG_SPATIAL.prototype.init_module = function(moduleCode, id, isActive) {
        var m = this.o[moduleCode];
        // TODO: if not initaliazed
        var _this = this;
        Require([m.require], function (MODULE) {
            var config = $.extend(true, {}, m.module_config);
            config.placeholder = id;
            config.placeholder_id = id;
            config.lang = _this.lang;
            var module = new MODULE(config);
            module.init(config);
            _this.o.cached_modules[moduleCode] = module;
        });
    };

    GHG_SPATIAL.prototype.getLabel = function(label) {
        return translate[label]? translate[label]: label;
    }

    return GHG_SPATIAL;
});