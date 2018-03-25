import DataProvider from './data-provider'
import { HttpUtil } from '../http-utils'

export default class BaseDataProvider extends DataProvider {

    constructor(url, options, error) {
        super()
        this.url = url;
        this.options = options;
        this.error = error;
    }

    getData(success, error) {
        HttpUtil.ajax(this.url, this.options).then(response => {
            if (typeof success == 'function') {
                success(response)
            }
        }).catch(err => {
            error = error || this.error;
            if (typeof error == 'function') {
                error(err)
            }
        })
    }
}