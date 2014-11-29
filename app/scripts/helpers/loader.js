define([
    'backbone',
    'underscore',
    'preloadjs',

    // helpers
    'helpers/events',
    'helpers/modernizr'
], function( Backbone, _, CJS, Events, modernizr ){
    var instance;

    function Preloader() {
        _.bindAll(
            this,
            'onProgress',
            'onFileProgress',
            'onFileLoad',
            'onComplete'
        );

        this.queue             = new CJS.LoadQueue();
        this.queue.stopOnError = false;

        this.queue.addEventListener('progress', this.onProgress);
        this.queue.addEventListener('complete', this.onComplete);
        this.queue.addEventListener('fileload', this.onFileLoad);
        //fthis.queue.addEventListener('error',    this.onFileError);
    }

    Preloader.prototype = {
        loadRate : 0,
        isLoad : false,

        /*
         * ===================================================================
         * PUBLIC METHODS
         * ====================================================================
         */
        loadManifest : function(manifest) {
            var i     = manifest.length,
                idRE  = /^.*\/(.*)\.[a-z0-9]{3,4}$/i,
                url   = null,
                id    = null;

            while(i--) {
                url = manifest[i].url;
                id = manifest[i].id;

                manifest[i] = {
                    src : url,
                    id  : id
                };
            };

            this.queue.loadManifest(this.manifest = manifest);
        },

        get : function(urlOrId) {
            return this.queue.getResult(urlOrId);
        },

        getProgress : function(){
          //this.queue.progress;
            return this.loadRate;
        },

        /*
         * ===================================================================
         * EVENTS
         * ===================================================================
         */
        onProgress : function(e) {
            this.loadRate = e.loaded;
        },

        onFileLoad : function(e) {

            if(!modernizr.isMobile){
                if(e.type == "fileload"){

                    var div = document.getElementById("work-" + e.item.id);

                    var $div = $(div);
                    $div.find(".work-image").append(e.result);

                    var imgDom = $div.find("img")[0];

                    TweenLite.fromTo(imgDom,.6, {opacity: 0}, {opacity: 1});
                }
            }
        },

        onFileProgress : function(e) {

        },

        onFileError : function(e) {

        },

        onComplete : function(e) {
            if(modernizr.isMobile) Events.trigger(Events.LOAD_DONE);
            this.isLoad = true;
        }
    }

    _.extend(Preloader.prototype, Backbone.Events);

    var preloader = new Preloader();

    if(modernizr.isDebug) window.preloader = preloader;

    return preloader;
});
