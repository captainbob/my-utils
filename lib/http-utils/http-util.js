'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Created by changpu on 2017/3/31.
                                                                                                                                                                                                                                                                               */


var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _log4js = require('../log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HttpUtil = {};

function serializeGetReq(data, encode) {
    var ret = "?";
    var keys = Object.keys(data);
    ret = keys.reduce(function (acc, cur, index) {
        if (index == 0) {
            return acc + cur + '=' + (encode ? encodeURIComponent(data[cur]) : data[cur]);
        } else {
            return acc + '&' + cur + '=' + (encode ? encodeURIComponent(data[cur]) : data[cur]);
        }
    }, ret);
    return ret;
}

function serializePostReq(data, encode) {
    var ret = "";
    var keys = Object.keys(data);
    ret = keys.reduce(function (acc, cur, index) {
        if (index == 0) {
            return acc + cur + '=' + (encode ? encodeURIComponent(data[cur]) : data[cur]);
        } else {
            return acc + '&' + cur + '=' + (encode ? encodeURIComponent(data[cur]) : data[cur]);
        }
    }, ret);
    return ret;
}

function uuid() {
    var s = [];
    var userId = "";
    if (window.userInfo) {
        userId = userInfo.userId;
    }
    var hexDigits = "0123456789abcdef";

    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");

    return userId + "-" + uuid + "-" + new Date().getTime();
}
/**
 * 基于 get 封装的 promiseGet请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HttpUtil.promiseGet = function (url, params, headers, callbacks) {
    return new Promise(function (resolve, reject) {
        HttpUtil.get(url, params, headers, callbacks).then(function (json) {
            if (json['status'] === 'success' && json['resultCode'] === 'success') {
                resolve(json && json['resultObject']);
            } else {
                reject(json);
            }
        }).catch(function (json) {
            reject(json);
        });
    });
};

/**
 * 基于 post 封装的 promisePost请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HttpUtil.promisePost = function (url, params, headers, callbacks) {
    return new Promise(function (resolve, reject) {
        HttpUtil.post(url, params, headers, callbacks).then(function (json) {
            if (json['status'] === 'success' && json['resultCode'] === 'success') {
                resolve(json && json['resultObject']);
            } else {
                reject(json);
            }
        }).catch(function (json) {
            reject(json);
        });
    });
};

/**
 * 基于 postEncode 封装的 promisePostEncode请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HttpUtil.promisePostEncode = function (url, params, headers, callbacks) {
    return new Promise(function (resolve, reject) {
        HttpUtil.postEncode(url, params, headers, callbacks).then(function (json) {
            if (json['status'] === 'success' && json['resultCode'] === 'success') {
                resolve(json && json['resultObject']);
            } else {
                reject(json);
            }
        }).catch(function (json) {
            reject(json);
        });
    });
};

/**
 * 基于 Ajax 封装的 promiseAjax请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HttpUtil.promiseAjax = function (url, options) {
    return new Promise(function (resolve, reject) {
        HttpUtil.Ajax(url, options).then(function (json) {
            if (json['status'] === 'success' && json['resultCode'] === 'success') {
                resolve(json && json['resultObject']);
            } else {
                reject(json);
            }
        }).catch(function (json) {
            reject(json);
        });
    });
};

/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HttpUtil.get = function (url, params, headers, callbacks) {
    callbacks = callbacks ? callbacks : {};
    var options = Object.assign({
        method: 'GET',
        data: params,
        headers: headers
    }, callbacks);
    return HttpUtil.ajax(url, options);
};
/**
 * @params encode 参数编码
 */
HttpUtil.getEncode = function (url, params, headers, callbacks) {
    callbacks = callbacks ? callbacks : {};
    var options = Object.assign({
        method: 'GET',
        data: params,
        headers: headers,
        encode: true
    }, callbacks);
    return HttpUtil.ajax(url, options);
};

/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param formData
 * @param headers
 * @returns {Promise}
 */
HttpUtil.post = function (url, formData, headers, callbacks) {
    callbacks = callbacks ? callbacks : {};
    var options = Object.assign({
        method: 'POST',
        data: formData,
        headers: headers
    }, callbacks);
    return HttpUtil.ajax(url, options);
};

/**
 * @params encode 参数编码
 */
HttpUtil.postEncode = function (url, formData, headers, callbacks) {
    callbacks = callbacks ? callbacks : {};
    var options = Object.assign({
        method: 'POST',
        data: formData,
        headers: headers,
        encode: true
    }, callbacks);
    return HttpUtil.ajax(url, options);
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
HttpUtil.ajax = function (url, options) {
    if (url.startsWith("/rs/")) {
        url = _path + url;
    } else {
        if (options.nors == true) {
            url = _path + '/' + url;
        } else {
            url = _path + '/rs/' + url;
        }
    }

    var defaultOption = {
        credentials: 'same-origin'
    };

    var params = {};

    if (options.data) {
        for (var p in options.data) {
            if (options.data[p] == null || options.data[p] == "undefined") {
                continue;
            }
            params[p] = options.data[p];
        }
    }

    options.data = params;

    var requestId = uuid();
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) == 'object') {
        if (!url.endsWith('.do')) {
            if (options.suffix) {
                url += options.suffix;
            } else {
                url += '.do';
            }
        }
        var method = options.method && options.method.toUpperCase() || "POST";
        if (method == 'GET') {
            options.method = 'GET';
            options.headers = Object.assign({}, options.headers || {}, {
                'Traceid': requestId
            });
            url += serializeGetReq(options.data || {}, options.encode);
        } else if (method == 'POST') {
            options.headers = Object.assign({}, options.headers || {}, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Traceid': requestId
            });
            if (!options.body) {
                options.body = serializePostReq(options.data, options.encode);
            }
            options.method = 'POST';
        }
        // 删除 options 的 data
        delete options.data;
    } else {
        options = {
            headers: Object.assign({}, options.headers || {}, {
                'Traceid': requestId
            }),
            method: 'GET'
        };
    }

    options = Object.assign({}, defaultOption, options);

    var _options = options,
        before = _options.before,
        succes = _options.succes,
        error = _options.error,
        always = _options.always,
        errorNotify = _options.errorNotify;


    if (typeof before == 'function') {
        before();
    }

    return new Promise(function (resolve, reject) {
        (0, _isomorphicFetch2.default)(url, options).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                _reportError(requestId, url, params, response.statusText, response.responseText);
                var err = new Error(response.statusText);
                reject(Object.assign({}, err, { response: response, status: response.status, traceid: requestId }));
            }
        }).then(function (response) {
            if (response.resultCode == 'success' || response.status == 'success') {} else {
                if (response.exceptionLevel == 'ERROR') {
                    _reportError(requestId, url, params, response.message, response.exceptionMessage);
                    response = Object.assign({}, response, { traceid: requestId });
                }
            }
            if (typeof errorNotify == "function") {
                errorNotify(response);
            }
            if (typeof always == 'function') {
                always(response);
            }
            if (typeof success == 'function') {
                success(response);
            }
            resolve(response);
        }).catch(function (err) {
            err = Object.assign({}, err, { status: -1, traceid: requestId });
            _reportError(requestId, url, params, err.message, '');
            if (typeof errorNotify == "function") {
                errorNotify(err);
            }
            if (typeof always == 'function') {
                always(err);
            }
            if (typeof error == 'function') {
                error(err);
            }
            reject(err);
        });
    });
};

function _reportError(requestId, url, param, message, errMessage) {
    _log4js2.default.init('1.0.1');
    _log4js2.default.error({
        requestPath: url,
        traceid: requestId,
        param: param,
        message: message,
        errMessage: errMessage
    });
}

exports.default = HttpUtil;