/**
 * Created by kenji-special on 4/27/14.
 */
define(function () {
    UA = navigator.userAgent;

    Modernizr.addTest({
        local          : function() { return /(localhost|127\.0\.0\.1|\.local)$/i.test(location.hostname)},
        mobile         : function() { return /iPhone|iPad|iPod|Android|windows phone|iemobile|\bsilk\b/i.test(UA)},
        phone          : function() { return /i(phone|pod)|android.+mobile|windows phone|iemobile/i.test(UA)},
        tablet         : function() { return /ipad|android(?!.+mobile)|\bsilk\b/i.test(UA)},
        ie9            : function() { return /msie 9/i.test(UA)},
        safari5        : function() { return /version\/5\..+ safari/i.test(UA)},
        ios            : function() { return /i(phone|pod|pad)/i.test(UA)},
        ipad           : function() { return /iPad/i.test(UA)},
        webkit         : function() { return /webkit/i.test(UA)},
        android        : function() { return /Android/i.test(UA)},
        androidbrowser : function() { return /android(?!.+chrome)/i.test(UA)},
        androidchrome  : function() { return /android.+chrome/i.test(UA)},
        standalone     : function() { return !!navigator.standalone}
    });

    return {
        isMobile : Modernizr.mobile,
        isPhone  : Modernizr.phone,
        isTablet  : Modernizr.tablet,
        isIos : Modernizr.ios,
        isDebug : true
    };
});
