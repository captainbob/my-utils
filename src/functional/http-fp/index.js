import { Http } from 'djmodules-utils/lib/http';
import commons from '../commons';
require('../commons/promise-fp');

const { curry, componse, map } = require('ramda');

const NETWORK_ERROR_MESSAGE = '网络请求错误，请刷新重试或稍后重试';
const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_POST = 'POST';
const HTTP_STATUS_SUCCESS = 'success';


const API_ERROR = 'API_ERROR';
const UNKNOW_ERROR = 'UNKNOW_ERROR';

class HttpError {
    constructor(type, error) {
        this.type = type;
        this.error = error || {};
    }

    get message() {
        return this.error.message || this.error.exceptionMessage || NETWORK_ERROR_MESSAGE;
    }

    valueOf() {
        return this.message;
    }

    toString() {
        return this.message;
    }
}

const handleError = curry((apiErrorHandler, unknowErrorHandler, error) => {
    if (error instanceof HttpError) {
        return error.type === API_ERROR ? apiErrorHandler(error.error) : unknowErrorHandler(error.error);
    } else {
        return unknowErrorHandler(error);
    }
});

const ajax = curry((url, options) => {
    return new Promise((resolve, reject) => {
        Http.ajax(url, options).then(response => {
            if (response.status === HTTP_STATUS_SUCCESS) {
                resolve(response);
            } else {
                reject(new HttpError(API_ERROR, response));
            }
        }).catch(err => {
            reject(new HttpError(UNKNOW_ERROR, err));
        });
    });
});

const get = curry((url, params) => {
    return ajax(url, {
        method: HTTP_METHOD_GET,
        data: params
    });
});

const post = curry((url, params) => {
    return ajax(url, {
        method: HTTP_METHOD_POST,
        data: params
    });
});

const resultObject = function (defaultValue) {
    return commons.safeProp(defaultValue, [null, undefined], 'resultObject');
}

module.exports = {
    ajax,
    get,
    post,
    resultObject,
    handleError
}
