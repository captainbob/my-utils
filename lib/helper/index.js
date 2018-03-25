'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _httpUtils = require('../http-utils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Helper = (_temp = _class = function () {
    function Helper() {
        _classCallCheck(this, Helper);
    }

    _createClass(Helper, null, [{
        key: 'isNumeric',

        /**
         * 验证数字
         * @param n 输入数字
         */
        value: function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        /*
         移动数组记录
        */

    }, {
        key: 'moveArray',
        value: function moveArray(arr, index1, index2) {
            if (Math.abs(index1 - index2) > 1) {
                arr.splice(index2, 0, arr[index1]);
                if (index1 >= index2) {
                    arr.splice(index1 + 1, 1);
                } else {
                    arr.splice(index1, 1);
                }
            } else {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            }
            return arr;
        }
        /*
        * 四舍五入
        */

    }, {
        key: 'round',
        value: function round(num, fractionDigits) {
            if (!num || isNaN(num)) {
                num = 0;
            }
            if (isNaN(fractionDigits) || fractionDigits < 0) {
                fractionDigits = 0;
            }
            return (Math.round(num * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits)).toFixed(fractionDigits);
        }
        /**
         * 
         * @param {需要处理的数据} arrData
         * @param {可计算指定obj.key} keyName
         */

    }, {
        key: 'arraySum',
        value: function arraySum(arrData, keyName) {
            if (keyName) {
                arrData = arrData.map(function (item) {
                    var keyValue = _lodash2.default.get(item, keyName);
                    if (!isNaN(parseFloat(keyValue)) && isFinite(keyValue)) {
                        return Number(keyValue);
                    } else {
                        return 0;
                    }
                });
            }
            arrData = arrData && arrData.length ? arrData : [0];
            return arrData.reduce(function (prev, current) {
                return (Number(prev) || 0) + (Number(current) || 0);
            });
        }
        //解析获取组件改变的值

    }, {
        key: 'changeValue',
        value: function changeValue(obj, excludeString, maxValue, minValue) {
            var text = '';
            if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.target) {
                text = typeof obj.target.value == 'string' ? obj.target.value : obj.target.checked;
            } else {
                text = obj;
            }
            // 排除字符
            if (excludeString && typeof excludeString !== 'number') {
                var reg = void 0;
                if (excludeString.constructor === RegExp) {
                    reg = excludeString;
                } else if (excludeString.constructor === Array) {
                    reg = new RegExp('(' + excludeString.join("|") + ')', 'g');
                } else {
                    reg = new RegExp('(' + excludeString + ')', 'g');
                }
                if (reg && text) {
                    text = text.toString().replace(reg, '');
                }
                if (maxValue && text.length > maxValue) {
                    text = text.substring(0, maxValue);
                }
            } else if (typeof excludeString === 'number') {
                var _text = String([undefined, null].indexOf(text) < 0 ? text : '');
                if (_text.length) {
                    var jian = _text.indexOf('-') === 0 ? '-' : '';
                    _text = _text.replace(/([^0-9|^.])/ig, "");
                    _text = _text.split('.');
                    text = _text.length ? Number(_text[0]) : '';
                    if (excludeString > 0) {
                        text += _text.length > 1 ? '.' + _text[1].substring(0, excludeString) : '';
                    } else if (excludeString == -1) {
                        text += _text.length > 1 ? '.' + _text[1] : '';
                    }
                    text = jian + text;
                    if (typeof maxValue === "number" && text > maxValue) {
                        text = text < maxValue ? text : maxValue;
                    }
                    if (typeof minValue === "number" && text < minValue) {
                        text = text > minValue ? text : minValue;
                    }
                } else {
                    text = '';
                }
            }
            return text;
        }
        // 设置键值 setKey(data,'key','id')，setKey(data,['key','index'],['id','要读的属性'])

    }, {
        key: 'setKey',
        value: function setKey(data, config, attrValue) {
            var children = 'children';
            if (config && config.constructor === Object) {
                children = config.children;
            }
            var keyName = []; //默认key
            config = config || 'key';
            if (typeof config === 'string' || config.constructor === Array) {
                keyName = toKeyName(config);
                if (attrValue && typeof attrValue === 'string') {
                    attrValue = toKeyName(attrValue);
                }
            } else if (config.constructor === Object) {
                keyName = toKeyName(config.keyName);
            }
            if (data && data instanceof Array) {
                data = data.map(function (item, i) {
                    keyName.forEach(function (itm, j) {
                        if (!attrValue || !attrValue.length) {
                            item[itm] = i;
                        } else if (attrValue instanceof Array) {
                            item[itm] = attrValue[j] ? item[attrValue[j]] || i : i;
                        }
                    });
                    if (item[children] && item[children] instanceof Array) {
                        item[children] = item[children].map(function (itm, j) {
                            keyName.forEach(function (iem) {
                                itm[iem] = j;
                            });
                            return itm;
                        });
                    }
                    return item;
                });
            }
            return data;
        }
        //转成数组

        // 更新对象键的值

    }, {
        key: 'ajax',

        /**
         * 此方法已被约定停止使用
         * 请自行封装到项目中
         */
        value: function ajax(url, options, returnAll) {
            // 按类型参数交换options<=>returnAll
            if (!(options instanceof Object) && options) {
                var _options = options,
                    _json = returnAll;
                _options = returnAll instanceof Object ? returnAll : {};
                _json = options;
                options = _options;
                returnAll = _json;
            }
            // 也可以设置在options中
            if (!returnAll && options instanceof Object && options.returnAll === true) {
                returnAll = true;
            }
            return new Promise(function (resolve, reject) {
                if (!options.method) {
                    options.method = "GET";
                }
                // 默认URL编码
                if (options.encode == undefined) {
                    options.encode = true;
                }
                // 关闭消息提示
                var closeMessage = void 0;
                if (options && options.closeMessage === true) {
                    closeMessage = true;
                }
                _httpUtils.HttpUtil.ajax(url, options).then(function (response) {
                    // returnAll 等于 true 或 'all' 时，返回全部JSON数据
                    var resultObject = [true, 'all'].indexOf(returnAll) >= 0 ? response : response.resultObject;
                    if (response.resultCode === 'success' || response.status === 'success') {
                        resolve(resultObject);
                    } else {
                        var message = response.exceptionMessage || response.message || '请求错误';
                        if (!closeMessage) {
                            errorMessage(message);
                        }
                        reject(message);
                    }
                }).catch(function (err) {
                    var message = '请求异常或超时：请 刷新 重试！';
                    if (!closeMessage) {
                        errorMessage(message, 5);
                    }
                    reject(true); // 返回true时，表示catch error
                });
            });
        }
        /**
         * 计算dom高的总和 config>params
         *@param dom dom对象，如"#abc,.abc"
         *@param variable 自定义变量后缀
         *@param hideParentScroll 隐藏父滚动
         *@param delay 延时
         *@param method 回调方法
         */

    }]);

    return Helper;
}(), _class.toArray = function (obj) {
    return toArray(obj);
}, _class.updateKeyValue = function (data, keyName, value) {
    // 克隆数据或对象
    if (data instanceof Array) {
        data = [].concat(data);
    } else {
        data = Object.assign({}, data);
    }
    if (keyName instanceof Object && !(keyName instanceof Array)) {
        if (value == 'all') {
            data = keyName;
        } else {
            for (var Key in keyName) {
                data = _lodash2.default.set(data, Key, keyName[Key]);
            }
        }
    } else {
        value = toArray(value);
        keyName = toArray(keyName);
        if (keyName && keyName.length) {
            keyName.forEach(function (item, i) {
                data = _lodash2.default.set(data, item, value && value[i] ? value[i] : "");
            });
        }
    }
    return data;
}, _class.domHeightSum = function (config) {
    var _obj = { config: '' };
    if (config instanceof Function) {
        _obj.method = config;
    } else if (config instanceof Object) {
        _obj = config;
    } else {
        return false;
    }
    clearTimeout(window['_$$' + _obj.variable]);
    window['_$$' + _obj.variable] = setTimeout(function () {
        var _dom = [];
        if (typeof _obj.dom === 'string') {
            _obj.dom = [_obj.dom];
        }
        if (_obj.dom instanceof Array) {
            _obj.dom.forEach(function (item) {
                if (typeof item == 'string') {
                    item.split(",").forEach(function (itm) {
                        if (itm.indexOf("#") === 0) {
                            var idDom = document.getElementById(itm.slice(1, itm.length));
                            if (idDom && _dom.indexOf(idDom) < 0) {
                                _dom.push(idDom);
                            }
                        } else if (itm.indexOf(".") === 0) {
                            var claDom = document.getElementsByClassName(itm.slice(1, itm.length));
                            for (var i = 0; i < claDom.length; i++) {
                                if (_dom.indexOf(claDom[i]) < 0) {
                                    _dom.push(claDom[i]);
                                }
                            }
                        }
                    });
                }
            });
        }
        // 隐藏滚动条
        var _hs = _obj.hideParentScroll;
        if (_hs && typeof _hs === 'string') {
            if (_hs.indexOf("#") === 0) {
                _hs = document.getElementById(_hs.slice(1, _hs.length));
            } else if (_hs.indexOf(".") === 0) {
                _hs = document.getElementsByClassName(_hs.slice(1, _hs.length))[0];
            }
        }
        if (_hs instanceof HTMLElement) {
            _hs.style.overflow = "hidden";
        }
        var _value = 0;
        _dom.forEach(function (item) {
            _value += item.offsetHeight;
        });
        return _obj.method ? _obj.method(_value) : 0;
    }, _obj.delay || 100);
}, _temp);

