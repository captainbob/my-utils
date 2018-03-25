'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _httpRequest = require('./http-request');

var _httpRequest2 = _interopRequireDefault(_httpRequest);

var _httpConcurrentQueue = require('./http-concurrent-queue');

var _httpConcurrentQueue2 = _interopRequireDefault(_httpConcurrentQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_SIZE = 1;
var idGenerator = 0;

var HttpSerialQueue = function HttpSerialQueue() {
    var _this = this;

    _classCallCheck(this, HttpSerialQueue);

    this.enqueue = function (url, options, mockJson) {
        return new Promise(function (resolve, reject) {
            _this.queue.push({
                id: ++idGenerator,
                url: url,
                options: options,
                resolve: resolve,
                reject: reject,
                mockJson: mockJson
            });
            _this._startRequest();
        });
    };

    this._removeFromQueue = function (id) {
        var length = _this.queue.length;
        _this.queue = _this.queue.filter(function (item) {
            return item.id != id;
        });
    };

    this._requestComplete = function () {
        _this.size = _this.size - 1;
        if (_this.size < 0) {
            _this.size = 0;
        }
    };

    this._startRequest = function () {
        if (_this.size < MAX_SIZE && _this.queue && _this.queue.length > 0) {
            _this.size = _this.size + 1;
            var firstHttpAction = _this.queue[0];
            _this._removeFromQueue(firstHttpAction.id);
            _httpConcurrentQueue2.default.enqueue(firstHttpAction.url, firstHttpAction.options, firstHttpAction.mockJson).then(function (response) {
                _this._requestComplete();
                firstHttpAction.resolve(response);
                _this._startRequest();
            }).catch(function (err) {
                _this._requestComplete();
                firstHttpAction.reject(err);
                _this._startRequest();
            });
        }
    };

    this.queue = [];
    this.size = 0;
};

exports.default = HttpSerialQueue;