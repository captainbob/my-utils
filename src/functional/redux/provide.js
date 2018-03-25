import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { createProvider, connect } from 'react-redux';
import promiseMiddleware from './redux-promise-middleware';
import { curry, omit, reduce } from 'ramda';
import { prefixType } from './type';
import dispatchFp from './dispatch';
import isPromise from './redux-promise-middleware/is-promise';

const storeKey = '__fjs_redux_store__';

function mapStateToProps(state) {
    return {
        state: state
    };
}

const defaultOptions = {
    middlewares: [promiseMiddleware()],
    storeKey: storeKey
}

const wrapActions = function (actions) {
    if (typeof actions != 'function') {
        throw new Error('actions must be a function: function(dispatch) { ... }');
    }
    return function (dispatch) {
        const _dispatch = curry(function(actionType, payload) {
            return new Promise((resolve, reject) => {
                if (typeof actionType == 'string') {
                    dispatchFp(dispatch, actionType, {
                        payload: payload,
                        resolve,
                        reject
                    });
                } else if (typeof actionType == 'function') {
                    dispatchFp(dispatch, '@@__action_type_function__@@', {
                        payload,
                        resolve,
                        reject,
                        _reducer: actionType
                    });
                } else {
                    throw new Error("action type must be string or function(state, action, status)");
                }
            });
        });
        const sendAction = curry(function(actionType, payload) {
            console.error('sendAction will be removed in the future, please use dispatch instead');
            return _dispatch(actionType, payload);
        });
        dispatch.sendAction = sendAction;
        dispatch.dispatch = _dispatch;
        return {
            actions: actions(dispatch)
        }
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

const Provider = createProvider(storeKey);


const wrapReducer = curry(function (reducer, state, action) {
    if (action.type == '@@redux/INIT') {
        return reducer(state, action);
    } else {
        if (action.type.startsWith(prefixType)) {
            action.type = action.type.replace(prefixType, '');
            const doPromise = (action, newState, realAction, resolve, reject) => {
                setTimeout(() => {
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
            }
            if (action.type.startsWith('@@__action_type_function__@@')) {
                const { resolve, reject, _reducer, ...realAction } = action;
                let newState = {};
                if(action.type.endsWith('_PENDING')) {
                    newState = _reducer(state, realAction, 'PENDING');
                } else if(action.type.endsWith('_FULFILLED')) {
                    newState = _reducer(state, realAction, 'FULFILLED');
                } else if(action.type.endsWith("_REJECTED")) {
                    newState = _reducer(state, realAction, 'REJECTED');
                } else {
                    newState = _reducer(state, realAction, false);
                }
                doPromise(action, newState, realAction, resolve, reject);
                return newState;
            } else {
                const { resolve, reject, ...realAction } = action;
                const newState = reducer(state, realAction);
                doPromise(action, newState, realAction, resolve, reject);
                return newState;
            }  
        }
        throw new Error('Invalid action, did you call dispatch ?');
    }
});

function provide(options = defaultOptions) {
    return curry((actions, reducer, target) => {
        return class extends Component {
            constructor(props) {
                super(props);
                this.controller = connect(mapStateToProps, wrapActions(actions), mergeProps, omit(['middlewares'], Object.assign({}, options)))(target);
                const middlewares = Array.from(options.middlewares) || [];
                this.store = applyMiddleware(...middlewares)(createStore)(wrapReducer(reducer));
            }

            render() {
                return <Provider store={this.store}>
                    {
                        React.createElement(this.controller, this.props)
                    }
                </Provider>
            }
        }
    });
}

export default provide;