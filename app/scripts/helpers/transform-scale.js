/**
 * Created by kenji-special on 11/1/14.
 */
define(function () {
    function updateTransform(el, x, y, z, perspective, scale, rate) {
        var pProp = 'perspective(' + perspective +  'px)',
        tProp = 'translate3d(' + x + 'px, '+ y + 'px ,' + z +'px)',
            sProp = 'scale('       + scale * rate  +    ')';

        //var matrix = 'matrix(1, 0, 0, 1, ' + x + ", " + y + ")";
        //var matrix = 'matrix('+ rate +', 0, 0, ' + rate + ', ' + x + ", " + y + ")";


        var props = [pProp, tProp, sProp].join(' ');

        el.style[Modernizr.prefixed('transform')] = props;

    }

    return updateTransform;
});
