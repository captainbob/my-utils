import { curry } from 'ramda';

const pending = curry(function pending(key, state, action) {
    return Object.assign({}, state, {[key]: true});
})

const reject = curry(function reject(message, key, state, action) {
    if (message && typeof message.error == 'function') {
        message.error(`${action.payload}`, 3);
    }
    return Object.assign({}, state, { [key]: false });
})

export default function asyncManager(message, key = 'isLoading') {
    return function(f, p = pending(key), r = reject(message, key)) {
        return function(state, action, status) {
            if (status == 'PENDING') {
                return p(state, action);
            } else if (status == 'REJECTED') {
                return r(state, action);
            } else if (status == 'FULFILLED') {
                return f(state, action);
            }
            throw new Error('----错误的status编码----');
        }
    }
}