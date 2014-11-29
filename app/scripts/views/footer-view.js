/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',

    // views
    'views/about-view',

    // helper
    'helpers/events'

], function ($, _, Backbone, AboutView, events) {
    'use strict';

    var FooterViewView = Backbone.View.extend({
        el : "#ks-footer",
        aboutView : null,

        events: {
            "click #ks-footer-container" : "onClickFooterHandler"
        },

        initialize: function () {
            _.bindAll(this, "onCompleteHideHandler");

            this.aboutView = new AboutView();
        },

        show : function(){
            this.el.style.display = "block";
            this.el.style.opacity = 0;

            TweenLite.to(this.el,.6, {opacity:1, ease: 'Power2.easeInOut'});
        },

        hide : function(){
            this.el.style.opacity = 1;

            if(this.aboutView.isShow) this.aboutView.hide();

            TweenLite.to(this.el,.6, {opacity:0, ease: 'Power2.easeInOut', onComplete: this.onCompleteHidehandler });
        },

        onCompleteHideHandler : function(){
            this.el.style.display = "none";
        },

        onClickFooterHandler : function(){
            events.trigger(events.STOP_ANIMATION);

            this.aboutView.show();

        }

    });

    return FooterViewView;
});
