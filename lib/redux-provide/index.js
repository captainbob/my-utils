'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxPromiseMiddleware = require('redux-promise-middleware');

var _reduxPromiseMiddleware2 = _interopRequireDefault(_reduxPromiseMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function mapStateToProps(state) {
    return {
        state: state
    };
}

var defaultOptions = {
    mapStateToProps: mapStateToProps,
    defaultMiddlewares: [(0, _reduxPromiseMiddleware2.default)()],
    middlewares: []
};

var wrapActions = function wrapActions(actions) {
    return function (dispatch) {
        return {
            actions: actions(dispatch)
        };
    };
};

function reduxProvide(actions, reducer) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOptions;

    return function (target) {
        var controller = (0, _reactRedux.connect)(options.mapStateToProps, wrapActions(actions))(target);
        var middlewares = Array.from(options.defaultMiddlewares) || [];
        middlewares.push.apply(middlewares, _toConsumableArray(options.middlewares));
        var store = _redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares))(_redux.createStore)(reducer);
        return function (_Component) {
            _inherits(_class, _Component);

            function _class() {
                _classCallCheck(this, _class);

                return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
            }

            _createClass(_class, [{
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(
                        _reactRedux.Provider,
                        { store: store },
                        _react2.default.createElement(controller)
                    );
                }
            }]);

            return _class;
        }(_react.Component);
    };
}

module.exports = reduxProvide;