'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = toFixed;

var _utils = require('./utils');

var _lodash = require('lodash');

var DEFAULT_FIXED_N = 2;

function handleDescriptor(target, key, descriptor, _ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        _ref2$ = _ref2[0],
        n = _ref2$ === undefined ? DEFAULT_FIXED_N : _ref2$;

    return _extends({}, descriptor, {
        get: function get() {
            var value = descriptor.get.call(this);
            value = (0, _lodash.toNumber)(value).toFixed(n);
            return value;
        }
    });
}

// toFixed这个值
function toFixed() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return (0, _utils.decorate)(handleDescriptor, args);
}