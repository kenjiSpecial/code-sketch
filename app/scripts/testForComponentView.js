'use strict';

define([
    // libraries
    'backbone',
    'fpsMeter',

    // components
    'components/loaders/loader-visual',

    // models
    'models/window-model',

    'helpers/events'
], function( Backbone,FPSMeter, LoaderVisual, windowModel, Events ){
    var fpsMeter = new FPSMeter({heat: true, theme : "dark", graph: true});

    var TestView = Backbone.View.extend({
        canvas : null,
        ctx    : null,

        loaderVisual : null,

        initialize : function(){
            _.bindAll(this, 'update');
            this.canvas = document.getElementById("c");
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.ctx = this.canvas.getContext("2d");

            this.loaderVisual = new LoaderVisual(this.ctx);
        },

        show : function(){
            this.loaderVisual.show();
            this.loaderVisual.start();

            Events.on(Events.TICK, this.update);
        },

        update : function(){

            this.loaderVisual.update();

            fpsMeter.tick();
        }
    });

    return TestView;
});