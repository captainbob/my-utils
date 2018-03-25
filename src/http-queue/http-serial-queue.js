
import HttpRequest from './http-request';
import HttpConcurrentQueue from './http-concurrent-queue';

const MAX_SIZE = 1;
let idGenerator = 0;

export default class HttpSerialQueue {
    constructor() {
        this.queue = [];
        this.size = 0;
    }

    enqueue = (url, options, mockJson) => {
        return new Promise((resolve, reject) => {
            this.queue.push({
                id: ++idGenerator,
                url: url,
                options: options,
                resolve: resolve,
                reject: reject,
                mockJson: mockJson
            });
            this._startRequest();
        });
    }

    _removeFromQueue = (id) => {
        const length = this.queue.length;
        this.queue = this.queue.filter(item => {
            return item.id != id;
        });
    }

    _requestComplete = () => {
        this.size = this.size - 1;
        if (this.size < 0) {
            this.size = 0;
        }
    }

    _startRequest = () => {
        if (this.size < MAX_SIZE && this.queue && this.queue.length > 0) {
            this.size = this.size + 1;
            const firstHttpAction = this.queue[0];
            this._removeFromQueue(firstHttpAction.id);
            HttpConcurrentQueue.enqueue(firstHttpAction.url, firstHttpAction.options, firstHttpAction.mockJson).then(response => {
                this._requestComplete();
                firstHttpAction.resolve(response);
                this._startRequest();
            }).catch(err => {
                this._requestComplete();
                firstHttpAction.reject(err);
                this._startRequest();
            });
        }
    }
}