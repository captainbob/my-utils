import HttpDelayQueue from './http-delay-queue';
import HttpSerialQueue from './http-serial-queue';
import HttpConcurrentQueue from './http-concurrent-queue';

class HttpQueue {
    delay(delay, latest = true, delta = -1) {
        return new HttpDelayQueue(delay, latest, delta);
    }

    concurrent() {
        return HttpConcurrentQueue;
    }

    serial() {
        return new HttpSerialQueue();
    }
}

HttpQueue = new HttpQueue();

export default HttpQueue;