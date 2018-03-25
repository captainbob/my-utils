'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var _action = require('./action');

var _action2 = _interopRequireDefault(_action);

var _type = require('./type');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatch = (0, _ramda.curry)(function (dispatch, actionType, payload) {
    return (0, _ramda.compose)(dispatch, (0, _action2.default)((0, _type.type)(actionType)))(payload);
});

exports.default = dispatch;