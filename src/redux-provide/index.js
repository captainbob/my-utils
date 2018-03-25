import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';

function mapStateToProps(state) {
    return {
        state: state
    };
}

const defaultOptions = {
    mapStateToProps: mapStateToProps,
    defaultMiddlewares: [promiseMiddleware()],
    middlewares: []
}

const wrapActions = function (actions) {
    return function (dispatch) {
        return {
            actions: actions(dispatch)
        }
    }
}

function reduxProvide(actions, reducer, options = defaultOptions) {
    return function (target) {
        const controller = connect(options.mapStateToProps, wrapActions(actions))(target);
        const middlewares = Array.from(options.defaultMiddlewares) || [];
        middlewares.push(...options.middlewares)
        const store = applyMiddleware(...middlewares)(createStore)(reducer);
        return class extends Component {
            render() {
                return <Provider store={store}>
                    {
                        React.createElement(controller)
                    }
                </Provider>
            }
        }
    }
}

module.exports = reduxProvide;