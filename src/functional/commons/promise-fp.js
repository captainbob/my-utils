import isPromise from '../redux/redux-promise-middleware/is-promise';
const { curry, compose, map } = require('ramda');

Promise.prototype['fantasy-land/map'] = function (fn) {
    return new Promise((resolve, reject) => {
        this.then(compose(resolve, fn)).catch(reject);
    });
}

Promise.of = function (callback) {
    return new Promise(callback);
}

Promise.prototype['fantasy-land/ap'] = function (promiseApplyF) {
    if (!isPromise(promiseApplyF)) {
        throw new Error('Promise ap only accept Promise type arguments')
    }
    return new Promise((resolve, reject) => {
        promiseApplyF.then(func => {
            this.map(func).then(resolve).catch(reject);
        }).catch(reject);
    });
}