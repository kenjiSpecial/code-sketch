/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ScrollModelModel = Backbone.Model.extend({

        initialize: function() {
        },

        defaults: {
            "distance" : 0,
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    var scrollModelModel = new ScrollModelModel();
    return scrollModelModel;
});
