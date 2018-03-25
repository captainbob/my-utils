'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _urlSearchParams = require('url-search-params');

var _urlSearchParams2 = _interopRequireDefault(_urlSearchParams);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _log4js = require('../log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _uuid = require('../uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TIMEOUT_MILLI_SECONDS = 60000;

function reportError(requestId, url, param, message, errMessage) {
    _log4js2.default.init(window.version || '1.0.0');
    _log4js2.default.error({
        requestPath: url,
        traceid: requestId,
        param: param,
        message: message,
        errMessage: errMessage
    });
}

function debug(message) {
    console.log('%c' + message, 'background:yellow;color:black');
}

var HttpRequest = function HttpRequest() {
    var _this = this;

    _classCallCheck(this, HttpRequest);

    this.ajax = function (url, options, mockJson) {
        var defaultOptions = {
            credentials: 'same-origin',
            checkResponse: true,
            rewriteUrl: true
        };
        options = Object.assign({}, defaultOptions, options);
        if (options.rewriteUrl) {
            url = _this._processUrl(options, url);
        }
        return new Promise(function (resolve, reject) {
            if (mockJson) {
                var key = (options.method || 'POST').toUpperCase() + ' ' + url;
                var value = mockJson[key];
                debug(key);
                debug('params: ' + JSON.stringify(options.data || {}));
                if (value) {
                    if (typeof value == 'function') {
                        var request = {
                            query: options.data,
                            params: options.data
                        };
                        var response = {
                            end: function end(responseJson) {
                                debug('response: ' + responseJson || "{}");
                                resolve(JSON.parse(responseJson));
                            }
                        };
                        value(request, response);
                    } else {
                        debug('response: ' + JSON.stringify(value || {}));
                        resolve(value);
                    }
                } else {
                    debug('response: ' + JSON.stringify({ error: '_not_found', message: '404' }));
                    reject({ error: '_not_found', message: '404' });
                }
                return;
            }
            var timer = null;
            var clearTimer = function clearTimer() {
                if (timer != null) {
                    clearTimeout(timer);
                }
            };
            if (typeof options.timeout == 'undefined') {
                options.timeout = TIMEOUT_MILLI_SECONDS;
            }
            if (options.timeout > 0) {
                timer = setTimeout(function () {
                    clearTimer();
                    reject({ status: '_timeout', message: '请求超时' });
                }, options.timeout);
            }
            var searchParams = new _urlSearchParams2.default();

            var _options = options,
                data = _options.data,
                _options$headers = _options.headers,
                headers = _options$headers === undefined ? {} : _options$headers,
                method = _options.method,
                timeout = _options.timeout,
                nors = _options.nors,
                urlSuffix = _options.urlSuffix,
                deconstructResultObject = _options.deconstructResultObject,
                otherOptions = _objectWithoutProperties(_options, ['data', 'headers', 'method', 'timeout', 'nors', 'urlSuffix', 'deconstructResultObject']);

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
            }
            var traceId = _uuid2.default.get();
            headers['Traceid'] = traceId;
            var contentType = headers['Content-Type'];

            var requestOptions = _extends({}, otherOptions, {
                method: (method || 'POST').toUpperCase(),
                headers: headers
            });

            if (requestOptions.method == 'POST') {
                var body = _this._parseBody(contentType, data || {});
                Object.assign(requestOptions, { body: body });
            } else if (requestOptions.method == 'GET') {
                var _searchParams = new _urlSearchParams2.default();
                Object.keys(data || {}).forEach(function (key) {
                    if (!_this._isEmpty(data[key])) {
                        _searchParams.append(key, data[key]);
                    }
                });
                url = url + '?' + _searchParams.toString();
            }

            (0, _isomorphicFetch2.default)(url, requestOptions).then(function (response) {
                if (response.ok) {
                    response.json().then(function (responseJson) {
                        clearTimer();
                        if (options.checkResponse && responseJson.status != 'success') {
                            if (responseJson.exceptionLevel == 'ERROR') {
                                reportError(traceId, url, data, responseJson.message, responseJson.exceptionMessage);
                                responseJson = Object.assign({}, responseJson, { traceid: traceId });
                            }
                        }
                        resolve(responseJson);
                    }).catch(function (err) {
                        clearTimer();
                        reportError(traceId, url, data, response.statusText, '服务器返回格式错误');
                        reject({
                            message: '服务器返回格式错误',
                            status: '_server_error',
                            traceid: traceId
                        });
                    });
                } else {
                    clearTimer();
                    reportError(traceId, url, data, response.statusText, response.responseText);
                    reject({
                        message: response.statusText,
                        status: response.status,
                        traceid: traceId
                    });
                }
            }).catch(function (err) {
                clearTimer();
                err = Object.assign({}, err, { status: '_net_work_error', traceid: traceId });
                reportError(traceId, url, data, err.message, '');
                reject(err);
            });
        });
    };

    this._isEmpty = function (value) {
        if (value === undefined || value === null) {
            return true;
        }
        return false;
    };

    this._parseBody = function (contentType, data) {
        contentType = contentType.split(';')[0];
        switch (contentType) {
            case 'application/x-www-form-urlencoded':
                var searchParams = new _urlSearchParams2.default();
                Object.keys(data || {}).forEach(function (key) {
                    if (!_this._isEmpty(data[key])) {
                        searchParams.append(key, data[key]);
                    }
                });
                return searchParams.toString();
            case 'application/json':
                return JSON.stringify(data);
            case 'multipart/form-data':
                var formData = new FormData();
                Object.keys(data || {}).forEach(function (key) {
                    if (!_this._isEmpty(data[key])) {
                        formData.append(key, data[key]);
                    }
                });
                return formData;
        }
    };

    this._processUrl = function (options, url) {
        if (options.noProcessUrl) {
            return url;
        }
        if (url.startsWith("/rs/")) {
            url = _path + url;
        } else {
            if (options.nors === true) {
                url = _path + '/' + url;
            } else {
                url = _path + '/rs/' + url;
            }
        }

        if (!url.endsWith('.do')) {
            if (options.urlSuffix) {
                url += options.urlSuffix;
            } else {
                url += '.do';
            }
        }
        return url;
    };
};

HttpRequest = new HttpRequest();

exports.default = HttpRequest;