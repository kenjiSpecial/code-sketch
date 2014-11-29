/**
 * Created by kenji-special on 10/26/14.
 */
define([
    ""
],function () {

    function updateTransform(el, x, y, z, perspective, scale) {
        var pProp = 'perspective(' + perspective +  'px)',
            tProp = 'translate3d(' + x + 'px, '+ y + 'px ,' + z +'px)',
            sProp = 'scale('       + scale  +    ')';
        //var matrix = 'matrix(1, 0, 0, 1, ' + x + ", " + y + ")";


        var props = [pProp, tProp, sProp].join(' ');

        el.style[Modernizr.prefixed('transform')] = props;

    }

    return updateTransform;
});
