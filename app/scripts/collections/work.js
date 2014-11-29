/*global define*/

define([
    'underscore',
    'backbone',
    'TweenLite',

    // models
    'models/work',

    // helpers
    'helpers/modernizr',
    'helpers/events',

], function (_, Backbone, TweenLite, WorkModel, modernizr, events) {
    'use strict';

    var WorkCollection = Backbone.Collection.extend({
        model: WorkModel,

        initialize : function(){
            _.bindAll(this, 'onUpdateStartToShowHandler', 'onCompleteStartToShowHandler');
        },

        update : function(cameraPosition){

            for(var i = 0; i < this.models.length; i++){
                this.models[i].update(cameraPosition);
            }
        },

        startToShow : function(){
            var delay = 0;
            this.startAnimationRate = 0;

            for(var i = 0; i < this.models.length; i++){
                this.models[i].setStartPosition();
            }


            TweenLite.to(this, 1, {
                startAnimationRate : 1,
                ease        : "Power2.easeOut",
                onUpdate    : this.onUpdateStartToShowHandler,
                onComplete  : this.onCompleteStartToShowHandler,
            });
        },

        onUpdateStartToShowHandler : function(){

            for(var i = 0; i < this.models.length; i++){
                this.models[i].onUpdateStartPositionHandler(this.startAnimationRate);
            }

        },


        onCompleteStartToShowHandler : function(){


            for(var i = 0; i < this.models.length; i++){
                this.models[i].onUpdateStartPositionHandler(this.startAnimationRate);
            }

            events.trigger(events.DONE_START_ANIMATION);

        },

        onSelectWork : function(workID){
            for(var i = 0; i < this.models.length; i++){
                if(workID == this.models[i].id){
                    this.models[i].onSelectWorkHandler();
                }else{
                    this.models[i].onNotSelectWorkHandler();
                }
            }
        },

        restart : function(){
            for(var i = 0; i < this.models.length; i++){
                this.models[i].restart();
            }
        }



    });

    return WorkCollection;
});
