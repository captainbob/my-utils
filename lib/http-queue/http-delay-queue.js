'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp, _initialiseProps;

var _httpConcurrentQueue = require('./http-concurrent-queue');

var _httpConcurrentQueue2 = _interopRequireDefault(_httpConcurrentQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_DELAY = 1000;
var DEFAULT_LATEST = true;
var DEFAULT_DELTA = 500;

var HttpDelayQueue = (_temp = _class = function HttpDelayQueue() {
    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_DELAY;
    var latest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_LATEST;
    var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

    _classCallCheck(this, HttpDelayQueue);

    _initialiseProps.call(this);

    this.delay = delay;
    this.latest = latest;
    this.timer = null;
    this.queue = [];
    this.serials = [];
    this.delta = delta == -1 ? this.delay / 2 : delta;
    if (this.delta < DEFAULT_DELTA) {
        this.delta = DEFAULT_DELTA;
    }
}, _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.isEmpty = function () {
        return _this.serials.length == 0;
    };

    this.enqueue = function (url, options, mockJson) {
        return new Promise(function (resolve, reject) {
            var timestamp = new Date().getTime();
            _this.queue.push({
                url: url,
                options: options,
                resolve: resolve,
                reject: reject,
                mockJson: mockJson,
                timestamp: timestamp
            });
            _this._startRequest();
        });
    };

    this._startRequest = function () {
        if (!_this.timer) {
            _this.timer = setTimeout(function () {
                clearTimeout(_this.timer);
                _this.timer = null;
                _this._startRequestImmediately();
            }, _this.delay);
        }
    };

    this._isContinually = function () {
        var currentTimestamp = new Date().getTime();
        var timestamps = _this.queue.map(function (item) {
            return item.timestamp;
        }) || [];
        timestamps.push(currentTimestamp);
        if (timestamps.length == 1) {
            return false;
        }
        var deltas = [];
        for (var i = 1; i < timestamps.length; i++) {
            deltas.push(timestamps[i] - timestamps[i - 1]);
        }
        return deltas.every(function (delta) {
            return delta < _this.delta;
        });
    };

    this._startRequestImmediately = function () {
        if (_this.latest) {
            if (_this._isContinually()) {
                _this._startRequest();
            } else {
                if (_this.queue && _this.queue.length > 0) {
                    var latestHttpRequest = _this.queue[_this.queue.length - 1];
                    _this._startRequestInQueue([latestHttpRequest]);
                }
            }
        } else {
            _this._startRequestInQueue(_this.queue || []);
        }
    };

    this._startRequestInQueue = function () {
        var queue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        queue.forEach(function (httpRequest) {
            _this._invokeHttpRequest(httpRequest);
            if (_this.latest) {
                _this.serials.push(httpRequest.timestamp);
            }
        });
        _this.queue = [];
    };

    this._invokeHttpRequest = function (httpRequest) {
        _httpConcurrentQueue2.default.enqueue(httpRequest.url, httpRequest.options, httpRequest.mockJson).then(function (response) {
            if (_this.latest) {
                var newSerials = _this.serials.filter(function (timestamp) {
                    return timestamp > httpRequest.timestamp;
                }) || [];
                if (newSerials.length != _this.serials.length) {
                    httpRequest.resolve(Object.assign({}, response, {
                        isDelayQueueEmpty: (newSerials || []).length == 0
                    }));
                }
                _this.serials = newSerials;
            } else httpRequest.resolve(response);
        }).catch(function (err) {
            if (_this.latest) {
                var newSerials = _this.serials.filter(function (timestamp) {
                    return timestamp > httpRequest.timestamp;
                }) || [];
                if (newSerials.length != _this.serials.length) {
                    httpRequest.reject(Object.assign({}, err, {
                        isDelayQueueEmpty: (newSerials || []).length == 0
                    }));
                }
                _this.serials = newSerials;
            } else {
                httpRequest.reject(err);
            }
        });
    };
}, _temp);
exports.default = HttpDelayQueue;