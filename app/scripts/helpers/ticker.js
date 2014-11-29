define([
    'underscore',
    'helpers/events'
], function( _, Events){

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var Ticker = function(){

        _.bindAll(this, 'onAnimationFrame');

    };

    Ticker.prototype = {
        rafID : null,
        prevTime: null,
        deltas : null,
        isPaused : true,

        start : function(){
            if(!this.isPaused) return;

            this.isPaused = false;

            this.startTime = this.prevTime = +new Date();
            this.deltas = [];
            this.rafID     = requestAnimationFrame(this.onAnimationFrame);
        },

        stop : function(){
            this.isPaused = true;
            cancelAnimationFrame(this.rafID);
        },

        onAnimationFrame : function(){
            var nextTime = +new Date(),
                delta = (nextTime - this.prevTime) / 1000;

            this.prevTime = nextTime;

            this.deltas.push(delta);

            while(this.deltas.length > 100) this.deltas.shift();
            Events.trigger(Events.TICK, delta);
            this.rafID    = requestAnimationFrame(this.onAnimationFrame);
        },

        get frameLength() {
            var i   = this.deltas.length,
                sum = 0;

            while(i--) {
                sum += this.deltas[i];
            };

            return sum / this.deltas.length;
        },

        get FPS() {
            return 1 / this.frameLength;
        }

    };

    var ticker = new Ticker();
    window.ticker = ticker;

    return ticker;

});