// 转成数组

function toArray(value) {
    if (!(value instanceof Array)) {
        value = [value];
    }
    return value;
}
// 将字符串或数组中的字符串项转成keyName
function toKeyName(obj) {
    var _keyName = [];
    if (obj) {
        if (typeof obj === 'string') {
            _keyName = [obj];
        } else if (obj.constructor === Array) {
            obj.forEach(function (item) {
                if (typeof item === 'string') {
                    _keyName.push(item);
                }
            });
        }
    }
    return _keyName;
}

function errorMessage(text, delay) {
    var id = '_message';
    delay = delay || 2000;
    var _element = document.getElementById(id);
    if (_element) {
        var _parentElement = _element.parentNode;
        _parentElement.removeChild(_element);
    }
    var divDom = document.createElement("div");
    divDom.setAttribute("id", id);
    divDom.setAttribute("style", "opacity:1;background:#FFF;position:absolute;top:20px;left:50%;z-index:1000;padding:6px 15px;transform: translateX(-50%);box-shadow: 0 0 5px #999999;color:rgba(0,0,0,.65);border-radius: 6px;transition-duration: 1.2s;");
    var textDom = document.createTextNode(text);
    divDom.appendChild(textDom);
    document.body.appendChild(divDom);
    setTimeout(function () {
        document.getElementById(id).style.opacity = 0;
    }, 2000);
}
module.exports = { Helper: Helper };