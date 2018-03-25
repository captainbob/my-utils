'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var handlePromise = (0, _ramda.curry)(function (handleResolve, handleReject, promise) {
    return new Promise(function (resolve, reject) {
        promise.then(function (response) {
            resolve(handleResolve(response));
        }).catch(function (err) {
            reject(handleReject(err));
        });
    });
});

exports.default = handlePromise;