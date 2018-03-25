import { HttpQueue } from '../http-queue';

function deconstructResultObject(promise) {
    return new Promise((resolve, reject) => {
        promise.then(response => {
            if (response.status == 'success') {
                resolve(response.resultObject, response);
            } else {
                reject(response);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

const TIMEOUT_MILLI_SECONDS = 60000;

class Http {
    setMockJson = (json) => {
        this.mockJson = json;
    }

    promisePost(url, params, headers) {
        return this._request('POST', url, params || {}, headers || {});
    }

    promiseGet(url, params, headers) {
        return this._request('GET', url, params || {}, headers || {});
    }

    promiseAjax(url, options) {
        options = Object.assign({
            timeout: TIMEOUT_MILLI_SECONDS,
            deconstructResultObject: true,
            checkResponse: true
        }, options || {});
        return this.ajax(url, options);
    }

    ajax(url, options) {
        if (options.checkResponse && options.deconstructResultObject) {
            const promise = this._ajax(url, options);
            return deconstructResultObject(promise);
        }
        return this._ajax(url, options);
    }

    _ajax(url, options) {
        return HttpQueue.concurrent().enqueue(url, options, this.mockJson);
    }

    _request(method, url, params, headers) {
        const { _options, ...otherParams } = params;
        const options = Object.assign({
            timeout: TIMEOUT_MILLI_SECONDS,
            deconstructResultObject: true,
            checkResponse: true
        }, _options);
        return this.ajax(url, {
            method: method,
            data: otherParams,
            headers: headers,
            ...options
        });
    }
}

Http = new Http();

export default Http;