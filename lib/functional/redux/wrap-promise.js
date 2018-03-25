'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var wrapPromise = (0, _ramda.curry)(function (data, promise) {
    return {
        data: data,
        promise: promise
    };
});

exports.default = wrapPromise;