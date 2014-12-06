/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {
    'use strict';

    var PenView = Backbone.View.extend({

        events: {
            "click #close-button-container" : "onCloseHandler"
        },

        el : "#ks-code-pen",
        isShow : null,

    /**
     *  DOM
     */
        $container : null,
        $button    : null,

        router : null,

        initialize: function (router) {
            _.bindAll(this, "showButtonHandler", "onCompleteCloseAnimationHandler", "onCompleteTweenHandler", "hideMainDiv");

            this.$container = this.$el.find("#ks-code-pen-container");
            this.$button    = this.$el.find("#close-button-container");

            this.isShow = false;
            this.router = router;

            this.mainDiv = document.getElementById("ks-main");
        },

        render: function () {
            //this.$container.html(this.template);
        },

        show : function(id){
            this.isShow = true;
            this.el.style.display = "block";
            this.el.style.opacity = 0;

            var iframe = document.createElement("iframe");
            iframe.src = "http://codepen.io/kenjiSpecial/full/" + id + "/";
            this.$container.html(iframe);

            TweenLite.to( this.el,.8, {opacity: 1, delay: 1, onComplete: this.onCompleteTweenHandler});

            _.delay(this.showButtonHandler, 2000);
            _.delay(this.hideMainDiv, 3500);
        },

        onCompleteTweenHandler : function(){
            //
        },

        hideMainDiv : function(){
          if(this.isShow) this.mainDiv.style.display = "none";
        },

        showButtonHandler : function(){
            if(this.isShow) {
                this.$button.addClass("active");
            }
        },


        onCloseHandler : function(){
            if(this.isShow){
                this.mainDiv.style.display = "block";
                this.isShow = false;
                this.$button.removeClass("active");
                TweenLite.to( this.el,.8, {opacity: 0, onComplete: this.onCompleteCloseAnimationHandler });
            }
        },

        onCompleteCloseAnimationHandler : function(){
            this.el.style.display = "none";
            this.$container.html("");

            this.router.navigate("",{trigger: true});
        },

        hide : function(){

          this.onCloseHandler();
            //
        }


    });

    return PenView;
});
