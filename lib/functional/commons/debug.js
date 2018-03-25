'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var debug = (0, _ramda.curry)(function (tag, item) {
    console.log(tag + item);
    return item;
});

exports.default = debug;