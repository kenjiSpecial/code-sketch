/*global define*/

define([
    'underscore',
    'backbone',

    // helpers
    'helpers/global',
    'helpers/modernizr',
    'helpers/events'
], function (_, Backbone, global, modernizr, events) {
    'use strict';

    var WorkCameraModel = Backbone.Model.extend({
        vel : 0,
        velDes : 1,
        mouseDownVel: 1,
        focus : 500,
        isMouseDown : false,

        initialize: function() {
            _.bindAll(this, 'onMouseDownHandler', 'onMouseMoveHandler', 'onMouseUpHandler');

            events.on(events.MOUSE_DOWN, this.onMouseDownHandler);
            events.on(events.MOUSE_MOVE, this.onMouseMoveHandler);
            events.on(events.MOUSE_UP,   this.onMouseUpHandler);
        },

        defaults: {
            position : 0,
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        update : function(){

            var workPosition = this.get('position');

            if(this.isMouseDown) {
                this.mouseDownVel *= .9;

                workPosition += this.mouseDownVel;
            }else{
                this.vel += (this.velDes - this.vel) * .03;
                workPosition += this.vel;
            }
            if(workPosition > global.worksTotalWidth)   workPosition -= global.worksTotalWidth;
            if(workPosition < 0)                        workPosition += global.worksTotalWidth;
            this.set("position", workPosition);
        },


        getPosition : function(){
            return this.get("position")
        },

        getRate : function(){
            var rate = this.get('position') / global.worksTotalWidth;
            if(rate < 0) rate = 0;
            if(rate > 1) rate = 1;

            return rate;
        },

        // mouseEvent;

        onMouseDownHandler : function(){
            this.mouseDownVel = this.vel;
            this.isMouseDown = true;
        },

        onMouseMoveHandler : function(vel){
            if(vel){
                this.mouseDownVel = vel * -1;
            }
        },

        onMouseUpHandler : function(vel){

            this.isMouseDown = false;

            if(vel)
                this.vel = vel * -1;
            else
                this.vel = 0;



            if(this.vel >= 0) this.velDes = 1;
            else              this.velDes = -1;

        },

        reset : function(){
            this.set("position", 0);
        }
    });

    var workCameraModel = new WorkCameraModel();

    if(modernizr.isDebug) window.workCameraModel = workCameraModel;

    return workCameraModel;
});
