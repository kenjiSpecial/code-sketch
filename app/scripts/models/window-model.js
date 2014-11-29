define([
    'backbone',

    // helpers
    'helpers/events',
    'helpers/modernizr'
], function(Backbone, Events, modernizr){
    function backingScale(context) {
        if ('devicePixelRatio' in window) {
            if (window.devicePixelRatio > 1) {
                return window.devicePixelRatio;
            }
        }
        return 1;
    }


    var WindowModel = Backbone.Model.extend({
        defaults: {
            "mouse":  null,
            'windowSize' : {width: window.innerWidth, height: window.innerHeight},
            "scaleFactor": 1
        }
    });

    Object.defineProperty(WindowModel.prototype, 'windowSize', {
        get : function(){
            return this.get('windowSize');
        },

        set : function(val){
            this.set({windowSize: val});
        }
    });

    Object.defineProperty(WindowModel.prototype, 'mouse', {
        get : function(){
            return this.get('mouse');
        },

        set : function(val){
            this.set({mouse : val});
        }
    });

    Object.defineProperty(WindowModel.prototype, 'scaleFactor', {
        get : function(){
            return this.get('scaleFactor');
        },
        set : function(val){
            this.set({'scaleFactor': val});
        }
    });

    var windowModel = new WindowModel();

    _.extend(windowModel, {
        "$body" : $('html body')
    });

    // checking device is retina or not
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    windowModel.scaleFactor = backingScale(ctx);

    if(modernizr.isDebug) window.windowModel = windowModel;

    window.addEventListener(Events.WINDOW_RESIZE, onResizeWindowHandler);

    function onResizeWindowHandler(){
        Events.trigger(Events.WINDOW_RESIZE);
    }


    return windowModel;
});
