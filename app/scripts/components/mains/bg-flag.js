/**
 * Created by kenji-special on 10/28/14.
 */
define([
    // model
    'models/window-model',
    'helpers/modernizr'
],function (windowModel, modernizr) {
    var Flag = function(number, theta, rad){
        var length, length2, flagHeight, fontSize;
        if(modernizr.isMobile){

            length = 25;
            length2 = 20;
            flagHeight = 12;
            fontSize = 9;

        }else{

            length = 50;
            length2 = 40;
            flagHeight = 25;
            fontSize = 18;

        }

        this.length  = length *windowModel.scaleFactor;
        this.length2 = length2 *windowModel.scaleFactor;

        this.flagHeight = flagHeight *windowModel.scaleFactor;
        this.fontSize = fontSize *windowModel.scaleFactor;

        this.setup(number, theta, rad);
    };

    Flag.prototype = {
        isDraw     : false,

        strokeCol  : '#a1a1a1',
        //fillCol    : '#ccccccc',
        fillCol    : '#ccc',

        length     : null,
        length2    : null,
        flagHeight : null,

        setup : function(number, theta, rad){

            this.number = number;

            this.curTheta = -theta - Math.PI/2;

            var xPos = rad * Math.cos(this.curTheta);
            var yPos = rad * Math.sin(this.curTheta);

            this.startXPos = this.endXPos = this.flagXPos = xPos;
            this.startYPos = this.endYPos = this.flagYPos = yPos;

            this.targetXPos = (rad + this.length) * Math.cos(this.curTheta);
            this.targetYPos = (rad + this.length) * Math.sin(this.curTheta);

            this.targetX1Pos = (rad + this.flagHeight) * Math.cos(this.curTheta);
            this.targetY1Pos = (rad + this.flagHeight) * Math.sin(this.curTheta);

            // ---------------------------------------------

            this.target1XPos = (rad - 5)  * Math.cos(this.curTheta);
            this.target1YPos = (rad - 5)  * Math.sin(this.curTheta);

            this.flag1XPos = this.length2 * Math.cos(this.curTheta + Math.PI/2);
            this.flag1YPos = this.length2 * Math.sin(this.curTheta + Math.PI/2);



            //this.flagsPos76

        },

        startAnimation : function(){
            this.isDraw = true;

            TweenLite.to( this, .3, {endXPos: this.targetXPos, endYPos: this.targetYPos, flagXPos: this.targetX1Pos, flagYPos: this.targetY1Pos, ease : 'Power2.easeOut' });
        },

        update : function(ctx){
            if(!this.isDraw) return;

            ctx.strokeStyle = this.strokeCol;
            ctx.beginPath();
            ctx.moveTo(this.startXPos, this.startYPos);
            ctx.lineTo(this.endXPos, this.endYPos);
            ctx.stroke();

            ctx.beginPath();

            ctx.fillStyle = this.fillCol;
            ctx.beginPath();
            ctx.moveTo(this.endXPos, this.endYPos);
            ctx.lineTo(this.endXPos + this.flag1XPos, this.endYPos + this.flag1YPos);
            ctx.lineTo(this.flagXPos + this.flag1XPos, this.flagYPos + this.flag1YPos);
            ctx.lineTo( this.flagXPos,  this.flagYPos);
            ctx.lineTo(this.endXPos, this.endYPos);
            ctx.closePath();

            ctx.fill();

            ctx.save();
            ctx.font= this.fontSize + "px Open Sans";
            ctx.fillStyle = "#fff";
            ctx.textAlign="center";
            ctx.textBaseline = 'middle';
            ctx.translate( (this.endXPos + this.flagXPos + this.flag1XPos)/2, (this.endYPos + this.flagYPos + this.flag1YPos)/2);
            ctx.rotate(this.curTheta + Math.PI/2);
            ctx.fillText(this.number, 0, 0);
            ctx.restore();

        }
    };

    return Flag;
});
