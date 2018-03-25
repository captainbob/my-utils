import { curry, prop } from 'ramda';

const safeProp = curry((defaultValue, values, key, item) => {
    item = item ? item : {}
    const keys = key.split('.');
    let p = undefined;

    for (let i = 0; i < keys.length && item; i++) {
        p = item[keys[i]];
        item = p;
    }

    for (let i = 0; i < values.length; i++) {
        if (p === values[i])
            return defaultValue;
    }
    return p;
});

export default safeProp;