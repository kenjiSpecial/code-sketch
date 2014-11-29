define([
    'jquery',
    'underscore',

    // model
    'models/window-model',

    // helpers
    'helpers/transform',
    'helpers/modernizr'
],function ( $, _, windowModel, transform, modernizr ) {
    var Finger = function(){
        _.bindAll(this, "activeDelayMobile", "activeDelay", "onCompleteInactiveDomHandler");

        var imgUrl, width, height, imgWidth, imgHeight;

        this.dom = document.getElementById("finger");
        this.$dom = $(this.dom);

        if(modernizr.isMobile) {
            imgUrl = "images/helpers/finger.png";
            width = imgWidth = 32;
            height = imgHeight = 32;


        }else{
            imgUrl = "images/helpers/hand-cursor.png";
            width = 64/2;
            height = 32/2;
            imgWidth = width/2;
            imgHeight = height;
        }

        this.$dom.css({
            "background": "url(" + imgUrl + ") no-repeat",
            "background-size": width + "px " + height + "px",
            "width" : imgWidth,
            "height": imgHeight
        });
    };

    Finger.prototype = {

        setup : function(){

        },

        show : function(){
            this.dom.style.display = "block";


            if(modernizr.isMobile) {
                _.delay(this.activeDelayMobile, 2000);
            }else{
                _.delay(this.activeDelay, 1000);
            }
        },

        activeDelayMobile : function(){

            TweenLite.to( this.dom, .8, { opacity: 1, ease:Power2.easeOut });
            TweenLite.to( this.dom, .5, { opacity: 0, ease:Power2.easeOut, onComplete: this.onComplteInactiveDomHandler, delay:1.5 });

            TweenLite.fromTo( this.dom, .6, {x: window.innerWidth *.5, y: window.innerHeight/2}, { x: window.innerWidth *.1, y: window.innerHeight/2, delay:.5, ease: Power2.easeOut});
        },

        activeDelay : function(){
            var self = this;
            TweenLite.to( this.dom, .8, { opacity: 1, ease:Power2.easeOut });
            setTimeout(function(){
                    self.$dom.css({"backgroundPosition": "-16px 0",});
            }, 1000);


            TweenLite.to( this.dom, .5, { opacity: 0, ease:Power2.easeOut, onComplete: this.onCompleteInactiveDomHandler, delay:2.5 });
            TweenLite.fromTo( this.dom, .6, {x: window.innerWidth *.5, y: window.innerHeight/2}, { x: window.innerWidth /2 - 300, y: window.innerHeight/2, delay:1.5, ease: Power2.easeOut});

        },

        onCompleteInactiveDomHandler : function(){
            this.dom.style.display = "none";
        },

        update : function(){

        }
    };

    return Finger;
});
