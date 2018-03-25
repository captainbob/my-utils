import { HttpUtil } from '../http-utils'
import _ from 'lodash';

class Helper {
    /**
     * 验证数字
     * @param n 输入数字
     */
    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    /*
     移动数组记录
    */
    static moveArray(arr, index1, index2) {
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
    static round(num, fractionDigits) {
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
    static arraySum(arrData, keyName) {
        if (keyName) {
            arrData = arrData.map(item => {
                let keyValue = _.get(item, keyName);
                if (!isNaN(parseFloat(keyValue)) && isFinite(keyValue)) {
                    return Number(keyValue);
                } else {
                    return 0;
                }
            });
        }
        arrData = arrData && arrData.length ? arrData : [0];
        return arrData.reduce((prev, current) => {
            return (Number(prev) || 0) + (Number(current) || 0);
        })
    }
    //解析获取组件改变的值
    static changeValue(obj, excludeString, maxValue, minValue) {
        let text = '';
        if (obj && typeof (obj) === 'object' && obj.target) {
            text = typeof obj.target.value == 'string' ? obj.target.value : obj.target.checked;
        } else {
            text = obj;
        }
        // 排除字符
        if (excludeString && typeof (excludeString) !== 'number') {
            let reg;
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
        } else if (typeof (excludeString) === 'number') {
            let _text = String([undefined, null].indexOf(text) < 0 ? text : '');
            if (_text.length) {
                let jian = _text.indexOf('-') === 0 ? '-' : '';
                _text = _text.replace(/([^0-9|^.])/ig, "");
                _text = _text.split('.');
                text = _text.length ? Number(_text[0]) : '';
                if (excludeString > 0) {
                    text += _text.length > 1 ? '.' + _text[1].substring(0, excludeString) : '';
                } else if (excludeString == -1) {
                    text += _text.length > 1 ? '.' + _text[1] : '';
                }
                text = jian + text;
                if (typeof (maxValue) === "number" && text > maxValue) {
                    text = text < maxValue ? text : maxValue
                }
                if (typeof (minValue) === "number" && text < minValue) {
                    text = text > minValue ? text : minValue
                }
            } else {
                text = '';
            }
        }
        return text;
    }
    // 设置键值 setKey(data,'key','id')，setKey(data,['key','index'],['id','要读的属性'])
    static setKey(data, config, attrValue) {
        let children = 'children';
        if (config && config.constructor === Object) {
            children = config.children;
        }
        let keyName = [];  //默认key
        config = config || 'key';
        if (typeof (config) === 'string' || config.constructor === Array) {
            keyName = toKeyName(config);
            if (attrValue && typeof attrValue === 'string') {
                attrValue = toKeyName(attrValue);
            }
        } else if (config.constructor === Object) {
            keyName = toKeyName(config.keyName);
        }
        if (data && data instanceof Array) {
            data = data.map((item, i) => {
                keyName.forEach((itm, j) => {
                    if (!attrValue || !attrValue.length) {
                        item[itm] = i;
                    } else if (attrValue instanceof Array) {
                        item[itm] = attrValue[j] ? (item[attrValue[j]] || i) : i;
                    }
                });
                if (item[children] && item[children] instanceof Array) {
                    item[children] = item[children].map((itm, j) => {
                        keyName.forEach(iem => {
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
    static toArray = (obj) => {
        return toArray(obj);
    }
    // 更新对象键的值
    static updateKeyValue = (data, keyName, value) => {
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
                for (let Key in keyName) {
                    data = _.set(data, Key, keyName[Key]);
                }
            }
        } else {
            value = toArray(value);
            keyName = toArray(keyName);
            if (keyName && keyName.length) {
                keyName.forEach((item, i) => {
                    data = _.set(data, item, value && value[i] ? value[i] : "");
                });
            }
        }
        return data;
    }
    /**
     * 此方法已被约定停止使用
     * 请自行封装到项目中
     */
    static ajax(url, options, returnAll) {
        // 按类型参数交换options<=>returnAll
        if (!(options instanceof Object) && options) {
            let _options = options, _json = returnAll;
            _options = returnAll instanceof Object ? returnAll : {}
            _json = options;
            options = _options;
            returnAll = _json;
        }
        // 也可以设置在options中
        if (!returnAll && (options instanceof Object) && options.returnAll === true) {
            returnAll = true;
        }
        return new Promise((resolve, reject) => {
            if (!options.method) {
                options.method = "GET";
            }
            // 默认URL编码
            if (options.encode == undefined) {
                options.encode = true;
            }
            // 关闭消息提示
            let closeMessage;
            if (options && options.closeMessage === true) {
                closeMessage = true;
            }
            HttpUtil.ajax(url, options).then(response => {
                // returnAll 等于 true 或 'all' 时，返回全部JSON数据
                let resultObject = [true, 'all'].indexOf(returnAll) >= 0 ? response : response.resultObject;
                if ((response.resultCode === 'success' || response.status === 'success')) {
                    resolve(resultObject);
                } else {
                    let message = response.exceptionMessage || response.message || '请求错误';
                    if (!closeMessage) {
                        errorMessage(message);
                    }
                    reject(message);
                }
            }).catch(err => {
                let message = '请求异常或超时：请 刷新 重试！';
                if (!closeMessage) {
                    errorMessage(message, 5);
                }
                reject(true);   // 返回true时，表示catch error
            })
        })
    }
    /**
     * 计算dom高的总和 config>params
     *@param dom dom对象，如"#abc,.abc"
     *@param variable 自定义变量后缀
     *@param hideParentScroll 隐藏父滚动
     *@param delay 延时
     *@param method 回调方法
     */
    static domHeightSum = (config) => {
        let _obj = { config: '' };
        if (config instanceof Function) {
            _obj.method = config;
        } else if (config instanceof Object) {
            _obj = config;
        } else {
            return false;
        }
        clearTimeout(window['_$$' + _obj.variable]);
        window['_$$' + _obj.variable] = setTimeout(() => {
            let _dom = [];
            if (typeof _obj.dom === 'string') {
                _obj.dom = [_obj.dom];
            }
            if (_obj.dom instanceof Array) {
                _obj.dom.forEach(item => {
                    if (typeof item == 'string') {
                        item.split(",").forEach(itm => {
                            if (itm.indexOf("#") === 0) {
                                let idDom = document.getElementById(itm.slice(1, itm.length));
                                if (idDom && _dom.indexOf(idDom) < 0) {
                                    _dom.push(idDom);
                                }
                            } else if (itm.indexOf(".") === 0) {
                                let claDom = document.getElementsByClassName(itm.slice(1, itm.length));
                                for (let i = 0; i < claDom.length; i++) {
                                    if (_dom.indexOf(claDom[i]) < 0) {
                                        _dom.push(claDom[i]);
                                    }
                                }
                            }
                        })
                    }
                })
            }
            // 隐藏滚动条
            let _hs = _obj.hideParentScroll;
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
            let _value = 0;
            _dom.forEach(item => {
                _value += item.offsetHeight;
            })
            return _obj.method ? _obj.method(_value) : 0;
        }, _obj.delay || 100);
    }
}

// 转成数组
function toArray(value) {
    if (!(value instanceof Array)) {
        value = [value];
    }
    return value;
}
// 将字符串或数组中的字符串项转成keyName
function toKeyName(obj) {
    let _keyName = [];
    if (obj) {
        if (typeof (obj) === 'string') {
            _keyName = [obj];
        } else if (obj.constructor === Array) {
            obj.forEach(item => {
                if (typeof (item) === 'string') {
                    _keyName.push(item);
                }
            })
        }
    }
    return _keyName;
}

function errorMessage(text, delay) {
    let id = '_message';
    delay = delay || 2000;
    let _element = document.getElementById(id);
    if (_element) {
        var _parentElement = _element.parentNode;
        _parentElement.removeChild(_element);
    }
    let divDom = document.createElement("div");
    divDom.setAttribute("id", id);
    divDom.setAttribute("style", "opacity:1;background:#FFF;position:absolute;top:20px;left:50%;z-index:1000;padding:6px 15px;transform: translateX(-50%);box-shadow: 0 0 5px #999999;color:rgba(0,0,0,.65);border-radius: 6px;transition-duration: 1.2s;");
    let textDom = document.createTextNode(text);
    divDom.appendChild(textDom);
    document.body.appendChild(divDom);
    setTimeout(() => {
        document.getElementById(id).style.opacity = 0;
    }, 2000);
}
module.exports = { Helper }