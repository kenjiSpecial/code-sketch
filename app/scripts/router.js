/**
 * Created by kenji-special on 10/24/14.
 */
define([
    'underscore',
    'backbone',

    // views
    'views/loader-view',
    'views/work-view',
    'views/pen',
    'views/header-view',
    'views/footer-view',

    // helpers
    'helpers/ticker',
    'helpers/events'

],function ( _, Backbone, LoaderView, WorkView, PenView, HeaderView, FooterView, ticker, Events ) {

    var AppRouter = Backbone.Router.extend({
        // view
        loaderView : null,
        workView   : null,
        penView    : null,
        headerView : null,
        footerView : null,

        isLoaded : false,
        //isRenderWorkView : false,

        routes : {
            "pen/:id"  : "showPen",
            '*actions' : "defaultAction"
        },

        initialize : function(){
            _.bindAll(this, 'mainViewAction', 'renderWorkView');

            this.loaderView = new LoaderView();
            this.workView   = new WorkView(this);
            this.penView    = new PenView(this);
            this.headerView = new HeaderView();
            this.footerView = new FooterView();

            Events.on(Events.RENDER_WORK_VIEW, this.renderWorkView);
        },

        defaultAction : function(){
            ticker.start();

            if(this.isLoaded) this.mainViewAction();
            else              this.loadAction();

        },

        loadAction : function(){
            this.loaderView.show();
            Events.on(Events.LOADER_VIEW_COMPLETE, this.mainViewAction);
        },

        renderWorkView : function(){
            if(!this.workView.isRender) this.workView.render();
        },

        mainViewAction : function(){
            if(!this.isLoaded) {
                if (this.loaderView.isShow) this.loaderView.hide();

                this.workView.show();
                this.headerView.show();
                this.footerView.show();

                this.isLoaded = true;
            }else{
                this.workView.reshow();
                this.headerView.show();
                this.footerView.show();
            }

            if(this.penView.isShow) this.penView.hide();
        },

        showPen : function(id){
            if(this.workView.isShow) {
                var delay = 2000;
                this.workView.isShow = false;
                var self = this;
                setTimeout(function(){
                    self.workView.hide();
                    if(!self.workView.isShow) self.penView.show(id);
                }, delay);

                if(!this.workView.isWorkStop || this.footerView.aboutView.isShow)this.workView.selectWork(id);

                this.headerView.hide();
                this.footerView.hide();

            }else{
                this.penView.show(id);
            }


        }

    });
    return AppRouter;
});
