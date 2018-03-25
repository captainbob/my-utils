'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = toInt;
function toInt(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    switch (type) {
        case 'string':
            return parseInt(value);
        case 'boolean':
            return value ? 1 : 0;
        default:
            return NaN;
    }
}