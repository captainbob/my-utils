import { curry } from 'ramda';

const handlePromise= curry(function(handleResolve, handleReject, promise) {
    return new Promise((resolve, reject) => {
        promise.then(response => {
            resolve(handleResolve(response));
        }).catch(err => {
            reject(handleReject(err));
        });
    });
});

export default handlePromise;