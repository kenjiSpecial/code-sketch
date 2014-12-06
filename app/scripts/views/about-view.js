/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',

    // models
    'models/window-model',

    // helpers
    'helpers/events',


], function ( $, _, Backbone, windowModel, events ) {
    'use strict';

    var AboutViewView = Backbone.View.extend({

        el : '#ks-about',
        titleDom : null,
        $title : null,
        $root  : null,

        isShow : false,

        canvas : document.getElementById("ks-about-canvas"),
        ctx    : null,

        events: {
            'click #ks-about-close-button-container' : 'onClickCloseButtonHandler'
        },

        aboutTitleDom : null,
        jpTextDom : null,
        enTextDom : null,
        authorDom : null,
        snsDom    : null,

        initialize: function () {
            _.bindAll(this, "update", "delayShowCloseButton", "onHideCompleteHandler", "onWindowResizeHandler");

            this.canvas.width  = window.innerWidth * windowModel.scaleFactor;
            this.canvas.height = window.innerHeight * windowModel.scaleFactor;

            this.ctx = this.canvas.getContext("2d");

            this.$title = $("#ks-title");
            this.$root = $("#ks-root");

            this.closeButtonContainer = document.getElementById("ks-about-close-button-container");
            this.$closeButtonContainer = $(this.closeButtonContainer);

            this.aboutTitleDom = this.$el.find(".ks-about-title");
            this.jpTextDom = this.$el.find('.jp');
            this.enTextDom = this.$el.find('.en');
            this.authorDom = this.$el.find('.ks-author');
            this.snsDom    = this.$el.find('.ks-sns');

            events.on(events.WINDOW_RESIZE, this.onWindowResizeHandler);
        },

        show : function(){
            this.isShow = true;
            this.el.style.display = "block";
            this.startRectAnimation();

            this.$title.addClass("about");

            events.on(events.TICK, this.update);

            var init = .8;
            var kankaku = 0.05;
            TweenLite.fromTo(this.aboutTitleDom,.4 ,{opacity: 0, y: +40}, {opacity: 1, y: 0, ease : "Power1.easeOut", delay:init});
            TweenLite.fromTo(this.jpTextDom,.4 ,{opacity: 0, y: +40}, {opacity: 1, y: 0, ease : "Power1.easeOut", delay:init+ kankaku});
            TweenLite.fromTo(this.enTextDom,.4 ,{opacity: 0, y: +40}, {opacity: 1, y: 0, ease : "Power1.easeOut", delay:init + kankaku*2});
            TweenLite.fromTo(this.authorDom,.4 ,{opacity: 0, y: +40}, {opacity: 1, y: 0, ease : "Power1.easeOut", delay:init + kankaku * 3});
            TweenLite.fromTo(this.snsDom,.4 ,{opacity: 0, y: +40}, {opacity: 1, y: 0, ease : "Power1.easeOut", delay:init + kankaku * 4});

            this.$root.removeClass("active");


            _.delay(this.delayShowCloseButton, 1200);
        },

        delayShowCloseButton : function(){
            if(this.isShow) this.$closeButtonContainer.addClass("active");
        },

        startRectAnimation : function(){
            this.rectTopLeftY  = this.canvas.height;
            this.rectTopRightX = this.canvas.width;
            this.rectTopLeftX = 0;
            this.rectTopRightY = this.canvas.height;

            this.rect2TopRightX = 0;
            this.rect2BotRightX = 0;


            TweenLite.to( this,.6, { rectTopLeftY  : 0, ease : "Power4.easeOut"});
            TweenLite.to( this,.6, { rectTopRightY : 0, ease : "Power1.easeOut"});

            //rect2TopRightX rect2BotRightX
            var leftPos = window.innerWidth * windowModel.scaleFactor;
            TweenLite.to( this,.6, { rect2TopRightX  : leftPos, ease : "Power1.easeOut", delay:.3});
            TweenLite.to( this,.6, { rect2BotRightX : leftPos,  ease : "Power4.easeOut", delay:.3});

        },

        hide : function(){
            this.isShow = false;

            this.$closeButtonContainer.removeClass("active");
            this.$title.removeClass("about");

            var init = 0;
            var kankaku = 0.05;
            TweenLite.to(this.aboutTitleDom,.4, {opacity: 0, y: +40, ease : "Power1.easeOut", delay:init + kankaku*4 });
            TweenLite.to(this.jpTextDom,.4 , {opacity: 0, y: +40, ease : "Power1.easeOut", delay:init+ kankaku*3});
            TweenLite.to(this.enTextDom,.4 , {opacity: 0, y: +40, ease : "Power1.easeOut", delay:init + kankaku*2});
            TweenLite.to(this.authorDom,.4 , {opacity: 0, y: +40, ease : "Power1.easeOut", delay:init + kankaku });
            TweenLite.to(this.snsDom,.4 ,{opacity: 0, y: +40, ease : "Power1.easeOut", delay:init });

            TweenLite.to( this,.6, { rectTopLeftY  : this.canvas.height, ease : "Power4.easeOut", delay:1});
            TweenLite.to( this,.6, { rectTopRightY : this.canvas.height, ease : "Power1.easeOut", delay:1});

            //rect2TopRightX rect2BotRightX
            var leftPos = window.innerWidth * windowModel.scaleFactor;
            TweenLite.to( this,.6, { rect2TopRightX  : 0, ease : "Power1.easeOut", delay:.7});
            TweenLite.to( this,.6, { rect2BotRightX : 0,  ease : "Power4.easeOut", delay:.7});

            this.$root.addClass("active");

            _.delay(this.onHideCompleteHandler, 1800);

        },

        onHideCompleteHandler : function(){
            this.el.style.display = "none";
            events.off(events.TICK, this.update);
        },

        update : function(dt){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // -----------------------

            this.ctx.fillStyle = 'rgba(0, 0, 0, .3)';

            this.ctx.beginPath();
            this.ctx.moveTo( this.rectTopLeftX, this.rectTopLeftY);
            this.ctx.lineTo( window.innerWidth * windowModel.scaleFactor, this.rectTopRightY);
            this.ctx.lineTo( window.innerWidth * windowModel.scaleFactor, window.innerHeight * windowModel.scaleFactor);
            this.ctx.lineTo( 0, window.innerHeight * windowModel.scaleFactor);
            this.ctx.closePath();

            this.ctx.fill();

            // ----------------------

            this.ctx.fillStyle = 'rgba(0, 0, 0, .3)';

            this.ctx.beginPath();
            this.ctx.moveTo( 0, 0);
            this.ctx.lineTo( this.rect2TopRightX, 0);
            this.ctx.lineTo( this.rect2BotRightX, this.canvas.height);
            this.ctx.lineTo( 0, this.canvas.height);
            this.ctx.closePath();

            this.ctx.fill();

        },

        onClickCloseButtonHandler : function(){

            this.hide();

            events.trigger(events.RESUME_ANIMATION);
        },

        onWindowResizeHandler : function(){
            this.canvas.width  = window.innerWidth * windowModel.scaleFactor;
            this.canvas.height = window.innerHeight * windowModel.scaleFactor;

            if(this.isShow){
                this.rect2TopRightX = window.innerWidth * windowModel.scaleFactor;
                this.rect2BotRightX = window.innerWidth * windowModel.scaleFactor;
            }else{
                this.rectTopLeftY = this.rectTopRightY = window.innerHeight * windowModel.scaleFactor;
            }

        }

    });

    return AboutViewView;
});
