/*
 * @Author: ziteng.紫藤 
 * @Date: 2017-04-08 15:38:47 
 * @Last Modified by: ziteng,紫藤
 * @Last Modified time: 2017-05-03 14:31:39
 */

import { Component } from 'react'

const RefreshFlag = '___view_model_refresh_flag___'

class ViewModel {
    constructor(context) {
        if (context instanceof Component) {
            this.context = context
            // if (this.context.state) {
            //     Object.assign(this.context.state, { ___view_model_refresh_flag___: false })
            // } else {
            //     this.context.state = {
            //         ___view_model_refresh_flag___: false
            //     }
            // }
        } else {
            throw new Error('the context must be instance of React.Component')
        }
    }

    forceUpdate() {
        this.context.forceUpdate()
        //this.context.setState({ ___view_model_refresh_flag___: !this.context.state.___view_model_refresh_flag___ })
    }

    setProperties(properties) {
        Object.assign(this, properties)
        this.forceUpdate()
    }
}

module.exports = ViewModel