/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var HeaderView = Backbone.View.extend({
        template: JST['app/scripts/templates/header-view.ejs'],

        el : "#ks-title",

        events: {},

        initialize: function () {
            _.bindAll(this, "onCompleteHideHandler");
        },

        show : function(){
            this.el.style.display = "block";
            this.el.style.opacity = 0;

            TweenLite.to(this.el,.6, {opacity:1, ease: 'Power2.easeInOut'});
        },

        hide : function(){
            this.el.style.opacity = 1;

            TweenLite.to(this.el,.6, {opacity:0, ease: 'Power2.easeInOut', onComplete: this.onCompleteHidehandler });
        },

        onCompleteHideHandler : function(){
            this.el.style.display = "none";
        },

        render: function () {
        }
    });

    return HeaderView;
});
