import { Http } from '../http'
import { deprecate } from 'core-decorators';

class HttpClient {
    setMockJson = (json) => {
        return Http.setMockJson(json);
    }

    promiseGet(url, params, headers) {
        return Http.promiseGet(url, params, headers);
    }

    promisePost(url, params, headers) {
        return Http.promisePost(url, params, headers);
    }

    promiseAjax(url, options) {
        return Http.promiseAjax(url, options);
    }

    ajax(url, options) {
        return Http.ajax(url, options);
    }

    @deprecate
    promisePostEncode(url, params, headers) {
        return Http.promisePost(url, params, headers);
    }

    @deprecate
    get(url, params, headers) {
        params = {
            _options: {
                deconstructResultObject: false
            },
            ...(params || {})
        }
        return Http.promiseGet(url, params, headers);
    }

    @deprecate
    getEncode(url, params, headers) {
        params = {
            _options: {
                deconstructResultObject: false
            },
            ...(params || {})
        }
        return Http.promiseGet(url, params, headers);
    }

    @deprecate
    post(url, params, headers) {
        params = {
            _options: {
                deconstructResultObject: false
            },
            ...(params || {})
        }
        return Http.promisePost(url, params, headers);
    }

    @deprecate
    postEncode(url, params, headers) {
        params = {
            _options: {
                deconstructResultObject: false
            },
            ...(params || {})
        }
        return Http.promisePost(url, params, headers);
    }
}

HttpClient = new HttpClient();

export default HttpClient;