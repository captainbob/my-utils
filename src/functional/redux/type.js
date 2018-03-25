export const prefixType = '@@__fjs.redux.action.type__@@';

export function type(t) {
    return prefixType + t;
}