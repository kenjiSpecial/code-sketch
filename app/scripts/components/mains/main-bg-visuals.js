/**
 * Created by kenji-special on 10/26/14.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'TweenLite',

    // models
    'models/work-camera-model',
    'models/window-model',

    // components
    'components/mains/bg-flag',

    // helpers
    'helpers/modernizr',
    'helpers/global'
],function ( $, _, Backbone, TweenLite, workCameraModel, windowModel, Flag, modernizr, global ) {

    var MainBgVisual = function(){
        _.bindAll(this, 'startMarkerAnimation');

        this.canvas = document.getElementById("ks-bg-canvas");
        this.ctx = this.canvas.getContext("2d");

        var outRad, innerRad;
        if(modernizr.isMobile){
            outRad = 100;
            innerRad = 95;
            this.markerSide = 7;
        }else{
            outRad = 200;
            innerRad = 195;
            this.markerSide = 15;
        }



        this.outlineRad = outRad * windowModel.scaleFactor;
        this.insideRad = innerRad * windowModel.scaleFactor;

        this.extraMarker.yPos = -(window.innerHeight/2 ) * windowModel.scaleFactor;

        this.resize();

    };

    MainBgVisual.prototype = {
        outlineCol : "#cccccc",
        markerCol : '#3d9ae8',

        outlineRad : null,
        insideRad : null,

        animationCircle : {
            start : - 3/2*Math.PI ,
            end   : - 3/2*Math.PI
        },

        extraMarker : {
            yPos : null
        },

        rectTopLeftX  : 0,
        rectTopLeftY  : window.innerHeight,
        rectTopRightX : window.innerWidth,
        rectTopRightY : window.innerHeight,

        rect2TopRightX : 0,
        rect2BotRightX : 0,

        flags : [],

        start : function(worksNumber){
            var self = this;
            this.worksNumber = worksNumber;

            for(var i = 0;i < this.worksNumber; i+= 10){
                var theta = Math.PI * i / worksNumber * 2;
                var flag = new Flag( i, theta, this.outlineRad );


                this.flags.push(flag);

            }

            TweenLite.to( this.extraMarker, 1, { yPos : 0, ease: Power2.easeOut, ease : 'Bounce.easeOut', delay:.6});
            TweenLite.to( this.animationCircle, 1, { start : -Math.PI/2, end : 3/2 * Math.PI, ease : 'Power2.easeOut', delay: 0});//, onComplete: circleAnimationDone });

            this.isAnimation = true;

            _.delay(this.startMarkerAnimation, 500);
            _.delay(function(){ self.isAnimation = false; }, 1500);

        },

        startMarkerAnimation : function(){

            for(var i = 0; i < this.flags.length; i++){
                this.flags[i].startAnimation();
            }

        },

        restart : function(){
            var topPos = windowModel.scaleFactor * window.innerHeight;
            TweenLite.to( this,.6, { rectTopLeftY  : topPos, ease : "Power4.easeOut", delay:.3});
            TweenLite.to( this,.6, { rectTopRightY : topPos, ease : "Power1.easeOut", delay:.3});

            //rect2TopRightX rect2BotRightX
            TweenLite.to( this,.6, { rect2TopRightX  : 0, ease : "Power1.easeOut"});
            TweenLite.to( this,.6, { rect2BotRightX : 0,  ease : "Power4.easeOut"});

        },

        update : function(){

            var halfWindowWid = window.innerWidth * windowModel.scaleFactor/2;
            var halfWindowHig = window.innerHeight * windowModel.scaleFactor/2;
            //
            this.ctx.clearRect( 0, 0, window.innerWidth * windowModel.scaleFactor, window.innerHeight * windowModel.scaleFactor);

            this.ctx.save();
            this.ctx.translate(halfWindowWid, halfWindowHig);

            this.ctx.beginPath();
            this.ctx.strokeStyle = this.outlineCol;
            this.ctx.arc(0, 0, this.outlineRad, this.animationCircle.start, this.animationCircle.end);
            this.ctx.stroke();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.fillStyle = this.outlineCol;
            this.ctx.arc(0, 0, this.insideRad, this.animationCircle.start, this.animationCircle.end);
            this.ctx.fill();
            this.ctx.closePath();

            for(var i = 0; i < this.flags.length; i++){
                this.flags[i].update(this.ctx);
            }

            this.drawMarker();

            this.ctx.restore()

            // -----------------------

            this.ctx.fillStyle = '#aaaaaa';

            this.ctx.beginPath();
            this.ctx.moveTo( this.rectTopLeftX, this.rectTopLeftY);
            this.ctx.lineTo( this.rectTopRightX, this.rectTopRightY);
            this.ctx.lineTo( window.innerWidth * windowModel.scaleFactor, window.innerHeight * windowModel.scaleFactor);
            this.ctx.lineTo( 0, window.innerHeight * windowModel.scaleFactor);
            this.ctx.closePath();

            this.ctx.fill();

            // ----------------------

            this.ctx.fillStyle = '#cccccc';

            this.ctx.beginPath();
            this.ctx.moveTo( 0, 0);
            this.ctx.lineTo( this.rect2TopRightX, 0);
            this.ctx.lineTo( this.rect2BotRightX, window.innerHeight * windowModel.scaleFactor);
            this.ctx.lineTo( 0, window.innerHeight * windowModel.scaleFactor);
            this.ctx.closePath();

            this.ctx.fill();

        },

        startRectAnimation : function(){
            TweenLite.to( this,.6, { rectTopLeftY  : 0, ease : "Power4.easeOut"});
            TweenLite.to( this,.6, { rectTopRightY : 0, ease : "Power1.easeOut"});

            //rect2TopRightX rect2BotRightX
            var leftPos = window.innerWidth * windowModel.scaleFactor;
            TweenLite.to( this,.6, { rect2TopRightX  : leftPos, ease : "Power1.easeOut", delay:.3});
            TweenLite.to( this,.6, { rect2BotRightX : leftPos,  ease : "Power4.easeOut", delay:.3});

        },

        drawMarker : function(){
            this.ctx.save();
            //console.log(this.extraMarker.yPos);
            this.ctx.translate(0, this.extraMarker.yPos);

            var rate = workCameraModel.getRate();

            var theta = Math.PI * 2 * rate - Math.PI/2;

            var side = this.markerSide * windowModel.scaleFactor;

            var theta1 = theta - Math.PI/6;
            var theta2 = theta + Math.PI/6;

            var pt1X = Math.cos(theta) * this.outlineRad;
            var pt1Y = Math.sin(theta) * this.outlineRad;

            var dx1 = side * Math.cos(theta1);
            var dy1 = side * Math.sin(theta1);

            var dx2 = side * Math.cos(theta2);
            var dy2 = side * Math.sin(theta2);

            // marker
            this.ctx.beginPath();
            this.ctx.moveTo(pt1X, pt1Y);
            this.ctx.lineTo(pt1X + dx1, pt1Y + dy1);
            this.ctx.lineTo(pt1X + dx2, pt1Y + dy2);
            this.ctx.lineTo(pt1X, pt1Y);
            this.ctx.closePath();
            this.ctx.fillStyle = this.markerCol;
            this.ctx.fill();

            this.ctx.restore();
        },

        resize : function(){

            this.canvas.width = window.innerWidth * windowModel.scaleFactor;
            this.canvas.height = window.innerHeight * windowModel.scaleFactor;

            this.leftTopX = window.innerWidth/2 - 1.5 * this.outlineRad;
            this.leftTopY = window.innerHeight/2 - 1.5 * this.outlineRad;

            this.rectTopLeftY  = window.innerHeight * windowModel.scaleFactor;
            this.rectTopRightX = window.innerWidth  * windowModel.scaleFactor;
            this.rectTopRightY = window.innerHeight * windowModel.scaleFactor;

        }
    };

    return MainBgVisual;
});
