'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

//[a, [b, c], d]
// new a(new b(c), d)
function createObject(array) {
    if (!Array.isArray(array) || array.length == 0) {
        return undefined;
    }
    array = array.map(function (item) {
        if (Array.isArray(item)) {
            return createObject(item);
        }
        return item;
    });

    var _array = array,
        _array2 = _toArray(_array),
        first = _array2[0],
        rest = _array2.slice(1);

    if (typeof first == 'function') {
        return new (Function.prototype.bind.apply(first, [null].concat(_toConsumableArray(rest))))();
    } else {
        throw new Error(first + ' must be a function');
    }
}

function observerExt(object) {
    return function (target) {
        return function (_Component) {
            _inherits(_class, _Component);

            function _class(props) {
                _classCallCheck(this, _class);

                var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

                _this.newProps = Object.assign({}, props);
                Object.keys(object).forEach(function (key) {
                    if (Array.isArray(object[key])) {
                        _this.newProps[key] = createObject(object[key]);
                    } else {
                        _this.newProps[key] = new object[key]();
                    }
                });
                return _this;
            }

            _createClass(_class, [{
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps, nextState) {
                    Object.assign(this.newProps, nextProps);
                }
            }, {
                key: 'render',
                value: function render() {
                    var observerTarget = (0, _mobxReact.observer)(target);
                    return _react2.default.createElement(observerTarget, this.newProps);
                }
            }]);

            return _class;
        }(_react.Component);
    };
}

module.exports = { observerExt: observerExt };