'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('djmodules-utils/lib/http');

var _commons = require('../commons');

var _commons2 = _interopRequireDefault(_commons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('../commons/promise-fp');

var _require = require('ramda'),
    curry = _require.curry,
    componse = _require.componse,
    map = _require.map;

var NETWORK_ERROR_MESSAGE = '网络请求错误，请刷新重试或稍后重试';
var HTTP_METHOD_GET = 'GET';
var HTTP_METHOD_POST = 'POST';
var HTTP_STATUS_SUCCESS = 'success';

var API_ERROR = 'API_ERROR';
var UNKNOW_ERROR = 'UNKNOW_ERROR';

var HttpError = function () {
    function HttpError(type, error) {
        _classCallCheck(this, HttpError);

        this.type = type;
        this.error = error || {};
    }

    _createClass(HttpError, [{
        key: 'valueOf',
        value: function valueOf() {
            return this.message;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.message;
        }
    }, {
        key: 'message',
        get: function get() {
            return this.error.message || this.error.exceptionMessage || NETWORK_ERROR_MESSAGE;
        }
    }]);

    return HttpError;
}();

var handleError = curry(function (apiErrorHandler, unknowErrorHandler, error) {
    if (error instanceof HttpError) {
        return error.type === API_ERROR ? apiErrorHandler(error.error) : unknowErrorHandler(error.error);
    } else {
        return unknowErrorHandler(error);
    }
});

var ajax = curry(function (url, options) {
    return Promise.of(function (resolve, reject) {
        _http.Http.ajax(url, options).then(function (response) {
            if (response.status === HTTP_STATUS_SUCCESS) {
                resolve(response);
            } else {
                reject(new HttpError(API_ERROR, response));
            }
        }).catch(function (err) {
            reject(new HttpError(UNKNOW_ERROR, err));
        });
    });
});

var get = curry(function (url, params) {
    return ajax(url, {
        method: HTTP_METHOD_GET,
        data: params
    });
});

var post = curry(function (url, params) {
    return ajax(url, {
        method: HTTP_METHOD_POST,
        data: params
    });
});

var resultObject = function resultObject(defaultValue) {
    return _commons2.default.safeProp(defaultValue, [null, undefined], 'resultObject');
};

module.exports = {
    ajax: ajax,
    get: get,
    post: post,
    resultObject: resultObject,
    handleError: handleError
};