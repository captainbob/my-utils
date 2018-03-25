'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpDelayQueue = require('./http-delay-queue');

var _httpDelayQueue2 = _interopRequireDefault(_httpDelayQueue);

var _httpSerialQueue = require('./http-serial-queue');

var _httpSerialQueue2 = _interopRequireDefault(_httpSerialQueue);

var _httpConcurrentQueue = require('./http-concurrent-queue');

var _httpConcurrentQueue2 = _interopRequireDefault(_httpConcurrentQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpQueue = function () {
    function HttpQueue() {
        _classCallCheck(this, HttpQueue);
    }

    _createClass(HttpQueue, [{
        key: 'delay',
        value: function delay(_delay) {
            var latest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

            return new _httpDelayQueue2.default(_delay, latest, delta);
        }
    }, {
        key: 'concurrent',
        value: function concurrent() {
            return _httpConcurrentQueue2.default;
        }
    }, {
        key: 'serial',
        value: function serial() {
            return new _httpSerialQueue2.default();
        }
    }]);

    return HttpQueue;
}();

HttpQueue = new HttpQueue();

exports.default = HttpQueue;