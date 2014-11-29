define([
        'underscore',
        'backbone'
    ], function ( _, Backbone ) {
        var Events = {};
        _.extend(Events, Backbone.Events);

        $.extend(Events, {
            TICK: "tick",

            START_OPEN_ANIMATION : 'startOpenAnimation',

            // backbone
            CHANGE : 'change',
            SUB_PAGE_CHANGE : 'change:subPage',
            MAIN_PAGE_CHANGE: 'change:mainPage',

            // router
            RENDER_WORK_VIEW : 'renderWorkView',
            STOP_ANIMATION   : 'stopAnimation',
            RESUME_ANIMATION : 'resumeAnimation',

            // loader view
            LOADER_VIEW_COMPLETE : 'loaderViewComplete',

            // main view
            DONE_START_ANIMATION : 'doneStartAnimation',


            // Load
            LOAD_DONE : 'loadDone',
            LOAD  : 'load',
            ERROR : 'error',

            NAVIGATION_CREATE : 'navigationCreate',
            PAGE_SCROLL_START : 'pageScrollStart',
            CREATE_ARROW : 'createArrow',

            // mouse event
            MOUSE_DOWN: 'mousedown',
            MOUSE_UP: 'mouseup',
            MOUSE_MOVE: 'mousemove',
            MOUSE_ENTER : 'mouseenter',
            MOUSE_LEAVE : 'mouseleave',
            MOUSE_OVER : 'mouseover',
            MOUSE_OUT : 'mouseout',

            // touch event
            TOUCH_START  : 'touchstart',
            TOUCH_MOVE   : 'touchmove',
            TOUCH_END    : 'touchend',
            TOUCH_CANCEL : 'touchcancel',

            // customr window

            'SCROLL_UP' : 'scrollUp',
            'SCROLL_DOWN' : 'scrollDown',

            PAGE_UP   : 'pageUp',
            PAGE_DOWN : 'pageDown',

            MOUSE_WHEEL : 'mousewheel DOMMouseScroll',

            KEY_DOWN : 'keydown',

            // ----------

            WINDOW_RESIZE: 'resize'
        });


        return Events;
    }
);
