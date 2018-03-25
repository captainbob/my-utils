'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toFixed = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isArray = isArray;
exports.modelOrg = modelOrg;
exports.wrapper = wrapper;
exports.addAlias = addAlias;

var _toFixed2 = require('./toFixed');

var _toFixed3 = _interopRequireDefault(_toFixed2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 判断是不是 array
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
function modelOrg(clazz) {
    return function (target, name, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = function () {
            var _arguments = arguments;

            return new Promise(function (resolve, reject) {
                oldValue.apply(target, _arguments).then(function (response) {
                    if (!response) {
                        return resolve(response);
                    }
                    if (response.pagination) {
                        var resResults = response.results || [];
                        return resolve(_extends({}, response, {
                            results: resResults.map(function (v) {
                                return new clazz(v);
                            })
                        }));
                    } else if (isArray(response)) {
                        return resolve(response.map(function (v) {
                            return new clazz(v);
                        }));
                    } else {
                        return resolve(new clazz(response));
                    }
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
    };
}

function wrapper(target) {
    var key = 0;
    return function (_target) {
        _inherits(_class, _target);

        function _class(result) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, result));

            _this.$source = result;
            _this.$keyId = ++key;
            return _this;
        }

        return _class;
    }(target);
}
function addAlias(sourceParam) {
    return function (target, name, descriptor) {
        var newDescriptor = {
            enumerable: true,
            configurable: true,
            get: function get() {
                return _.get(this.$source, sourceParam, undefined);
            },
            set: function set(v) {
                return _.set(this.$source, sourceParam, v);
            }
        };
        Object.defineProperty(target, name, newDescriptor);
        return newDescriptor;
    };
}
exports.toFixed = _toFixed3.default;