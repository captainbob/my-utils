import { curry, compose } from 'ramda';
import action from './action';
import {type} from './type';

const dispatch = curry((dispatch, actionType, payload) => {
    return compose(dispatch, action(type(actionType)))(payload);
});

export default dispatch;