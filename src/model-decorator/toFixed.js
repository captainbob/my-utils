import { decorate } from './utils';
import { toNumber } from 'lodash';
const DEFAULT_FIXED_N = 2;

function handleDescriptor(target, key, descriptor, [n = DEFAULT_FIXED_N]) {

    return {
        ...descriptor,
        get: function () {
            let value = descriptor.get.call(this);
            value = toNumber(value).toFixed(n)
            return value
        },
    };
}

// toFixed这个值
export default function toFixed(...args) {
    return decorate(handleDescriptor, args);
}