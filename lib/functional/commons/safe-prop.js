'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var safeProp = (0, _ramda.curry)(function (defaultValue, values, key, item) {
    item = item ? item : {};
    var keys = key.split('.');
    var p = undefined;

    for (var i = 0; i < keys.length && item; i++) {
        p = item[keys[i]];
        item = p;
    }

    for (var _i = 0; _i < values.length; _i++) {
        if (p === values[_i]) return defaultValue;
    }
    return p;
});

exports.default = safeProp;