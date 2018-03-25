require('proxy-polyfill/proxy.min');
const s = {};
s.isBlank = require('underscore.string/isBlank');
s.stripTags = require('underscore.string/stripTags');
s.capitalize = require('underscore.string/capitalize');
s.decapitalize = require('underscore.string/decapitalize');
s.chop = require('underscore.string/chop');
s.trim = require('underscore.string/trim');
s.clean = require('underscore.string/clean');
s.cleanDiacritics = require('underscore.string/cleanDiacritics');
s.count = require('underscore.string/count');
s.chars = require('underscore.string/chars');
s.swapCase = require('underscore.string/swapCase');
s.escapeHTML = require('underscore.string/escapeHTML');
s.unescapeHTML = require('underscore.string/unescapeHTML');
s.splice = require('underscore.string/splice');
s.insert = require('underscore.string/insert');
s.replaceAll = require('underscore.string/replaceAll');
s.include = require('underscore.string/include');
s.join = require('underscore.string/join');
s.lines = require('underscore.string/lines');
s.dedent = require('underscore.string/dedent');
s.reverse = require('underscore.string/reverse');
s.startsWith = require('underscore.string/startsWith');
s.endsWith = require('underscore.string/endsWith');
s.pred = require('underscore.string/pred');
s.succ = require('underscore.string/succ');
s.titleize = require('underscore.string/titleize');
s.camelize = require('underscore.string/camelize');
s.underscored = require('underscore.string/underscored');
s.dasherize = require('underscore.string/dasherize');
s.classify = require('underscore.string/classify');
s.humanize = require('underscore.string/humanize');
s.ltrim = require('underscore.string/ltrim');
s.rtrim = require('underscore.string/rtrim');
s.truncate = require('underscore.string/truncate');
s.prune = require('underscore.string/prune');
s.words = require('underscore.string/words');
s.pad = require('underscore.string/pad');
s.lpad = require('underscore.string/lpad');
s.rpad = require('underscore.string/rpad');
s.lrpad = require('underscore.string/lrpad');
s.sprintf = require('underscore.string/sprintf');
s.vsprintf = require('underscore.string/vsprintf');
s.toNumber = require('underscore.string/toNumber');
s.numberFormat = require('underscore.string/numberFormat');
s.strRight = require('underscore.string/strRight');
s.strRightBack = require('underscore.string/strRightBack');
s.strLeft = require('underscore.string/strLeft');
s.strLeftBack = require('underscore.string/strLeftBack');
s.toSentence = require('underscore.string/toSentence');
s.toSentenceSerial = require('underscore.string/toSentenceSerial');
s.slugify = require('underscore.string/slugify');
s.surround = require('underscore.string/surround');
s.quote = require('underscore.string/quote');
s.unquote = require('underscore.string/unquote');
s.repeat = require('underscore.string/repeat');
s.naturalCmp = require('underscore.string/naturalCmp');
s.levenshtein = require('underscore.string/levenshtein');
s.toBoolean = require('underscore.string/toBoolean');
s.exports = require('underscore.string/exports');
s.escapeRegExp = require('underscore.string/helper/escapeRegExp');
s.wrap = require('underscore.string/wrap');
s.map = require('underscore.string/map');

const proxyHandler = {
    get: (target, name) => {
        if (name in target) {
            return target[name];
        } else {
            return s[name];
        }
    }
}

class StringUtils {
    removeEmoj(string) {
        const ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ]
        return string.replace(new RegExp(ranges.join('|'), 'g'), '')
    }

    isPhoneNumber(phone) {
        return /^1\d{10}$/.test(phone)
    }

    decimalFormat(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1],
            t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }

    changeValue(obj, excludeString, maxValue, minValue) {
        let text = '';
        if (obj && typeof (obj) === 'object' && obj.target) {
            text = obj.target.value;
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
                text = _text.length ? _text[0] : '';
                if (excludeString > 0) {
                    text += _text.length > 1 ? '.' + _text[1].substring(0, excludeString) : '';
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
}

StringUtils = new Proxy(new StringUtils(), proxyHandler);

module.exports = StringUtils;