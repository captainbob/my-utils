'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpQueue = require('../http-queue');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function deconstructResultObject(promise) {
    return new Promise(function (resolve, reject) {
        promise.then(function (response) {
            if (response.status == 'success') {
                resolve(response.resultObject, response);
            } else {
                reject(response);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}

var TIMEOUT_MILLI_SECONDS = 60000;

var Http = function () {
    function Http() {
        var _this = this;

        _classCallCheck(this, Http);

        this.setMockJson = function (json) {
            _this.mockJson = json;
        };
    }

    _createClass(Http, [{
        key: 'promisePost',
        value: function promisePost(url, params, headers) {
            return this._request('POST', url, params || {}, headers || {});
        }
    }, {
        key: 'promiseGet',
        value: function promiseGet(url, params, headers) {
            return this._request('GET', url, params || {}, headers || {});
        }
    }, {
        key: 'promiseAjax',
        value: function promiseAjax(url, options) {
            options = Object.assign({
                timeout: TIMEOUT_MILLI_SECONDS,
                deconstructResultObject: true,
                checkResponse: true
            }, options || {});
            return this.ajax(url, options);
        }
    }, {
        key: 'ajax',
        value: function ajax(url, options) {
            if (options.checkResponse && options.deconstructResultObject) {
                var promise = this._ajax(url, options);
                return deconstructResultObject(promise);
            }
            return this._ajax(url, options);
        }
    }, {
        key: '_ajax',
        value: function _ajax(url, options) {
            return _httpQueue.HttpQueue.concurrent().enqueue(url, options, this.mockJson);
        }
    }, {
        key: '_request',
        value: function _request(method, url, params, headers) {
            var _options = params._options,
                otherParams = _objectWithoutProperties(params, ['_options']);

            var options = Object.assign({
                timeout: TIMEOUT_MILLI_SECONDS,
                deconstructResultObject: true,
                checkResponse: true
            }, _options);
            return this.ajax(url, _extends({
                method: method,
                data: otherParams,
                headers: headers
            }, options));
        }
    }]);

    return Http;
}();

Http = new Http();

exports.default = Http;