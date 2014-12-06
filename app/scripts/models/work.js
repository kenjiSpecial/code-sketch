/*global define*/

define([
    'underscore',
    'backbone',

    // helpers
    'helpers/transform',
    'helpers/transform-scale',
    'helpers/global',
    'helpers/constants'

], function (_, Backbone, transform, transformScale, global, CONSTANTS) {
    'use strict';
    var perspective = 500;
    var cameraFocus = 400;

    var WorkModel = Backbone.Model.extend({
        isAlive: false,
        prevAlive: false,
        scale : 0,

        initialize: function () {
            _.bindAll(this,
                      'onNotSelectWorkUpdateHandler', 'onNotSelectWorkCompleteHandler',
                      'onSelectWorkUpdateHandler', 'onSelectWorkCompleteHandler',
                      'onUpdateAnimationHandler',
                      'onSetTimerCounter', 'onCompleteRotationHandler');
        },

        defaults: {
            div: null,
            xPos: null,
            yPos: null,
            zPos: null
        },

        $div : null,

        validate: function (attrs, options) {
        },

        parse: function (response, options) {
            return response;
        },

        calcScale : function(){
            var zPos = this.get("zPos");
            this.scale = this.originScale = perspective/ (perspective - zPos);
        },

        update: function (cameraPos) {
            this.cameraPos = cameraPos;
            var div = this.get("div");

            var xPos = this.get("xPos");
            var yPos = this.get("yPos");
            var zPos = 0;

            this.prevAlive = this.isAlive;

            var curDivXPos = window.innerWidth / 2 + (xPos - cameraPos) * this.scale;

            if (curDivXPos > -CONSTANTS.IMAGE.halfWidth && curDivXPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                this.isAlive = true;

                transform(div, curDivXPos, yPos, zPos, perspective, this.scale);
            } else {
                this.candidateCheckHandler(div,xPos, yPos, zPos, cameraPos);
            }

            if(!this.prevAlive && this.isAlive) {
                    div.style.display = "block";
            }
            if(this.prevAlive  && !this.isAlive) {
                div.style.display = "none";
            }


        },

        candidateCheckHandler: function (div,  xPos, yPos, zPos, cameraPos) {

            var candidate1XPos = window.innerWidth / 2 + (xPos - cameraPos - global.worksTotalWidth) * this.scale;
            var candidate2XPos = window.innerWidth / 2 + (xPos - cameraPos + global.worksTotalWidth) * this.scale;

            if (candidate1XPos > -CONSTANTS.IMAGE.halfWidth && candidate1XPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                this.isAlive = true;
                transform(div, candidate1XPos, yPos, zPos, perspective, this.scale);
            } else if (candidate2XPos > -CONSTANTS.IMAGE.halfWidth && candidate2XPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                this.isAlive = true;

                transform(div, candidate2XPos, yPos, zPos, perspective, this.scale);
            } else {
                this.isAliveHandler(div);
            }
        },

        isAliveHandler: function (div) {
            if (this.isAlive) {
                transform(div, CONSTANTS.WORK_POSITION.x, CONSTANTS.WORK_POSITION.y, CONSTANTS.WORK_POSITION.z, perspective, this.scale);
                this.isAlive = false;
            }
        },

        // ----------------------------
        //         start method
        // ----------------------------

        setStartPosition : function(){
            var cameraX = 0;

            var div = this.get("div");

            var xPos = this.get("xPos");
            var yPos = this.get("yPos");
            var zPos = 0;

            var curDivXPos = window.innerWidth / 2 + xPos * this.scale;
            var outsidePosition = window.innerWidth + CONSTANTS.IMAGE.halfWidth;


            if (curDivXPos > -CONSTANTS.IMAGE.halfWidth && curDivXPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                this.targetXPos = curDivXPos;
                this.isAlive = true;

                this.initXPos = outsidePosition;
                div.style.display = "block";
                transform(div, this.initXPos, yPos, zPos, perspective, this.scale);
            }else{
                var candidateXPos = window.innerWidth / 2 + (xPos  - global.worksTotalWidth) * this.scale;

                if (candidateXPos > -CONSTANTS.IMAGE.halfWidth && candidateXPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                    div.style.display = "block";
                    this.isAlive = true;

                    this.targetXPos = candidateXPos;
                    this.initXPos = outsidePosition;
                    transform(div, this.initXPos, yPos, zPos, perspective, this.scale);
                }

            }
        },

        onUpdateStartPositionHandler : function(rate){

            if(this.isAlive){
                var div = this.get("div");
                var yPos = this.get("yPos");
                var zPos = 0;
                var xPos = (1 - rate) * this.initXPos + rate * this.targetXPos;

                transform( div, xPos,yPos, zPos, perspective, this.scale);
            }

        },

        // ==================
        //   select method
        // ==================
        animationScaleRate : 1,

        onNotSelectWorkHandler : function(rate){
            if(this.isAlive){
                TweenLite.to(this,.6, { animationScaleRate: 0, onUpdate: this.onNotSelectWorkUpdateHandler, onComplete: this.onNotSelectWorkCompleteHandler, ease : 'Power2.easeOut'});
            }
        },

        onSetTimerCounter : function(){
            var div = this.get("div");

            if(this.timerCounter % 2) div.style.display = 'none';
            else                      div.style.display = 'block';

            this.timerCounter++;
            if(this.timerCounter < 2)
                setTimeout(this.onSetTimerCounter, 100);

        },

        onNotSelectWorkUpdateHandler : function(){

            var div = this.get("div");
            var yPos = this.get("yPos");
            var zPos = 0;
            var xPos = this.get("xPos");

            var curDivXPos = window.innerWidth / 2 + (xPos- this.cameraPos) * this.scale;
            var outsidePosition = window.innerWidth + CONSTANTS.IMAGE.halfWidth;

            div.style.opacity = this.animationScaleRate * this.animationScaleRate;

            if (curDivXPos > -CONSTANTS.IMAGE.halfWidth && curDivXPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                transformScale(div, curDivXPos, yPos, zPos, perspective, this.scale, this.animationScaleRate);
            } else {
                var candidate1XPos = window.innerWidth / 2 + (xPos - this.cameraPos - global.worksTotalWidth) * this.scale;
                var candidate2XPos = window.innerWidth / 2 + (xPos - this.cameraPos + global.worksTotalWidth) * this.scale;

                if (candidate1XPos > -CONSTANTS.IMAGE.halfWidth && candidate1XPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                    transformScale(div, candidate1XPos, yPos, zPos, perspective, this.scale, this.animationScaleRate);
                } else if (candidate2XPos > -CONSTANTS.IMAGE.halfWidth && candidate2XPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                    transformScale(div, candidate2XPos, yPos, zPos, perspective, this.scale, this.animationScaleRate);
                }
            }
        },

        onNotSelectWorkCompleteHandler : function(){

        },

        // -------------------------

        onSelectWorkHandler : function(){

            var className = "on-selected";
            var div = this.get("div");
            var xPos = this.get("xPos");

            this.isSelected = true;

            if(!this.$div) this.$div = $(div);
            this.$div.addClass(className);

            this.animationScaleRate = 0;

            var curDivXPos = window.innerWidth / 2 + (xPos- this.cameraPos) * this.scale;

            if (curDivXPos > -CONSTANTS.IMAGE.halfWidth && curDivXPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                this.startXPos = curDivXPos;
            } else {
                var candidate1XPos = window.innerWidth / 2 + (xPos - this.cameraPos - global.worksTotalWidth) * this.scale;
                var candidate2XPos = window.innerWidth / 2 + (xPos - this.cameraPos + global.worksTotalWidth) * this.scale;

                if (candidate1XPos > -CONSTANTS.IMAGE.halfWidth && candidate1XPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                    this.startXPos = candidate1XPos;
                } else if (candidate2XPos > -CONSTANTS.IMAGE.halfWidth && candidate2XPos < window.innerWidth + CONSTANTS.IMAGE.halfWidth) {
                    this.startXPos = candidate2XPos;
                }
            }

            this.startScale = this.scale;

            TweenLite.to(this,.6, { animationScaleRate: 1, onUpdate: this.onSelectWorkUpdateHandler, onComplete: this.onSelectWorkCompleteHandler, ease : 'Power2.easeInOut'});

        },

        onSelectWorkUpdateHandler : function(){

            var div = this.get("div");

            var xPos = this.get("xPos");
            var yPos = this.get("yPos");
            var zPos = 0;


            // var curDivXPos = window.innerWidth / 2 + (xPos- this.cameraPos) * this.scale;

            var targetXPos  = this.animationScaleRate * window.innerWidth/2 + (1 - this.animationScaleRate) * this.startXPos;
            var targetScale = this.animationScaleRate  + (1 - this.animationScaleRate)  * this.startScale;

            transformScale(div, targetXPos, yPos, zPos, perspective, targetScale, 1);
            //Tw

        },

        onSelectWorkCompleteHandler : function(){
            var div = this.get("div");

            TweenLite.to(div.querySelectorAll('.work-inside-container')[0], .8, { rotationY: 180, ease:"Back.easeOut" , delay:.4, onComplete: this.onCompleteRotationHandler });
        },

        onCompleteRotationHandler : function(){
            var div = this.get("div");
            this.animationRate = 0;

            TweenLite.to( this,.6, { animationRate: 1,  ease : 'Power2.easeInOut', delay: 2, onUpdate: this.onUpdateAnimationHandler});

        },

        onUpdateAnimationHandler : function(){
            var div = this.get("div");

            var xPos = this.get("xPos");
            var yPos = this.get("yPos");
            var zPos = 0;

            var targetXPos = this.animationRate * -400 + (1 - this.animationRate) * window.innerWidth/2;

            transformScale(div, targetXPos, yPos, zPos, perspective, 1, 1);
        },

        restart : function(){
            if(this.isAlive) {
                var div = this.get("div");

                this.scale = this.originScale;
                div.style.opacity = 0;
                if (this.isSelected) {
                    this.isSelected = false;
                    var className = "on-selected";
                    if (!this.$div) this.$div = $(div);
                    this.$div.removeClass(className);

                    TweenLite.to(div.querySelectorAll('.work-inside-container')[0], .8, {
                        rotationY: 0,
                        ease: "Back.easeOut",
                        delay: 2
                    });
                    TweenLite.to(div,.6, {opacity: 1, ease: 'Power2.easeInOut', delay: .4});
                } else {
                    var duration = Math.random()*1.2 + .3;
                    var delay = .6 + 1.4 * Math.random();
                    TweenLite.to(div, duration, {opacity: 1, ease: 'Power2.easeInOut', delay: delay});
                }
            }
        }

    });

    return WorkModel;
});
