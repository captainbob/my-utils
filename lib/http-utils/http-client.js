'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _http = require('../http');

var _coreDecorators = require('core-decorators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var HttpClient = (_class = function () {
    function HttpClient() {
        _classCallCheck(this, HttpClient);

        this.setMockJson = function (json) {
            return _http.Http.setMockJson(json);
        };
    }

    _createClass(HttpClient, [{
        key: 'promiseGet',
        value: function promiseGet(url, params, headers) {
            return _http.Http.promiseGet(url, params, headers);
        }
    }, {
        key: 'promisePost',
        value: function promisePost(url, params, headers) {
            return _http.Http.promisePost(url, params, headers);
        }
    }, {
        key: 'promiseAjax',
        value: function promiseAjax(url, options) {
            return _http.Http.promiseAjax(url, options);
        }
    }, {
        key: 'ajax',
        value: function ajax(url, options) {
            return _http.Http.ajax(url, options);
        }
    }, {
        key: 'promisePostEncode',
        value: function promisePostEncode(url, params, headers) {
            return _http.Http.promisePost(url, params, headers);
        }
    }, {
        key: 'get',
        value: function get(url, params, headers) {
            params = _extends({
                _options: {
                    deconstructResultObject: false
                }
            }, params || {});
            return _http.Http.promiseGet(url, params, headers);
        }
    }, {
        key: 'getEncode',
        value: function getEncode(url, params, headers) {
            params = _extends({
                _options: {
                    deconstructResultObject: false
                }
            }, params || {});
            return _http.Http.promiseGet(url, params, headers);
        }
    }, {
        key: 'post',
        value: function post(url, params, headers) {
            params = _extends({
                _options: {
                    deconstructResultObject: false
                }
            }, params || {});
            return _http.Http.promisePost(url, params, headers);
        }
    }, {
        key: 'postEncode',
        value: function postEncode(url, params, headers) {
            params = _extends({
                _options: {
                    deconstructResultObject: false
                }
            }, params || {});
            return _http.Http.promisePost(url, params, headers);
        }
    }]);

    return HttpClient;
}(), (_applyDecoratedDescriptor(_class.prototype, 'promisePostEncode', [_coreDecorators.deprecate], Object.getOwnPropertyDescriptor(_class.prototype, 'promisePostEncode'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'get', [_coreDecorators.deprecate], Object.getOwnPropertyDescriptor(_class.prototype, 'get'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getEncode', [_coreDecorators.deprecate], Object.getOwnPropertyDescriptor(_class.prototype, 'getEncode'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'post', [_coreDecorators.deprecate], Object.getOwnPropertyDescriptor(_class.prototype, 'post'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'postEncode', [_coreDecorators.deprecate], Object.getOwnPropertyDescriptor(_class.prototype, 'postEncode'), _class.prototype)), _class);


HttpClient = new HttpClient();

exports.default = HttpClient;