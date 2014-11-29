define([
    'helpers/modernizr',
    'helpers/events'
], function (modernizr, events) {
    var $document = $(document);
    var $ksMainContainer = $("#ks-root");
    var grabbingStr = 'grabbing';
    var isMouseDown = false;
    var velocity;

    // -----------------------------------------------------------
    //  touch event
    //  url: http://qiita.com/damele0n/items/f4050649de023a948178
    // -----------------------------------------------------------
    var fps = 30; // 30fpsに制限
    var frameTime = 1000 / fps;
    var isAnimated = false;
    var lastTouchInfo = null;
    var lastNonZeroVelocity = 1;
    var mobileFriction = .5 ;

    var enable = function () {
        if (modernizr.isMobile) {
            document.addEventListener(events.TOUCH_START,  onTouchStartHandler);
            document.addEventListener(events.TOUCH_MOVE,   onTouchMoveHandler);
            document.addEventListener(events.TOUCH_END,    onTouchendHandler);
            document.addEventListener(events.TOUCH_CANCEL, onTouchCancelHandler);
        } else {
            $document.on(events.MOUSE_DOWN, onMouseDownHandler);
            $document.on(events.MOUSE_MOVE, onMouseMoveHandler);
            $document.on(events.MOUSE_UP, onMouseUpHandler);
        }
    };

    var disable = function () {

    };

    // =======================
    //      Mouse Event
    // =======================

    var prevPosX, curPosX;

    function onMouseDownHandler(ev) {
        isMouseDown = true;

        prevPosX = ev.clientX;
        curPosX = ev.clientX;

        velocity = 0;

        // add draggable
        $ksMainContainer.addClass(grabbingStr);

        events.trigger(events.MOUSE_DOWN);
    }

    function onMouseMoveHandler(ev) {

        if (isMouseDown) {
            curPosX = ev.clientX;
            velocity = curPosX - prevPosX;


            events.trigger(events.MOUSE_MOVE, velocity);

            prevPosX = curPosX;
        }
    }

    function onMouseUpHandler(ev) {

        if(isMouseDown){
            isMouseDown = false;
            //curPosX = ev.clientX;

            //var velocity = curPosX - prevPosX;

            events.trigger(events.MOUSE_UP, velocity);
            $ksMainContainer.removeClass(grabbingStr);

        }

    }


    $document.delegate('img', 'mousedown', function(event){
        event.preventDefault();
        return false;
    });

    // =======================
    //      Touch Event
    // =======================

    function onTouchStartHandler(ev){
        lastTouchInfo = ev.changedTouches[0];
        var xPos = lastTouchInfo.x;
        prevPosX = curPosX = xPos;
        isAnimated = true;

        animation();

        events.trigger(events.MOUSE_DOWN);

        event.preventDefault();
    }

    function onTouchMoveHandler(ev){
        lastTouchInfo = ev.changedTouches[0];

        event.preventDefault();
    }

    function onTouchendHandler(ev){

        isAnimated = false;

        lastTouchInfo = ev.changedTouches[0];
        curPosX = lastTouchInfo.pageX;
        velocity = curPosX - prevPosX;
        velocity *= mobileFriction;
        prevPosX = curPosX;

        if(velocity != 0) lastNonZeroVelocity = velocity;

        events.trigger(events.MOUSE_UP, lastNonZeroVelocity);

        lastTouchInfo = null;


        event.preventDefault();
    }

    function onTouchCancelHandler(ev){
        // アニメーションの終了
        isAnimated = false;

        lastTouchInfo = ev.changedTouches[0];
        curPosX = lastTouchInfo.pageX;
        velocity = curPosX - prevPosX;
        velocity *= mobileFriction;

        prevPosX = curPosX;

        if(velocity != 0) lastNonZeroVelocity = velocity;

        events.trigger(events.MOUSE_UP, lastNonZeroVelocity);

        lastTouchInfo = null;
    }

    function animation() {
        // isAnimatedフラグが立ってなかったら終了
        if (!isAnimated) {
            return;
        }

        // 最後のタッチイベントからデータを取得
        curPosX = lastTouchInfo.pageX;

        // 何かのスタイルを変更したりする
        velocity = curPosX - prevPosX;
        //velocity *= mobileFriction;

        prevPosX = curPosX;
        //console.log(velocity);


        if(velocity) events.trigger(events.MOUSE_MOVE, velocity);

        if(velocity != 0) lastNonZeroVelocity = velocity;

        // 次のanimationを登録
        setTimeout(animation, frameTime);
    }



    return {enable: enable, disable: disable};
});
