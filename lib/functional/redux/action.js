'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var action = (0, _ramda.curry)(function (type, body) {
    if (body && typeof body.payload != 'undefined') {
        var payload = body.payload,
            properties = _objectWithoutProperties(body, ['payload']);

        return _extends({
            type: type,
            payload: payload
        }, properties);
    } else {
        return {
            type: type,
            payload: body
        };
    }
});

exports.default = action;