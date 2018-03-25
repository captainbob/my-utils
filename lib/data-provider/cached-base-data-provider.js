'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataProvider = require('./data-provider');

var _dataProvider2 = _interopRequireDefault(_dataProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CachedBaseDataProvider = function (_DataProvider) {
    _inherits(CachedBaseDataProvider, _DataProvider);

    function CachedBaseDataProvider(provider) {
        _classCallCheck(this, CachedBaseDataProvider);

        var _this = _possibleConstructorReturn(this, (CachedBaseDataProvider.__proto__ || Object.getPrototypeOf(CachedBaseDataProvider)).call(this));

        _this.proxy = provider;
        _this.isRunning = false;
        _this.queue = [];
        _this.cache = null;
        return _this;
    }

    _createClass(CachedBaseDataProvider, [{
        key: 'clearCache',
        value: function clearCache() {
            this.cache = null;
        }
    }, {
        key: 'getData',
        value: function getData(success, error) {
            var _this2 = this;

            if (!this.isRunning) {
                this.isRunning = true;
                if (this.cache) {
                    this.isRunning = false;
                    success(this.cache);
                    this._invokeQueueCallbacks('success', this.cache);
                } else {
                    this.proxy.getData(function (response) {
                        _this2.cache = response;
                        _this2.isRunning = false;
                        if (typeof success == 'function') {
                            success(response);
                        }
                        _this2._invokeQueueCallbacks('success', response);
                    }, function (err) {
                        _this2.isRunning = false;
                        if (typeof error == 'function') {
                            error(err);
                        }
                        _this2._invokeQueueCallbacks('error', err);
                    });
                }
            } else {
                this.queue.push({ success: success, error: error });
            }
        }
    }, {
        key: '_invokeQueueCallbacks',
        value: function _invokeQueueCallbacks(type, data) {
            if (type == 'success') {
                this.queue.forEach(function (callback) {
                    if (typeof callback.success == 'function') {
                        callback.success(data);
                    }
                });
            } else {
                this.queue.forEach(function (callback) {
                    if (typeof callback.error == 'function') {
                        callback.error(data);
                    }
                });
            }
            this.queue = [];
        }
    }]);

    return CachedBaseDataProvider;
}(_dataProvider2.default);

exports.default = CachedBaseDataProvider;