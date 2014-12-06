/**
 * Created by kenji-special on 10/19/14.
 */
define([
    "TweenLite",

    // components
    'components/loaders/loader-letter',
    'components/loaders/loader-particle',

    // models
    'models/window-model'
],function (TweenLite, loaderletter, LoaderParticle, windowModel) {

    var LoaderObject = function(ctx){
        _.bindAll(this, 'onStartCompleteHandler', 'onStartColUpdateHandler', 'onStartColCompleteHandler');

        this.ctx = ctx;
        this.loaderletter = loaderletter;

        this.resize();
    };

    LoaderObject.prototype = {
        lineCol : "rgb(100, 100, 100)",
        isFull : false,
        loaderParticleArr : [],
        isStartAnimation : true,
        startRate : 0,
        colRate : 1,
        biv: null,

        start: function () {
            this.isStartAnimation = true;
            //TweenLite.to(this,.3, {biv: 10, ease:"Elastic.easeOut" })
            //this.biv = 4;
            TweenLite.to(this,.3, {
                startRate : 1,
                onComplete : this.onStartCompleteHandler,
                ease:"Power3.easeOut",
            });

            TweenLite.to(this,.4, {
                colRate : 0,
                onUpdate : this.onStartColUpdateHandler,
                onComplete : this.onStartColCompleteHandler,
                delay : .3
            });

            this.biv = 100;
        },

        onStartColUpdateHandler : function(){
            this.biv = 100 * this.colRate + 4;

            var colNumber = (100 * this.colRate) | 0;
            this.lineCol = "rgb(" + colNumber + ", " + colNumber + ", " + colNumber + ")";

        },

        onStartColCompleteHandler : function(){
            this.lineCol = "rgb(0, 0, 0)";
        },

        onStartCompleteHandler : function(){
            this.isStartAnimation = false;
        },

        drawRect : function(){

            this.ctx.strokeStyle = "rgb(225, 225, 225)";



            if(this.isStartAnimation){

                var rectHeight = this.rectHeight * this.startRate;
                var rectWidth  = this.rectWidth * this.startRate;

                this.ctx.beginPath();
                this.ctx.moveTo(this.rectTopLeftX, this.rectTopLeftY);
                this.ctx.lineTo(this.rectTopLeftX, this.rectTopLeftY + rectHeight);


                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(this.rectTopLeftX, this.rectTopLeftY);
                this.ctx.lineTo(this.rectTopLeftX + rectWidth, this.rectTopLeftY);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(this.rectBotRightX, this.rectBotRightY);
                this.ctx.lineTo(this.rectBotRightX, this.rectBotRightY - rectHeight);

                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(this.rectBotRightX, this.rectBotRightY);
                this.ctx.lineTo(this.rectBotRightX - rectWidth, this.rectBotRightY);

                this.ctx.stroke();

            }else{
                this.ctx.beginPath();
                this.ctx.moveTo( this.rectTopLeftX, this.rectTopLeftY );
                this.ctx.lineTo( this.rectTopRightX, this.rectTopRightY);
                this.ctx.lineTo( this.rectBotRightX, this.rectBotRightY);
                this.ctx.lineTo( this.rectBotLeftX, this.rectBotLeftY);
                this.ctx.lineTo( this.rectTopLeftX, this.rectTopLeftY );
                this.ctx.closePath();
                this.ctx.stroke();
            }


        },


        update: function (rate) {
            var col = "rgb(225, 225, 225)";

            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.fillStyle = 'rgba( 100, 100, 100, 1)';
            this.ctx.fillRect(0, 0, window.innerWidth * windowModel.scaleFactor * windowModel.scaleFactor, window.innerHeight * windowModel.scaleFactor * windowModel.scaleFactor );

            this.drawRect();

            // ==================================

            if(this.isFull){
                this.ctx.fillStyle = col;
                this.ctx.fill();
            }
            //this.ctx.strokeRect( this.halfWidth-240, -60, 480, 120);



                this.ctx.save();
                this.ctx.translate(this.halfWidth, this.topPos + this.rectHeight/2);


            if(!this.isFull) {
                this.ctx.fillStyle = col;
                var width = this.rectWidth * rate;
                var xPos = width - this.rectWidth/2;
                this.ctx.fillRect(-this.rectWidth/2, -this.rectHeight/2, width, this.rectHeight);
            }
            var prevX, prevY;
            var curX, curY;
            var col;

            this.ctx.lineWidth = windowModel.scaleFactor;

            for (var jj = 0; jj < this.loaderletter.letterPtArr.length; jj++) {
                var initX, initY;
                var isLetterComplete = true;


                var biv;

                if(!this.loaderletter.letterCompleteBoolArr[jj]) {
                    this.ctx.beginPath();


                    for (var i = 0; i < this.loaderletter.letterPtArr[jj].length; i += 1) {


                        if (xPos > this.loaderletter.letterPtArr[jj][i].x) {
                            biv = 1;
                            //col = "rgb(33, 33, 33)";
                        } else {
                            biv = this.biv;
                            isLetterComplete = false;
                        }

                        if (i == 0) {
                            prevX = initX = this.loaderletter.letterPtArr[jj][i].x + (Math.random() - .5) * biv;
                            prevY = initY = this.loaderletter.letterPtArr[jj][i].y + (Math.random() - .5) * biv;
                            this.ctx.moveTo(initX, initY);
                        }
                        else {

                            curX = this.loaderletter.letterPtArr[jj][i].x + (Math.random() - .5) * biv;
                           curY = this.loaderletter.letterPtArr[jj][i].y + (Math.random() - .5) * biv;

                            this.ctx.lineTo(curX, curY);

                            prevX = curX;
                            prevY = curY;
                        }

                    }

                    if (xPos > this.loaderletter.letterPtArr[jj][0].x) {
                        biv = 0;
                    } else {
                        biv = this.biv;
                    }

                    this.ctx.lineTo(initX, initY);
                    this.ctx.strokeStyle = this.lineCol;
                    this.ctx.stroke();

                    // ============================

                    if(isLetterComplete){
                        this.loaderletter.letterCompleteBoolArr[jj] = true;

                        // set the particle

                        for (var i = 0; i < this.loaderletter.letterPtArr[jj].length; i += 1) {
                            var nextNum = (i + 1) %this.loaderletter.letterPtArr[jj].length;

                            prevX = this.loaderletter.letterPtArr[jj][i].x + (Math.random() - .5) * biv;
                            prevY = this.loaderletter.letterPtArr[jj][i].y + (Math.random() - .5) * biv;

                            curX = this.loaderletter.letterPtArr[jj][nextNum].x + (Math.random() - .5) * biv;
                            curY = this.loaderletter.letterPtArr[jj][nextNum].y + (Math.random() - .5) * biv;

                            var loaderParticle = new LoaderParticle(this.ctx, prevX, prevY, curX, curY);

                            this.loaderParticleArr.push(loaderParticle);
                        }

                    }

                }
            }

            for(var ii = 0; ii < this.loaderParticleArr.length; ii++){
                this.loaderParticleArr[ii].update();
            }

            this.ctx.restore();
        },

        startFullScreen : function(){

            this.isFull = true;
            //var tl = new TimelineLite();
            TweenLite.to(this, 0.6, {rectTopRightX: window.innerWidth * windowModel.scaleFactor, rectTopRightY: 0, ease:"Power1.easeInOut", delay:.1});
            TweenLite.to(this, 0.6, {rectBotLeftX: 0, rectBotLeftY: window.innerHeight * windowModel.scaleFactor, ease:"Power1.easeOut", delay:.1});
            TweenLite.to(this, 0.6, {rectTopLeftX: 0, rectTopLeftY: 0, delay:.1, ease:"Power4.easeOut"});
            TweenLite.to(this, 0.6, {rectBotRightX: window.innerWidth * windowModel.scaleFactor, rectBotRightY: window.innerHeight * windowModel.scaleFactor, delay:.1, ease:"Power4.easeInOut"});

        },

        resize : function(){

            this.biv = Math.sqrt( window.innerWidth * windowModel.scaleFactor * window.innerWidth * windowModel.scaleFactor + window.innerHeight * windowModel.scaleFactor * window.innerHeight * windowModel.scaleFactor);

            this.halfWidth  = window.innerWidth * windowModel.scaleFactor/2;
            this.halfHeight = window.innerHeight * windowModel.scaleFactor/2;

            this.rectWidth    = 240* windowModel.scaleFactor;
            this.rectHeight   = 60* windowModel.scaleFactor;

            this.topPos = window.innerHeight * windowModel.scaleFactor/2 - this.rectHeight/2;

            this.rectTopLeftX  = this.halfWidth - this.rectWidth/2;
            //this.rectTopLeftY  = this.halfHeight - this.rectHeight/2;
            this.rectTopLeftY  = this.topPos;
            this.rectTopRightX = this.halfWidth + this.rectWidth/2;
            this.rectTopRightY = this.topPos;
            this.rectBotLeftX  = this.halfWidth - this.rectWidth/2;
            this.rectBotLeftY  = this.topPos + this.rectHeight;
            this.rectBotRightX  = this.halfWidth + this.rectWidth/2;
            this.rectBotRightY  = this.topPos + this.rectHeight;

            this.rectTop  = this.halfHeight - 60;

            // ---------------------------
        }
    };

    return LoaderObject;
});
