'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _httpRequest = require('./http-request');

var _httpRequest2 = _interopRequireDefault(_httpRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_SIZE = 4;
var idGenerator = 0;

var HttpConcurrentQueue = function HttpConcurrentQueue() {
    var _this = this;

    var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MAX_SIZE;

    _classCallCheck(this, HttpConcurrentQueue);

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
        if (_this.size < _this.maxSize && _this.queue && _this.queue.length > 0) {
            _this.size = _this.size + 1;
            var firstHttpAction = _this.queue[0];
            _this._removeFromQueue(firstHttpAction.id);
            _httpRequest2.default.ajax(firstHttpAction.url, firstHttpAction.options, firstHttpAction.mockJson).then(function (response) {
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

    this.maxSize = maxSize;
    this.queue = [];
    this.size = 0;
};

HttpConcurrentQueue = new HttpConcurrentQueue();

exports.default = HttpConcurrentQueue;