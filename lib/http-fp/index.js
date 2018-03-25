'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resultObject = exports.post = exports.get = exports.request = undefined;

var _http = require('djmodules-utils/lib/http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('folktale/concurrency/task'),
    task = _require.task;

var _require2 = require('folktale/core/lambda'),
    curry = _require2.curry,
    componse = _require2.componse;

var request = exports.request = curry(2, function (url, options) {
    return new Promise(function (resolve, reject) {
        return _http2.default.ajax(url, options).then(function (response) {
            if (response.status === 'success') {
                resolve(response);
            } else {
                reject(response.message || response.exceptionMessage || '网络请求错误，请稍后重试！！！');
            }
        }).catch(function (err) {
            reject(err.message || err.exceptionMessage || '网络请求错误，请稍后重试！！！');
        });
    });
});

var get = exports.get = curry(2, function (url, params) {
    return request(url, {
        method: 'GET',
        data: params
    });
});

var post = exports.post = curry(2, function (url, params) {
    return request(url, {
        method: 'POST',
        data: params
    });
});

var resultObject = exports.resultObject = curry(2, function (defaultValue, response) {
    return (response || {}).resultObject || defaultValue;
});