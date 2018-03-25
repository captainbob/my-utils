import { curry } from 'ramda';

const action = curry((type, body) => {
    if(body && typeof body.payload != 'undefined') {
        const {payload, ...properties} = body;
        return {
            type,
            payload,
            ...properties
        }
    } else {
        return {
            type,
            payload: body
        }
    }
});

export default action;