'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataProvider = require('./data-provider');

var _dataProvider2 = _interopRequireDefault(_dataProvider);

var _httpUtils = require('../http-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseDataProvider = function (_DataProvider) {
    _inherits(BaseDataProvider, _DataProvider);

    function BaseDataProvider(url, options, error) {
        _classCallCheck(this, BaseDataProvider);

        var _this = _possibleConstructorReturn(this, (BaseDataProvider.__proto__ || Object.getPrototypeOf(BaseDataProvider)).call(this));

        _this.url = url;
        _this.options = options;
        _this.error = error;
        return _this;
    }

    _createClass(BaseDataProvider, [{
        key: 'getData',
        value: function getData(success, error) {
            var _this2 = this;

            _httpUtils.HttpUtil.ajax(this.url, this.options).then(function (response) {
                if (typeof success == 'function') {
                    success(response);
                }
            }).catch(function (err) {
                error = error || _this2.error;
                if (typeof error == 'function') {
                    error(err);
                }
            });
        }
    }]);

    return BaseDataProvider;
}(_dataProvider2.default);

exports.default = BaseDataProvider;