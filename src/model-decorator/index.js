// 判断是不是 array
export function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
export function modelOrg(clazz) {
    return function (target, name, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = function () {
            return new Promise((resolve, reject) => {
                oldValue.apply(target, arguments).then((response) => {
                    if (!response) {
                        return resolve(response);
                    }
                    if (response.pagination) {
                        let resResults = response.results || []
                        return resolve({
                            ...response,
                            results: resResults.map(function (v) {
                                return new clazz(v)
                            })
                        })
                    } else if (isArray(response)) {
                        return resolve(response.map(function (v) {
                            return new clazz(v)
                        }))
                    } else {
                        return resolve(new clazz(response))
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}

export function wrapper(target) {
    let key = 0;
    return class extends target {
        constructor(result) {
            super(result);
            this.$source = result;
            this.$keyId = ++key;
        }

    }
}
export function addAlias(sourceParam) {
    return function (target, name, descriptor) {
        const newDescriptor = {
            enumerable: true,
            configurable: true,
            get: function () {
                return _.get(this.$source, sourceParam, undefined)
            },
            set: function (v) {
                return _.set(this.$source, sourceParam, v)
            }
        };
        Object.defineProperty(target, name, newDescriptor);
        return newDescriptor;
    }
}
export toFixed from './toFixed';