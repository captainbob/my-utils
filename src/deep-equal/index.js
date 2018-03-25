import { isArray, isArrayLike, isMap, isObject } from 'lodash';

export function deepEqual(a, b) {
    if (a === null && b === null)
        return true;
    if (a === undefined && b === undefined)
        return true;
    if (typeof a !== "object")
        return a === b;
    const aIsArray = isArrayLike(a);
    const aIsMap = isMap(a);
    if (aIsArray !== isArrayLike(b)) {
        return false;
    } else if (aIsMap !== isMap(b)) {
        return false;
    } else if (aIsArray) {
        if (a.length !== b.length)
            return false;
        for (let i = a.length - 1; i >= 0; i--)
            if (!deepEqual(a[i], b[i]))
                return false;
        return true;
    } else if (aIsMap) {
        if (a.size !== b.size)
            return false;
        let equals = true;
        a.forEach((value, key) => {
            equals = equals && deepEqual(b.get(key), value);
        });
        return equals;
    } else if (typeof a === "object" && typeof b === "object") {
        if (a === null || b === null)
            return false;
        if (getEnumerableKeys(a).length !== getEnumerableKeys(b).length)
            return false;
        for (let prop in a) {
            if (!(prop in b))
                return false;
            if (!deepEqual(a[prop], b[prop]))
                return false;
        }
        return true;
    }
    return false;
}
export function getEnumerableKeys(obj) {
    const res = [];
    for (let key in obj)
        res.push(key);
    return res;
}