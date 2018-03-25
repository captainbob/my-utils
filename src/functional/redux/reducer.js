
const CACHE_KEY = '@@_reducer_cache_@@';

const TYPE_ERROR = 'action type can only be string';

export default function reducer(initState) {
    function myReducer(state, action) {
        const func = myReducer[CACHE_KEY][action.type];
        let newState = state;
        if (typeof func == 'function') {
            newState = func(state, action);
        }
        if (typeof newState == 'undefined' || newState === null) {
            return initState;
        }
        return newState;
    }

    myReducer[CACHE_KEY] = {};

    myReducer.use = function(actionType, func) {
        if (Array.isArray(actionType)) {
            actionType.forEach(act => {
                if (typeof act == 'string') {
                    myReducer[CACHE_KEY][act] = func;
                } else {
                    throw new Error(TYPE_ERROR);
                }
            });
        } else if (typeof actionType == 'string') {
            myReducer[CACHE_KEY][actionType] = func;
        } else {
            throw new Error(TYPE_ERROR);
        }
    }

    return myReducer;
}