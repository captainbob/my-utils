'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxPromiseMiddleware = require('./redux-promise-middleware');

var _reduxPromiseMiddleware2 = _interopRequireDefault(_reduxPromiseMiddleware);

var _ramda = require('ramda');

var _type = require('./type');

var _dispatch2 = require('./dispatch');

var _dispatch3 = _interopRequireDefault(_dispatch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var storeKey = '__fjs_redux_store__';

function mapStateToProps(state) {
    return {
        state: state
    };
}

var defaultOptions = {
    middlewares: [(0, _reduxPromiseMiddleware2.default)()],
    storeKey: storeKey
};

var wrapActions = function wrapActions(actions) {
    if (typeof actions != 'function') {
        throw new Error('actions must be a function: function(dispatch) { ... }');
    }
    return function (dispatch) {
        var _dispatch = (0, _ramda.curry)(function (actionType, payload) {
            return new Promise(function (resolve, reject) {
                (0, _dispatch3.default)(dispatch, actionType, {
                    payload: payload,
                    resolve: resolve,
                    reject: reject
                });
            });
        });
        var sendAction = (0, _ramda.curry)(function (actionType, payload) {
            console.warn('sendAction will remove in the future, please use dispatch');
            return _dispatch(actionType, payload);
        });
        dispatch.sendAction = sendAction;
        dispatch.dispatch = _dispatch;
        return {
            actions: actions(dispatch)
        };
    };
};

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
};

var Provider = (0, _reactRedux.createProvider)(storeKey);

var wrapReducer = (0, _ramda.curry)(function (reducer, state, action) {
    if (action.type == '@@redux/INIT') {
        return reducer(state, action);
    } else {
        if (action.type.startsWith(_type.prefixType)) {
            action.type = action.type.replace(_type.prefixType, '');

            var resolve = action.resolve,
                reject = action.reject,
                realAction = _objectWithoutProperties(action, ['resolve', 'reject']);

            var newState = reducer(state, realAction);
            setTimeout(function () {
                if (action.type) {
                    if (action.type.endsWith('_FULFILLED')) {
                        if (resolve) {
                            resolve(newState);
                        }
                    } else if (action.type.endsWith('_REJECTED')) {
                        if (reject) {
                            reject(realAction.payload);
                        }
                    } else {
                        if (resolve) {
                            resolve(newState);
                        }
                    }
                }
            }, 0);
            return newState;
        }
        throw new Error('Invalid action, did you call dispatch ?');
    }
});

function provide() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

    return (0, _ramda.curry)(function (actions, reducer, target) {

        return function (_Component) {
            _inherits(_class, _Component);

            function _class(props) {
                _classCallCheck(this, _class);

                var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

                _this.controller = (0, _reactRedux.connect)(mapStateToProps, wrapActions(actions), mergeProps, (0, _ramda.omit)(['middlewares'], Object.assign({}, options)))(target);
                var middlewares = Array.from(options.middlewares) || [];
                _this.store = _redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares))(_redux.createStore)(wrapReducer(reducer));
                return _this;
            }

            _createClass(_class, [{
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(
                        Provider,
                        { store: this.store },
                        _react2.default.createElement(this.controller, this.props)
                    );
                }
            }]);

            return _class;
        }(_react.Component);
    });
}

exports.default = provide;