import React, { Component } from 'react'
import { observer } from 'mobx-react'

//[a, [b, c], d]
// new a(new b(c), d)
function createObject(array) {
    if (!Array.isArray(array) || array.length == 0) {
        return undefined;
    }
    array = array.map(item => {
        if (Array.isArray(item)) {
            return createObject(item);
        }
        return item;
    });
    const [first, ...rest] = array;
    if (typeof first == 'function') {
        return new first(...rest);
    } else {
        throw new Error(`${first} must be a function`);
    }
}

function observerExt(object) {
    return function (target) {
        return class extends Component {
            constructor(props) {
                super(props);
                this.newProps = Object.assign({}, props);
                Object.keys(object).forEach(key => {
                    if (Array.isArray(object[key])) {
                        this.newProps[key] = createObject(object[key]);
                    } else {
                        this.newProps[key] = new object[key]();
                    }
                })
            }

            componentWillReceiveProps(nextProps, nextState) {
                Object.assign(this.newProps, nextProps);
            }

            render() {
                const observerTarget = observer(target);
                return React.createElement(observerTarget, this.newProps);
            }
        }
    }
}

module.exports = { observerExt }