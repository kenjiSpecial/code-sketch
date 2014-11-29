/**
 * Created by kenji-special on 10/20/14.
 */
define([

],function () {
    var LoaderParticle = function( ctx, x1, y1, x2, y2){
        this.ctx = ctx;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        var dx = x1 - x2;
        var dy = y1 - y2;
        this.size = Math.sqrt(dx * dx + dy * dy);

        var mag = Math.random() * 12 + 8;
        var theta = Math.random() * 2 * Math.PI;

        this.velX = mag * Math.cos(theta);
        this.velY = mag * Math.sin(theta);

        this.vel1X = this.velX + Math.random() * 2 - 1;
        this.vel1Y = this.velY + Math.random() * 2 - 1;

        this.vel2X = this.velX + Math.random() * 2 - 1;
        this.vel2Y = this.velY + Math.random() * 2 - 1;


        var self = this;
        this.isStay = true;
        _.delay(function(){self.isStay = false;}, 300);
        _.delay(function(){self.isDraw = false;}, 900);
    };

    LoaderParticle.prototype = {
        isDraw : true,
        col : "#fff",
        isStay : true,
        k :.95,

        update : function(){
            if(!this.isDraw) return;
            // -----------
            //   update
            // -----------

            var alpha = 1;
            if(!this.isStay){

                var dx = (this.x1 - this.x2);
                var dy = (this.y1 - this.y2);

                var curSize = Math.sqrt(dx  * dx + dy * dy);

                alpha = curSize / this.size;
                if(alpha > 1) alpha = 1;
                if(alpha < .1) this.isDraw = false;
                this.velX *= this.k;
                this.velY *= this.k;

                var velX = (this.x1 - this.x2) * .03;
                var velY = (this.y1 - this.y2) * .03;

                this.x1 += -velX + this.velX;
                this.x2 += velX + this.velX;

                this.y1 += -velY + this.velY;
                this.y2 += velY + this.velY;

            }

            // -----------
            //   drawing
            // -----------


            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
            //this.ctx.strokeStyle = "#fff";
            this.ctx.moveTo( this.x1 + Math.random(), this.y1 + Math.random());
            this.ctx.lineTo( this.x2 + Math.random(), this.y2 + Math.random());
            this.ctx.stroke();
            this.ctx.closePath();
        }
    };

    return LoaderParticle;
});