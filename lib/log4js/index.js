"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    function _uuid() {
        var s = [];
        var userId = "";
        if (window.userInfo) {
            userId = userInfo.userId;
        }
        var hexDigits = "0123456789abcdef";

        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");

        return userId + "-" + uuid + "-" + new Date().getTime();
    }

    Date.prototype.Format = function (fmt) {
        //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "H+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }return fmt;
    };

    var _isErrorListenerAdded = false;
    var _deviceType = '';
    var _version = '';
    var _enabled = true;

    function _ip() {}

    function _requestPath() {
        return document.location.href;
    }

    function _requestParams() {
        return document.location.search;
    }

    function _traceid() {
        return _uuid();
    }

    function _send(logLevel, options) {
        var logLevel = logLevel;
        switch (logLevel) {
            case 'ERROR':
                break;
            // case 'INFO':
            //     break
            // case 'WARN':
            //     break
            // case 'DEBUG':
            //     return
            default:
                return;
        }

        var requestData = {
            'ip': '',
            'traceid': options.traceid || _traceid(),
            'param': options.param || _requestParams(),
            'requestTime': new Date().Format("yyyy-MM-dd HH:mm:ss.S"),
            'requestPath': options.requestPath || _requestPath(),
            'logLevel': logLevel,
            'deviceType': _deviceType,
            'env': window.gatewayEnvPrefix,
            'version': _version,
            'module': window.sysCode,
            'message': options.message,
            'errMessage': options.errMessage
        };
        _httpSend(requestData);
    }

    function _httpSend(data) {
        if (!_enabled) return;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/rs/sys/log/save.do', true);
        xhr.onreadystatechange = function () {
            //Call a function when the state changes.
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {} else {
                //todo retry
            }
        };
        var formData = new FormData();
        formData.append('logInfo', JSON.stringify([data]));
        xhr.send(formData);
    }

    function _getDeviceType() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

    var Log4Js = {
        _handler: function _handler(event) {
            var requestData = {
                'ip': '',
                'traceid': _traceid(),
                'param': _requestParams(),
                'requestTime': new Date().Format("yyyy-MM-dd HH:mm:ss.S"),
                'requestPath': _requestPath(),
                'logLevel': 'ERROR',
                'deviceType': _deviceType,
                'env': window.gatewayEnvPrefix,
                'version': _version,
                'module': window.sysCode,
                'message': event.error.message,
                'errMessage': event.error.stack
            };
            _httpSend(requestData);
        },

        init: function init(version, enabled) {
            _enabled = typeof enabled == 'undefined' ? true : enabled;
            _deviceType = _getDeviceType();
            _version = version;
        },

        applyMiddleware: function applyMiddleware(handler) {
            var newEvent = null,
                beforeHandler = Log4Js._handler;
            Log4Js._handler = function (ev) {
                newEvent = handler(ev);
                if (newEvent) {
                    beforeHandler(newEvent);
                }
            };
            return Log4Js;
        },

        startGlobalErrorTracking: function startGlobalErrorTracking() {
            if (!_isErrorListenerAdded) {
                _isErrorListenerAdded = true;
                if (typeof window !== 'undefined' && typeof window.addEventListener == 'function') {
                    window.addEventListener('error', function (event) {
                        Log4Js._handler(event);
                    });
                }
            }
        },

        //options :
        //   param
        //   requestPath
        //   message
        //   errMessage
        error: function error(options) {
            return _send('ERROR', options);
        }

        // info: function (module, options) {
        //     return _send('INFO', module, options)
        // },

        // warn: function (module, options) {
        //     return _send('WARN', module, options)
        // },

        // debug: function (module, options) {
        //     return _send('DEBUG', module, options)
        // }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Log4Js;
    } else if (typeof define === 'function' && _typeof(define.amd) === 'object' && define.amd) {
        define('Log4Js', [], function () {
            return Log4Js;
        });
    } else {
        window.Log4Js = Log4Js;
    }
})();