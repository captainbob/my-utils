'use strict';

var _isPromise = require('../redux/redux-promise-middleware/is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('ramda'),
    curry = _require.curry,
    compose = _require.compose,
    map = _require.map;

Promise.prototype['fantasy-land/map'] = function (fn) {
    var _this = this;

    return new Promise(function (resolve, reject) {
        _this.then(compose(resolve, fn)).catch(reject);
    });
};

Promise.of = function (callback) {
    return new Promise(callback);
};

Promise.prototype['fantasy-land/ap'] = function (promiseApplyF) {
    var _this2 = this;

    if (!(0, _isPromise2.default)(promiseApplyF)) {
        throw new Error('Promise ap only accept Promise type arguments');
    }
    return Promise.of(function (resolve, reject) {
        promiseApplyF.then(function (func) {
            _this2.map(func).then(resolve).catch(reject);
        }).catch(reject);
    });
};