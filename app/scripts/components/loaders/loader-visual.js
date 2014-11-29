/**
 * Created by kenji-special on 10/19/14.
 */
define([
    // libraries
    'backbone',

    // components/loaders
    'components/loaders/loader-animation-object',

    // helpers
    'helpers/events'
], function ( Backbone, LoaderAnimationObject, events ) {
    var isTest = true;

    var DummyLoader = function(){
        _.bindAll(this, 'updateTimer');

    };

    DummyLoader.prototype = {
        count : 0,
        MAX_COUNT : 20,
        TIMER_DURATION : 50,

        start : function(){
            setTimeout(this.updateTimer, this.TIMER_DURATION);
        },

        updateTimer : function(){
            this.count++;

            if(this.count >= this.MAX_COUNT)    this.onCompleteHandler();
            else                                setTimeout(this.updateTimer, this.TIMER_DURATION);
        },

        progress : function(){
            return this.count / this.MAX_COUNT;
        },

        onCompleteHandler : function(){
            setTimeout(function(){
                events.trigger(events.LOAD_DONE);
            }, 500)
        }
    };

    // ===========================

    //var dummyLoader = new DummyLoader();

    var LoaderVisual = function(ctx){
        _.bindAll(this, 'onLoadDoneHandler');
        this.ctx = ctx;

        this.loadAnimationObject = new LoaderAnimationObject(this.ctx);

        events.on(events.LOAD_DONE, this.onLoadDoneHandler);
    };

    LoaderVisual.prototype = {
        titleEl : document.getElementById("#ks-title"),
        show : function(){

        },

        start : function(){
            //dummyLoader.start();
            this.loadAnimationObject.start();
        },

        update : function(rate){
            this.loadAnimationObject.update(rate);

        },

        onLoadDoneHandler : function(){

            var self = this;


            setTimeout(function(){
                self.loadAnimationObject.startFullScreen();
            }, 600)
        },

        resize : function(){
            this.loadAnimationObject.resize();
        }

    };

    // -------------------------

    return LoaderVisual;
});
