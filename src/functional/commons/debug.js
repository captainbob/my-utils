import { curry } from 'ramda';

const debug = curry((tag, item) => {
    console.log(tag + item);
    return item;
});

export default debug;