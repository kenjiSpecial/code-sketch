'use strict';

define([
    // libraries
    'backbone',
    'fpsMeter',

    // components
    'components/loaders/loader-visual',

    // models
    'models/window-model',

    // collections
    'collections/work-model-collection',

    // helpers
    'helpers/events',
    'helpers/loader',
    'helpers/modernizr'
], function( Backbone,FPSMeter, LoaderVisual, windowModel, workModelCollection, Events, loader, modernizr ){
    //var fpsMeter = new FPSMeter({heat: true, theme : "dark", graph: true});

    var LoaderView = Backbone.View.extend({
        el     : "#ks-loader",
        isShow : false,
        canvas : null,
        ctx    : null,

        loaderVisual : null,

        loadManifest : [],

        initialize : function(){

            _.bindAll(this, 'update', 'startLoadData', 'onImagesLoadDoneHandler', 'onLoaderViewCompleteHandler', 'onWindowResizeHandler', 'onTweenLoaderRateHandler');
            this.canvas = document.getElementById("ks-loader-canvas");
            this.canvas.width = window.innerWidth * windowModel.scaleFactor;
            this.canvas.height = window.innerHeight * windowModel.scaleFactor;

            this.ctx = this.canvas.getContext("2d");

            this.loaderVisual = new LoaderVisual(this.ctx);

            Events.on(Events.WINDOW_RESIZE, this.onWindowResizeHandler);
        },

        show : function(){
            this.isShow = true;

            this.loaderVisual.show();
            this.loaderVisual.start();

            Events.on(Events.TICK, this.update);

            _.delay(this.startLoadData, 1000);
        },


        startRectAnimation : function(){
            TweenLite.to( this,.6, { rectTopLeftY  : 0, ease : "Power4.easeOut"});
            TweenLite.to( this,.6, { rectTopRightY : 0, ease : "Power1.easeOut"});

            //rect2TopRightX rect2BotRightX
            var leftPos = window.innerWidth * windowModel.scaleFactor;
            TweenLite.to( this,.6, { rect2TopRightX  : leftPos, ease : "Power1.easeOut", delay:.2});
            TweenLite.to( this,.6, { rect2BotRightX : leftPos,  ease : "Power4.easeOut", delay:.2});

        },

        hide : function(){
            this.isShow = false;

            windowModel.$body.css({"background-color" : "#e1e1e1"});
            this.$el.css({"display": "none"});

            Events.off(Events.TICK, this.update);
        },

        startLoadData : function(){
            if(workModelCollection.isFetch){

            }else{
                var self = this;
                workModelCollection.fetch({
                    success : function(messages){
                        if(modernizr.isMobile){
                            self.startLoadImages();
                        }else{
                            self.autoLoader();
                        }
                    }
                });
            }
        },

        autoLoader : function(){
            if(!modernizr.isMobile){
                this.loaderRate = 0;
                Events.on(Events.LOAD_DONE, this.onImagesLoadDoneHandler);
                TweenLite.to(this,.8, {loaderRate: 1, onComplete: this.onTweenLoaderRateHandler});
            };
        },

        onTweenLoaderRateHandler : function(){
            console.log("onTweenLoaderRateHandler")
            Events.trigger(Events.LOAD_DONE);
        },

        startLoadImages : function(){
            var workModelCollectionJson = workModelCollection.toJSON();

            var self = this;
            workModelCollectionJson.forEach(function(data){
                var thumbnailUrl = data.thumbnail_url;
                var thumbnailId  = data.id;
                self.loadManifest.push({url: thumbnailUrl, id: thumbnailId});
                //loader.loadManifest([thumbnailUrl]);
            });

            loader.loadManifest(this.loadManifest);

            Events.on(Events.LOAD_DONE, this.onImagesLoadDoneHandler);
        },

        onImagesLoadDoneHandler : function(){
            if(modernizr.isMobile ) _.delay(this.onLoaderViewCompleteHandler, 2000);
            else                    _.delay(this.onLoaderViewCompleteHandler, 1500);
            Events.trigger(Events.RENDER_WORK_VIEW);
        },

        onLoaderViewCompleteHandler : function(){
            Events.trigger(Events.LOADER_VIEW_COMPLETE);
        },

        update : function(){

            if(modernizr.isMobile) this.loaderVisual.update(loader.getProgress());
            else              this.loaderVisual.update(this.loaderRate);
        },

        onWindowResizeHandler : function(){
            this.canvas.width = window.innerWidth * windowModel.scaleFactor;
            this.canvas.height = window.innerHeight * windowModel.scaleFactor;

            this.loaderVisual.resize();
        }
    });

    return LoaderView;
});
