'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Author: ziteng.紫藤 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Date: 2017-04-08 15:38:47 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Last Modified by: ziteng,紫藤
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Last Modified time: 2017-05-03 14:31:39
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RefreshFlag = '___view_model_refresh_flag___';

var ViewModel = function () {
    function ViewModel(context) {
        _classCallCheck(this, ViewModel);

        if (context instanceof _react.Component) {
            this.context = context;
            // if (this.context.state) {
            //     Object.assign(this.context.state, { ___view_model_refresh_flag___: false })
            // } else {
            //     this.context.state = {
            //         ___view_model_refresh_flag___: false
            //     }
            // }
        } else {
            throw new Error('the context must be instance of React.Component');
        }
    }

    _createClass(ViewModel, [{
        key: 'forceUpdate',
        value: function forceUpdate() {
            this.context.forceUpdate();
            //this.context.setState({ ___view_model_refresh_flag___: !this.context.state.___view_model_refresh_flag___ })
        }
    }, {
        key: 'setProperties',
        value: function setProperties(properties) {
            Object.assign(this, properties);
            this.forceUpdate();
        }
    }]);

    return ViewModel;
}();

module.exports = ViewModel;