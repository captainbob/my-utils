import URLSearchParams from 'url-search-params';
import fetch from 'isomorphic-fetch';
import Log4Js from '../log4js';
import uuid from '../uuid';
import HttpEventManager from './http-event-manager';
const TIMEOUT_MILLI_SECONDS = 60000;

function reportError(requestId, url, param, message, errMessage) {
    Log4Js.init(window.version || '1.0.0');
    Log4Js.error({
        requestPath: url,
        traceid: requestId,
        param: param,
        message: message,
        errMessage: errMessage
    });
}

function debug(message) {
    console.log(`%c${message}`, 'background:yellow;color:black');
}

class HttpRequest {
    ajax = (url, options, mockJson) => {
        const defaultOptions = {
            credentials: 'same-origin',
            checkResponse: true,
            rewriteUrl: true
        }
        options = Object.assign({}, defaultOptions, options);
        if (options.rewriteUrl) {
            url = this._processUrl(options, url);
        }
        return new Promise((resolve, reject) => {
            if (mockJson) {
                const key = `${(options.method || 'POST').toUpperCase()} ${url}`;
                const value = mockJson[key];
                debug(key);
                debug('params: ' + JSON.stringify(options.data || {}));
                if (value) {
                    if (typeof value == 'function') {
                        const request = {
                            query: options.data,
                            params: options.data
                        };
                        const response = {
                            end: (responseJson) => {
                                debug('response: ' + responseJson || "{}");
                                resolve(JSON.parse(responseJson));
                            }
                        };
                        value(request, response);
                    } else {
                        debug('response: ' + JSON.stringify(value || {}));
                        resolve(value);
                    }
                } else {
                    debug('response: ' + JSON.stringify({ error: '_not_found', message: '404' }));
                    reject({ error: '_not_found', message: '404' });
                }
                return;
            }
            let timer = null;
            const clearTimer = () => {
                if (timer != null) {
                    clearTimeout(timer);
                }
            }
            if (typeof options.timeout == 'undefined') {
                options.timeout = TIMEOUT_MILLI_SECONDS;
            }
            if (options.timeout > 0) {
                timer = setTimeout(function () {
                    clearTimer();
                    reject({ status: '_timeout', message: '请求超时' });
                }, options.timeout);
            }
            const searchParams = new URLSearchParams();
            const { data, headers = {}, method, timeout, nors, urlSuffix, deconstructResultObject, ...otherOptions } = options;

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
            }
            const traceId = uuid.get();
            headers['Traceid'] = traceId;
            headers['X-Requested-With'] = 'XMLHttpRequest';
            const contentType = headers['Content-Type'];

            const requestOptions = {
                ...otherOptions,
                method: (method || 'POST').toUpperCase(),
                headers: headers
            }

            if (requestOptions.method == 'POST') {
                const body = this._parseBody(contentType, data || {});
                Object.assign(requestOptions, { body: body });
            } else if (requestOptions.method == 'GET') {
                const searchParams = new URLSearchParams();
                Object.keys(data || {}).forEach(key => {
                    if (!this._isEmpty(data[key])) {
                        searchParams.append(key, data[key]);
                    }
                });
                url = `${url}?${searchParams.toString()}`;
            }

            fetch(url, requestOptions).then(response => {
                if (response.ok) {
                    response.json().then(responseJson => {
                        clearTimer();
                        
                        //add http status code to response
                        Object.assign(responseJson, {
                            httpStatus: response.status
                        });

                        if (options.checkResponse && responseJson.status != 'success') {
                            if (responseJson.exceptionLevel == 'ERROR') {
                                reportError(traceId, url, data, responseJson.message, responseJson.exceptionMessage);
                                responseJson = Object.assign({}, responseJson, { traceid: traceId })
                            }
                        }

                        if (responseJson.status == HttpEventManager.LOGIN_TIMEOUT) {
                            HttpEventManager.emit(HttpEventManager.LOGIN_TIMEOUT, responseJson);
                        } else if (responseJson.status == HttpEventManager.ERROR_VERSION) {
                            HttpEventManager.emit(HttpEventManager.ERROR_VERSION, responseJson);
                        }

                        if (response.status == 201) {
                            HttpEventManager.emit(HttpEventManager.CUSTOM_ERROR_VERSION, {
                                url: url,
                                status: response.status 
                            });
                        }

                        resolve(responseJson);
                    }).catch(err => {
                        clearTimer();
                        reportError(traceId, url, data, response.statusText, '服务器返回格式错误');
                        reject({
                            message: '服务器返回格式错误',
                            status: '_server_error',
                            traceid: traceId
                        });
                    });
                } else {
                    clearTimer();
                    reportError(traceId, url, data, response.statusText, response.responseText)
                    reject({
                        message: response.statusText,
                        status: response.status,
                        traceid: traceId
                    });
                }
            }).catch(err => {
                clearTimer();
                err = Object.assign({}, err, { status: '_net_work_error', traceid: traceId })
                reportError(traceId, url, data, err.message, '')
                reject(err);
            });
        });
    }

    _isEmpty = (value) => {
        if (value === undefined || value === null) {
            return true;
        }
        return false;
    }

    _parseBody = (contentType, data) => {
        contentType = contentType.split(';')[0];
        switch (contentType) {
            case 'application/x-www-form-urlencoded':
                const searchParams = new URLSearchParams();
                Object.keys(data || {}).forEach(key => {
                    if (!this._isEmpty(data[key])) {
                        searchParams.append(key, data[key]);
                    }
                });
                return searchParams.toString();
            case 'application/json':
                return JSON.stringify(data);
            case 'multipart/form-data':
                const formData = new FormData();
                Object.keys(data || {}).forEach(key => {
                    if (!this._isEmpty(data[key])) {
                        formData.append(key, data[key]);
                    }
                });
                return formData;
        }
    }

    _processUrl = (options, url) => {
        if (options.noProcessUrl) {
            return url
        }
        if (url.startsWith("/rs/")) {
            url = _path + url;
        } else {
            if (options.nors === true) {
                url = _path + '/' + url;
            } else {
                url = _path + '/rs/' + url;
            }
        }

        if (!url.endsWith('.do')) {
            if (options.urlSuffix) {
                url += options.urlSuffix
            } else {
                url += '.do'
            }
        }
        return url;
    }
}


HttpRequest = new HttpRequest();

export default HttpRequest;