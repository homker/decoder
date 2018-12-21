/*! cJce v0.1 | jce文件解析 | ctchen */

; (function (ns, global, factory) {
    global[ns] = factory(global);
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define(global[ns]);
    } else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global[ns];
    }
})("CJCE", typeof window !== "undefined" ? window : this, function (window) {
    "use strict";

    //#region 工具方法库
    const utils = {};

    // 类型检测
    Array.prototype.forEach.call(["Object", "Function", "String", "Number", "Array", "Boolean", "File"], type => {
        utils["is" + type] = obj => Object.prototype.toString.call(obj) === "[object " + type + "]";
    });

    //#endregion

    //#region JCE文件解析

    ; (utils => {
        let wrap = "\n"; // 换行符
        let regType = /^(?:(?:unsigned\s+)?(?:byte|short|int|long)|bool|float|double|string|void)$/; // 基本数据类型

        /**
         * 创建一个错误对象
         * @param {*} pos 错误位置
         * @param {*} message 错误文本
         */
        let createError = (pos, message) => {
            return new Error("[解析出错][" + pos + "]" + message);
        };

        //#region 解析值/行/注释/类型

        /**
         * 解析值
         * @param {String} value
         */
        let parseValue = value => {
            try {
                value = JSON.parse(value);
            } catch (error) { }
            return value;
        };

        /**
         * 合并注释说明
         * @param {*} item
         * @param {*} descList
         */
        let addDesc = (item, descList) => {
            if (descList.length) {
                item.desc = descList.join(wrap) + (item.desc ? wrap + item.desc : "");
                descList.length = 0;
            }
        };

        /**
         * 匹配从指定位置开始的行文本，包含换行符
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @returns 匹配到的行文本
         */
        let matchLine = (str, pos) => {
            let lineEnd = str.indexOf(wrap, pos);
            return str.slice(pos, lineEnd !== -1 ? lineEnd + 1 : str.length);
        };

        /**
         * 匹配类型
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @returns 匹配到的类型 { length, result: { type, data: { key, value } }, struct }
         */
        let matchType = (str, pos) => {
            if (pos > 0) {
                str = str.slice(pos);
            }
            let ret;
            let struct;
            pos = 0;
            let type = str.match(/\s*((?:unsigned\s+)?\w+)\s*/);
            if (type) {
                ret = {};
                pos = type[0].length;
                ret.type = type[1];
                let length = str.length;
                let isMap = ret.type === "map";
                let isVector = ret.type === "vector";
                if (isMap || isVector) {
                    if (str.charAt(pos) !== "<") {
                        return;
                    }
                    pos++;
                    let keyType = matchType(str, pos);
                    if (!keyType || (isMap && keyType.struct)) { // map类型第一个子类型只能是基本数据类型
                        return;
                    }
                    pos += keyType.length;
                    str = str.slice(pos);
                    if (isMap) {
                        let next = str.match(/^\s*,\s*/);
                        if (!next) {
                            return;
                        }
                        pos += next[0].length;
                        str = str.slice(next[0].length);
                        let valueType = matchType(str);
                        if (!valueType) {
                            return;
                        }
                        if (valueType.struct) {
                            struct = valueType.struct;
                        }
                        ret.data = {
                            key: keyType.result,
                            value: valueType.result
                        };
                        pos += valueType.length;
                        str = str.slice(valueType.length);
                    } else {
                        if (keyType.struct) {
                            struct = keyType.struct;
                        }
                        ret.data = { value: keyType.result };
                    }
                    let end = str.match(/^\s*>\s*/);
                    if (end) {
                        pos += end[0].length;
                    } else {
                        return;
                    }
                } else if (!regType.test(ret.type)) {
                    struct = ret.type;
                }
            }
            return ret && { length: pos, result: ret, struct: struct };
        };

        //#endregion

        //#region 解析注释

        /**
         * 解析注释并自动过滤空格
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @param {Number} type 要解析的类型：
         *      type=0 全部解析
         *      type=1 解析下一个行注释
         *      type=2 解析下一个块注释
         *      type=3 解析行尾注释
         * @returns { length, result }
         */
        let matchDesc = (str, pos, type = 0) => {
            if (pos > 0) {
                str = str.slice(pos);
            }
            if (type == 3) {
                return matchDesc(matchLine(str), 0);
            } else if (type != 2 && /^\s*\/\//.test(str)) {
                let line = matchLine(str);
                return {
                    result: line.replace(/^\s*\/\/\s*/, "").trim(),
                    length: line.length
                };
            } else if (type != 1) {
                let desc = str.match(/^\s*\/\*+((?:.|\n)*?)\*+\/\s*/);
                return desc && {
                    result: desc[1].replace(/\n\*+\s*/g, "\n").trim(),
                    length: desc[0].length
                };
            }
        };

        //#endregion

        //#region 解析常量

        /**
         * 解析常量
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @returns { length, result: { type, name, value } }
         */
        let matchConst = (str, pos) => {
            if (pos > 0) {
                str = str.slice(pos);
            }
            let ret = str.match(/^\s*const\s+([^=]+?)\s*(\w+)\s*=\s*/);
            if (ret) {
                let line = matchLine(str, ret[0].length);
                let value = line.replace(/\\./g, "__") // 过滤掉转义符
                    .match(/^(\s*)(['"]?)(.*?)\2\s*;\s*/); // 提取值
                if (value) {
                    let start = value[1].length + value[2].length;
                    return {
                        length: ret[0].length + value[0].length,
                        result: {
                            type: ret[1],
                            name: ret[2],
                            value: line.slice(start, start + value[3].length)
                        }
                    };
                }
            }
        };

        //#endregion

        //#region 解析枚举

        /**
         * 解析枚举
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @returns { length, result: { name, data: [ { name, value, desc } ] } }
         */
        let matchEnmu = (str, pos) => {
            if (pos > 0) {
                str = str.slice(pos);
            }
            let ret;
            let enmuName = str.match(/^\s*enum\s+(\w+)\s*\{\s*/);
            if (enmuName) {
                ret = {
                    name: enmuName[1],
                    data: []
                };
                let cur;
                let descList = [];
                let length = str.length;
                pos = enmuName[0].length;
                while (pos < length) {
                    let c = str.charAt(pos);
                    let line = matchLine(str, pos);

                    if (/^\/[*/]/.test(line)) { // 注释
                        line = matchDesc(str, pos);
                        if (line) {
                            pos += line.length;
                            descList.push(line.result);
                        } else {
                            return;
                        }
                    } else if (/^\s/.test(line)) { // 空格
                        let end = line.search(/\S/);
                        pos += end === -1 ? line.length : end;
                    } else if (c === "," || c === "}") {
                        pos++;
                        let isEnd = c === "}";
                        if (cur) {
                            // 行末注释
                            let desc = matchDesc(str, pos, 3);
                            if (desc) {
                                descList.push(desc.result);
                                pos += desc.length;
                            }
                            addDesc(cur, descList);
                            if (cur.value == null) {
                                cur.value = ret.data.length;
                            }
                            ret.data.push(cur);
                            cur = null;
                        } else if (!isEnd) { // 无效字符
                            return;
                        }
                        if (isEnd) {
                            break;
                        }
                    } else {
                        line = line.match(/^(\w+)(?:\s*=\s*(\d+))?/);
                        if (line) {
                            pos += line[0].length;
                            cur = { name: line[1] };
                            if (line[2] != null) {
                                cur.value = line[2];
                            }
                        } else {
                            return;
                        }
                    }
                }
            }

            return ret && { result: ret, length: pos };
        };

        //#endregion

        //#region 解析结构

        /**
         * 解析结构
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @param {Array} pos 开始位置
         * @returns { length, result: { name, type, data: [ { tag, name, type, attr, value, desc } ] } }
         */
        let matchStruct = (str, pos, needs) => {
            if (pos > 0) {
                str = str.slice(pos);
            }
            let ret;
            let sName = str.match(/^\s*struct\s+(\w+)\s*\{\s*/);
            if (sName) {
                ret = {
                    name: sName[1],
                    data: []
                };
                let cur;
                let descList = [];
                let length = str.length;
                pos = sName[0].length;
                while (pos < length) {
                    let c = str.charAt(pos);
                    let line = matchLine(str, pos);

                    if (/^\/[*/]/.test(line)) { // 注释
                        line = matchDesc(str, pos);
                        if (line) {
                            pos += line.length;
                            descList.push(line.result);
                        } else {
                            return;
                        }
                    } else if (/^\s/.test(line)) { // 空格
                        let end = line.search(/\S/);
                        pos += end === -1 ? line.length : end;
                    } else if (c === "}") {
                        pos++;
                        break;
                    } else {
                        // tag & require
                        let item = line.match(/^(\d+)\s*(require|optional)\s*/);
                        if (!item) {
                            return;
                        }
                        cur = { tag: item[1] }
                        if (item[2] === "require") {
                            cur.require = "1";
                        }
                        pos += item[0].length;
                        line = line.slice(item[0].length);
                        // type & data
                        item = matchType(line);
                        if (!item) {
                            return;
                        }
                        cur.type = item.result.type;
                        if (item.result.data) {
                            cur.data = item.result.data;
                        }
                        if (needs && item.struct) {
                            needs.push(item.struct);
                        }
                        pos += item.length;
                        line = line.slice(item.length);
                        // name
                        item = line.match(/^\s*(\w+)\s*/);
                        if (!item) {
                            return;
                        }
                        cur.name = item[1];
                        pos += item[0].length;
                        line = line.slice(item[0].length);
                        // value
                        if (line.charAt(0) === "=") {
                            item = line.replace(/\\./g, "__") // 过滤掉转义符
                                .match(/^=(\s*)(['"]?)(.*?)\2\s*;/); // 提取值
                            if (!item) {
                                return;
                            }
                            let start = item[1].length + item[2].length + 1;
                            ret.value = line.slice(start, start + item[3].length);
                            pos += item[0].length;
                        } else if (str.charAt(pos) === ";") {
                            pos++;
                        } else {
                            return;
                        }
                        // 行末注释
                        let desc = matchDesc(str, pos, 3);
                        if (desc) {
                            descList.push(desc.result);
                            pos += desc.length;
                        }
                        addDesc(cur, descList);
                        ret.data.push(cur);
                    }
                }
            }

            return ret && { result: ret, length: pos };
        };

        //#endregion

        //#region 解析接口

        /**
         * 解析接口
         * @param {String} str 要匹配的文本
         * @param {Number} pos 开始位置
         * @returns { length, result: { name, type, data: [ { tag, name, type, attr, value, desc } ] } }
         */
        let matchInterface = (str, pos, needs) => {
            if (pos > 0) {
                str = str.slice(pos);
            }
            let ret;
            let sName = str.match(/^\s*interface\s+(\w+)\s*\{\s*/);
            if (sName) {
                ret = {
                    name: sName[1],
                    data: []
                };
                let cur;
                let descList = [];
                let length = str.length;
                pos = sName[0].length;
                while (pos < length) {
                    let c = str.charAt(pos);
                    let line = matchLine(str, pos);

                    if (/^\/[*/]/.test(line)) { // 注释
                        line = matchDesc(str, pos);
                        if (line) {
                            pos += line.length;
                            descList.push(line.result);
                        } else {
                            return;
                        }
                    } else if (/^\s/.test(line)) { // 空格
                        let end = line.search(/\S/);
                        pos += end === -1 ? line.length : end;
                    } else if (c === "}") {
                        pos++;
                        break;
                    } else {
                        // int add(int num1, int num2);
                        cur = {};
                        line = str.slice(pos);

                        // 返回类型
                        let item = matchType(line);
                        if (!item) {
                            return;
                        }
                        pos += item.length;
                        cur.return = item.result;
                        if (needs && item.struct) {
                            needs.push(item.struct);
                        }
                        line = line.slice(item.length);

                        // 接口名
                        item = line.match(/^\s*(\w+)\s*\(\s*/);
                        if (!item) {
                            return;
                        }
                        cur.name = item[1];
                        cur.data = [];
                        pos += item[0].length;
                        line = line.slice(item[0].length);

                        // 参数列表
                        let isEnd = 0;
                        let _pos = 0;
                        let _str = line;
                        let _length = line.length;
                        let _cur = {};
                        let _descList = [];
                        while (_pos < _length) {
                            let _c = _str.charAt(_pos);
                            let _line = _str.slice(_pos);

                            if (/^\/[*/]/.test(_line)) { // 注释
                                _line = matchDesc(_str, _pos);
                                if (_line) {
                                    _pos += _line.length;
                                    _descList.push(_line.result);
                                } else {
                                    return;
                                }
                            } else if (/^\s/.test(_line)) { // 空格
                                let end = _line.search(/\S/);
                                _pos += end === -1 ? _line.length : end;
                            } else if (_c === ";") {
                                if (!isEnd) {
                                    return;
                                }
                                _pos++;
                                break;
                            } else if (_c === ")" || _c === ",") {
                                if (isEnd) {
                                    return;
                                }
                                isEnd = _c === ")";
                                if (_cur && _cur.type) {
                                    // 行末注释
                                    let _desc = matchDesc(_str, _pos, 3);
                                    if (_desc) {
                                        _descList.push(_desc.result);
                                        _pos += _desc.length;
                                    }
                                    addDesc(_cur, _descList);
                                    cur.data.push(_cur);
                                    _cur = {};
                                }
                                _pos++;
                            } else {
                                if (!_cur) {
                                    return;
                                }

                                item = _line.match(/^\s*(out|ref)\s*/);
                                if (item) {
                                    _pos += item[0].length;
                                    _cur.attr = item[1];
                                    _line = _line.slice(item[0].length);
                                }

                                item = matchType(_line);
                                if (!item) {
                                    return;
                                }
                                _cur.type = item.result.type;
                                if (item.result.data) {
                                    _cur.data = item.result.data;
                                }
                                _pos += item.length;
                                _line = _line.slice(item.length);
                                item = _line.match(/^\s*(\w+)\s*/);
                                if (!item) {
                                    return;
                                }
                                _cur.name = item[1];
                                _pos += item[0].length;
                            }
                        }
                        pos += _pos;

                        if (!isEnd) {
                            return;
                        } else {
                            ret.data.push(cur);
                        }
                    }
                }
            }

            return ret && { result: ret, length: pos };
        };

        //#endregion

        utils.parseJce = (jce) => {
            let ret = {
                // 模块名
                "module": "",

                // 模块说明
                "desc": [],

                // 外链
                "include": [],

                // 常量
                "const": [],

                // 枚举值
                "enum": [],

                // 结构
                "struct": [],

                // 接口
                "interface": []
            };
            let cConst = {};
            let cEnum = {};
            let cStruct = {};
            let cInterface = {};

            // 预处理文本，去掉首尾空格及重复换行，将换行符统一成 \n
            let str = jce == null ? "" : ("" + jce).trim().replace(/(?:[\r\n]\s*)+/g, wrap);
            let pos = 0;
            let length = str.length;
            let error;

            // 匹配 module
            while (pos < length) {
                let line = matchLine(str, pos);
                if (/^\/[*/]/.test(line)) { // 注释
                    let desc = matchDesc(str, pos);
                    if (desc) {
                        ret.desc.push(desc.result);
                        pos += desc.length;
                    } else {
                        error = true;
                    }
                } else if (/^#include[\s'"]/.test(line)) { // #include外链
                    ret.include.push(line.replace(/^#include[\s'"]+/, "").replace(/[\s'"]+$/, ""));
                    pos += line.length;
                } else if (/^module/.test(line)) { // module
                    let module = str.slice(pos).match(/module\s*(\w+)\s*\{\s*/);
                    if (module) {
                        ret.module = module[1];
                        pos += module[0].length;
                    } else {
                        error = true;
                    }
                } else if (/^\s/.test(line)) { // 空格
                    let end = line.search(/\S/);
                    pos += end === -1 ? line.length : end;
                } else {
                    error = true;
                }
                if (error) {
                    throw createError(pos, str.slice(pos, pos + 100));
                } else if (ret.module) {
                    break;
                }
            }
            if (ret.desc.length) {
                ret.desc = ret.desc.join(wrap);
            } else {
                delete ret.desc;
            }

            // 解析 module 内模块
            let lastDesc = [];
            let needs = [];
            let act, target;
            while (pos < length) {
                let c = str.charAt(pos);
                let line = matchLine(str, pos);
                act = target = null;

                if (c === ";") {
                    pos++;
                } else if (/^\/[*/]/.test(line)) { // 注释
                    act = matchDesc;
                    target = lastDesc;
                } else if (/^const\s/.test(line)) { // 常量
                    act = matchConst;
                    target = ret.const;
                } else if (/^enum\s/.test(line)) { // 枚举
                    act = matchEnmu;
                    target = ret.enum;
                } else if (/^struct\s/.test(line)) { // 结构
                    act = matchStruct;
                    target = ret.struct;
                } else if (/^interface\s/.test(line)) { // 接口
                    act = matchInterface;
                    target = ret.interface;
                } else if (/^\s/.test(line)) { // 空格
                    let end = line.search(/\S/);
                    pos += end === -1 ? line.length : end;
                } else if (c === "}") { // 匹配结束
                    break;
                } else { // 异常字符
                    error = 1;
                }
                if (act) {
                    let need = [];
                    let item = act(str, pos, need);
                    if (item) {
                        needs = needs.concat(need);
                        pos += item.length;
                        if (target !== lastDesc) {
                            // 行末注释
                            if (str.charAt(pos - 1) !== wrap) {
                                let desc = matchDesc(str, pos, 3);
                                if (desc) {
                                    lastDesc.push(desc.result);
                                    pos += desc.length;
                                }
                            }
                            addDesc(item.result, lastDesc);
                        }
                        target.push(item.result);
                    } else {
                        error = true;
                    }
                }
                if (error) {
                    throw createError(pos, str.slice(pos, pos + 100));
                }
            }

            if (needs.length) {
                let map = {};
                ret.struct.forEach(item => map[item.name] = 1);
                for (let index = 0; index < needs.length; index++) {
                    let item = needs[index];
                    if (!map[item]) {
                        throw createError(0, "未找到定义：" + item);
                    }
                }
            }

            return ret;
        }

    })(utils);

    //#endregion

    class CJCE {

        /**
         * 初始化
         * @param {String} data 要解析的jce文本
         */
        constructor(data) {
            this._ = {};
            this.jce = data;
        }

        // /**
        //  * 测试数据是否符合格式要求
        //  * @param {Object} data 要检测的数据
        //  * @returns 是否满足格式要求
        //  */
        // test(data) {

        // }

        // /**
        //  * 生成一份随机数据
        //  * @param {Object} data 要手动设置的数据，缺少的会自动补齐
        //  * @returns 符合格式要求的随机数据
        //  */
        // random(data) {

        // }

        /**
         * 获取错误信息
         */
        get error() {
            return this._.error;
        }

        /**
         * 获取解析耗时
         */
        get time() {
            return this._.time;
        }

        /**
         * 获取或设置 jce 文本
         */
        get jce() {
            return this._.jce;
        }
        set jce(data) {
            let _ = this._;
            try {
                _.jce = data;
                let start = Date.now();
                _.rule = utils.parseJce(data);
                _.strRule = _.rule ? JSON.stringify(_.rule) : "";
                _.time = Date.now() - start;
            } catch (error) {
                _.error = error;
            }
        }

        /**
         * 获取解析出得数据格式协议
         */
        get rule() {
            let _ = this._;
            if (_.error) {
                return null;
            } else {
                return JSON.parse(_.strRule);
            }
        }
    }

    return CJCE;
});