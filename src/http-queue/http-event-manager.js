import Emitter from 'events';

class HttpEventManager {

    LOGIN_TIMEOUT = 'timeout';

    ERROR_VERSION = 'error_version';

    CUSTOM_ERROR_VERSION = 'custom_error_version';

    constructor() {
        this.emitter = new Emitter();
        this.emitter.setMaxListeners(5);
    }

    on(eventName, listener) {
        this.emitter.on(eventName, listener);
    }

    emit(eventName, data) {
        this.emitter.emit(eventName, data);
    }

    removeAllListeners(eventName) {
        this.emitter.removeAllListeners(eventName);
    }

    removeListener(eventName, listener) {
        this.emitter.removeListener(eventName, listener);
    }
} 

const instance = new HttpEventManager();

export default instance;