/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },

        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports : 'Backbone'
        },

        backboneTouch:{
            deps:['backbone'],
            exports:'Backbone'
        },


        fpsMeter : {
             exports : "FPSMeter"
        },

        preloadjs : {
            exports: 'createjs'
        }


    },
    paths: {
        jquery           : '../bower_components/jquery/dist/jquery',
        backbone         : '../bower_components/backbone/backbone',
        backboneTouch    : '../bower_components/backbone.touch/backbone.touch',
        underscore       : '../bower_components/lodash/dist/lodash',
        fpsMeter         : '../bower_components/fpsmeter/dist/fpsmeter',
        TweenLite        : '../bower_components/greensock/src/uncompressed/TweenMax',
        preloadjs        : '../bower_components/PreloadJS/lib/preloadjs-0.4.1.combined',
    }
});

require([
    'backbone',

    // route
    "router"

    // view
   // 'testForComponentView',


], function ( Backbone,  AppRouter) {

    //var testForComponentView = new TestForComponentView();
    //testForComponentView.show();

    var appRouter = new AppRouter();
    Backbone.history.start();

});
