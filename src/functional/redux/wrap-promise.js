import {curry} from 'ramda';

const wrapPromise = curry(function(data, promise) {
    return {
        data,
        promise
    }
})

export default wrapPromise;