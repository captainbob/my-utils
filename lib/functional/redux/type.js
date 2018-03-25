'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.type = type;
var prefixType = exports.prefixType = '@@__fjs.redux.action.type__@@';

function type(t) {
    return prefixType + t;
}