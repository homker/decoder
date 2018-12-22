/**
 * @desc 校验工具，把数组变成对象
 * @param {array} arr
 * @returns {object} obj
 */
export function arr2obj(arr) {
    let obj = {};
    arr.map(item => {
        obj[item] = true
    });
    return obj
}


/**
 * 去除掉数组或者字符串里的空行
 * @param {string|array} string
 */
export function filterEmpty(string) {
    return string.length > 0
}

/**
 * @desc compose函数
 * @param args {function} 合并函数
 * @returns {function} 获取输入函数
 */
export function compose(...args) {
    const funcS = args.reverse();
    /**
     * @desc 计算输出结果
     * @param {object} input
     * @returns {object} output
     */
    return function (x) {
        let result = arguments;
        for (let l = funcS.length; l--;) {
            result = [funcS[l].apply(this, result)]
        }
        return result[0];
    }
}

/**
 * @desc 匹配正则表达式
 * @param {RegExp} regex 需要匹配的正则表达式
 * @returns {function} 获取匹配字符串
 */
export function match(regex) {
    /**
     * @desc 获取和输出匹配字符串
     * @param {string} input
     * @returns {Array} 匹配结果
     */
    return function (string) {
        return String(string).match(regex)
    }
}

/**
 * @desc 获取数组中的某一个值
 * @param {number} index
 * @returns {function} 获取数组的输入
 */
export function getOne(index) {
    /**
     * @param {Array} 输入数组
     * @returns {object} 输出数据节点
     */
    return function (arr) {
        return arr[index]
    }
}

export let getFirst = getOne(0);

export function getLastOne(arr) {
    return arr[arr.length - 1]
}

/**
 * @desc 把输入内容转换成string类型
 * @param {object} string
 * @returns {string}
 */
export function toString(string) {
    return Object.prototype.toString.call(string);
}

/**
 * @desc 把字符串变成纯小写
 * @param string
 * @returns {string} 输出的纯小写内容
 */
export function toLowerCase(string) {
    return String(string).toLowerCase();
}


/**
 * @desc 去除字符串空格
 * @param string
 * @returns {string}
 */
export function trim(string) {
    return String(string).trim()
}

/**
 * @desc 获取对象类型
 * @param {object} 输入对象
 * @returns {string} 获取对象类型
 */
export let getType = compose(toString, match(/\[object (.*?)]/), getOne(1), trim, toLowerCase);

/**
 * 过滤对象，把需要的属性过滤出来
 * @param obj
 * @param keys
 */
export function getObjByKey(obj, keys) {
    if (getType(keys) !== 'array') {
        throw new TypeError('keys must be array')
    }
    let _obj = {};
    keys.map(key => {
        if (obj.hasOwnProperty(key)) {
            _obj[key] = obj[key]
        }
    });
    return _obj
}

/**
 * 获取唯一的id
 */
export let getId = (function () {
    let id = 0;
    return function () {
        return ++id
    }
})();
