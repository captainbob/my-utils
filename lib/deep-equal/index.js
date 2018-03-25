"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.deepEqual = deepEqual;
exports.getEnumerableKeys = getEnumerableKeys;

var _lodash = require("lodash");

function deepEqual(a, b) {
    if (a === null && b === null) return true;
    if (a === undefined && b === undefined) return true;
    if ((typeof a === "undefined" ? "undefined" : _typeof(a)) !== "object") return a === b;
    var aIsArray = (0, _lodash.isArrayLike)(a);
    var aIsMap = (0, _lodash.isMap)(a);
    if (aIsArray !== (0, _lodash.isArrayLike)(b)) {
        return false;
    } else if (aIsMap !== (0, _lodash.isMap)(b)) {
        return false;
    } else if (aIsArray) {
        if (a.length !== b.length) return false;
        for (var i = a.length - 1; i >= 0; i--) {
            if (!deepEqual(a[i], b[i])) return false;
        }return true;
    } else if (aIsMap) {
        if (a.size !== b.size) return false;
        var equals = true;
        a.forEach(function (value, key) {
            equals = equals && deepEqual(b.get(key), value);
        });
        return equals;
    } else if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === "object" && (typeof b === "undefined" ? "undefined" : _typeof(b)) === "object") {
        if (a === null || b === null) return false;
        if (getEnumerableKeys(a).length !== getEnumerableKeys(b).length) return false;
        for (var prop in a) {
            if (!(prop in b)) return false;
            if (!deepEqual(a[prop], b[prop])) return false;
        }
        return true;
    }
    return false;
}
function getEnumerableKeys(obj) {
    var res = [];
    for (var key in obj) {
        res.push(key);
    }return res;
}