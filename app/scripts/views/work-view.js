/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

    // data
    'data/data',

    // model
    'models/scroll-model',
    'models/work-camera-model',
    'models/work',

    // collections
    'collections/work-model-collection',
    'collections/work',

    // components
    'components/mains/main-bg-visuals',
    'components/subs/finger',

    // helpers
    'helpers/events',
    'helpers/loader',
    'helpers/transform',
    'helpers/modernizr',
    'helpers/global',
    'helpers/constants',
    'helpers/window-action',

    'backboneTouch'

], function ($, _, Backbone, JST, data, scrollModel, workCameraModel, WorkModel, workModelCollection, WorkCollection, MainBgVisual, Finger, events, loader, transform, modernizr, global, CONSTANTS, windowAction ) {
    'use strict';

    var WorkView = Backbone.View.extend({
        template: JST['app/scripts/templates/work-view.ejs'],

        el : "#ks-main",
        $root : null,

        className: '',

        finger : null,

        isRender     : false,
        isWorkUpdate : false,
        isWorkStop   : false,
        isShow       : false,

        perspective : 500,

        workModelCollection : null,
        scrollModel : scrollModel,

        events: {
            "click .work-container" : 'onClickWorkHandler'
        },

        codePenDom : document.getElementById("ks-code-pen"),
        router : null,

        initialize: function (router) {
            _.bindAll(this, 'update', 'startAnimationDoneHandler', 'onStopAnimationHandler', 'onResumeAnimationHandler', 'onResizeWindowHandler', 'startLoadingImage');

            this.router = router;
            this.$root = $("#ks-root");

            this.workModelCollection = new WorkCollection();
            this.mainBgVisual = new MainBgVisual();

            this.finger = new Finger();

            events.on(events.DONE_START_ANIMATION, this.startAnimationDoneHandler);
            events.on(events.STOP_ANIMATION, this.onStopAnimationHandler);
            events.on(events.RESUME_ANIMATION, this.onResumeAnimationHandler);
            events.on(events.WINDOW_RESIZE, this.onResizeWindowHandler);
        },

        render : function(){
            var gap;
            if(modernizr.isMobile)  gap = 200;
            else                    gap = 350;

            this.isRender = true;
            var workModelCollectionJSON = workModelCollection.toJSON();

            var template = this.template({ workDataJSON : workModelCollectionJSON, isMobile: modernizr.isMobile});
            this.$el.html(template);



            var self = this;
            var zSortArr = [];

            var totalWorkLength = workModelCollectionJSON.length;

            // set models of work.
            workModelCollectionJSON.forEach(function(element, idNum, val){
                var xPos = gap * idNum;
                var yPos = window.innerHeight * (.5 +.1 * (Math.random() -.5) );
                var zPos = -1000 * Math.random();

                var id     = element.id;
                var imgUrl = element["thumbnail_url"];

                var div = document.getElementById("work-" + id);

                transform(div,  CONSTANTS.WORK_POSITION.x, CONSTANTS.WORK_POSITION.y, CONSTANTS.WORK_POSITION.z, self.perspective);

                if(modernizr.isMobile){
                    console.log(loader)
                    var img    = loader.get(id);
                    var $div = $(div);
                    $div.find(".work-image").append(img);
                }

                var workModel = new WorkModel({id: id, div: div, xPos: xPos, yPos: yPos, zPos: zPos});
                workModel.calcScale();

                var zValue = {number : idNum, "zPos": zPos};
                zSortArr.push(zValue);

                self.workModelCollection.push(workModel);
            });

            zSortArr.sort(function(a, b) {return a.zPos - b.zPos});

            // z-sorting
            for(var i = 0; i < zSortArr.length; i++){
                var number = zSortArr[i].number;
                var div = this.workModelCollection.models[number].get("div");
                div.style.zIndex = (i + 1);
            }


            global.worksTotalWidth = gap * workModelCollection.length;


            if(modernizr.isDebug) window.workModelCollection = this.workModelCollection;

            this.initPosition();



            //this.listenTo()
            if(!modernizr.isMobile) _.delay(this.startLoadingImage, 2000);
        },


        loadManifest : [],

        startLoadingImage : function(){
            var workModelCollectionJson = workModelCollection.toJSON();


            var self = this;
            workModelCollectionJson.forEach(function(data){
                var thumbnailUrl = data.thumbnail_url;
                var thumbnailId  = data.id;
                self.loadManifest.push({url: thumbnailUrl, id: thumbnailId});
            });

            loader.loadManifest(this.loadManifest);
        },

        initPosition : function(){
            //transform(this.el, CONSTANTS.WORK_POSITION.x, CONSTANTS.WORK_POSITION.y, CONSTANTS.WORK_POSITION.z, this.perspective);
        },



        show : function(){
            this.isShow = true;

            this.$root.addClass("active");

            workCameraModel.reset();
            this.mainBgVisual.start(workModelCollection.length);

            events.on(events.TICK, this.update);

            this.finger.show();

            var self = this;
            _.delay(function(){
               self.workModelCollection.startToShow();
            }, 2700);
        },

        reshow : function(){

            this.$root.addClass("active");

            this.isShow = true;
            this.isWorkStop = false;


            this.mainBgVisual.restart();
            this.workModelCollection.restart();

            events.on(events.TICK, this.update);
        },


        startAnimationDoneHandler : function(){
            this.isWorkUpdate = true;

            // enable mouse or touch action
            windowAction.enable();


            //events.on(events.TICK, this.update);

        },

        hide : function(){
            this.isShow = false;

            this.$root.removeClass("active");

            events.off(events.TICK, this.update);
        },

        update : function(){
            this.mainBgVisual.update();


            if(this.isWorkUpdate && !this.isWorkStop) {
                workCameraModel.update();

                var workCameraPosition = workCameraModel.getPosition();
                this.workModelCollection.update(workCameraPosition);
            }

        },

        // ===================
        //   event handler
        // ===================

        onClickWorkHandler : function(event){
            if(this.isWorkStop) return;

            this.isWorkStop = true;
            this.mainBgVisual.startRectAnimation();

            // work disappear

            var workId = event.currentTarget.dataset.id;
            this.workModelCollection.onSelectWork(workId);

            var $targetLoader = $(event.target).find(".work-img-loader");
            $targetLoader.css({display: "none"});

            if(this.router) this.router.navigate( "#pen/" + workId, {trigger: true});
        },

        selectWork : function(id){
            this.isWorkStop = true;
            this.mainBgVisual.startRectAnimation();
            this.workModelCollection.onSelectWork(id);


        },

        onStopAnimationHandler : function(){
            this.isWorkStop = true;
        },

        onResumeAnimationHandler : function(){
            this.isWorkStop = false;
        },

        onResizeWindowHandler : function(){
            this.mainBgVisual.resize();
        }

    });

    return WorkView;
});
