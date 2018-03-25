import DataProvider from './data-provider'

export default class CachedBaseDataProvider extends DataProvider {
    constructor(provider) {
        super()
        this.proxy = provider
        this.isRunning = false
        this.queue = []
        this.cache = null
    }

    clearCache() {
        this.cache = null
    }

    getData(success, error) {
        if (!this.isRunning) {
            this.isRunning = true
            if (this.cache) {
                this.isRunning = false
                success(this.cache)
                this._invokeQueueCallbacks('success', this.cache)
            } else {
                this.proxy.getData((response) => {
                    this.cache = response
                    this.isRunning = false
                    if (typeof success == 'function') {
                        success(response)
                    }
                    this._invokeQueueCallbacks('success', response)
                }, (err) => {
                    this.isRunning = false
                    if (typeof error == 'function') {
                        error(err)
                    }
                    this._invokeQueueCallbacks('error', err)
                })
            }
        } else {
            this.queue.push({ success: success, error: error })
        }
    }

    _invokeQueueCallbacks(type, data) {
        if (type == 'success') {
            this.queue.forEach(callback => {
                if (typeof callback.success == 'function') {
                    callback.success(data)
                }
            })
        } else {
            this.queue.forEach(callback => {
                if (typeof callback.error == 'function') {
                    callback.error(data)
                }
            })
        }
        this.queue = []
    }
}