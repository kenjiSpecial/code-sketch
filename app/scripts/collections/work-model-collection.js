/**
 * Created by kenji-special on 10/25/14.
 */
define([
    'backbone',

    // helpers
    'helpers/modernizr'
],function (Backbone, modernizr) {


    var WorkModelCollection = Backbone.Collection.extend({
        url : '/data/work-data.json',

    });

    var workModelCollection = new WorkModelCollection();

    if(modernizr.isDebug) window.workModelCollection = workModelCollection;

    return workModelCollection;
});
