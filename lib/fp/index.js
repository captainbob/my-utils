"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = Box = function (_Box) {
    function Box(_x) {
        return _Box.apply(this, arguments);
    }

    Box.toString = function () {
        return _Box.toString();
    };

    return Box;
}(function (x) {
    return {
        map: function map(f) {
            return Box(f(x));
        },
        inspect: function inspect() {
            return "Box(" + x + ")";
        },
        fold: function fold(f) {
            return f(x);
        }
    };
});