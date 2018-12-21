/**
 * Created by homker on 17/3/12.
 */

import {getType} from '../tools'

const checkHelp = {
    low: function (o, func) {
        return func(o)
    },
    mid: function (o, func1, func2) {
        if (func1(o)) {
            if (o[0] === undefined) {
                return false
            }
            return func2(o[0])
        }
        return false
    },
    hig: function (o, func1, func2) {
        if (func1(o)) {
            for (let l = o.length; l--;) {
                if (!func2(o[l])) {
                    return false
                }
            }
            return true
        }
        return false
    }
}

/**
 * @desc 判断是否是string
 * @returns {boolean}
 */
export function isString(string) {
    return getType(string) === 'string'
}

/**
 * @desc 判断是否是number
 * @returns {boolean}
 */
export function isNumber(o) {
    return !isNaN(parseInt(o)) && ! isArray(o) && getType(o) === 'number'
}

/**
 * @desc 判断是否是 array 判断类型
 * @returns {boolean}
 */
export function isArray(arr) {
    return getType(arr) === 'array'
}

/**
 * @desc 判断是否是boolean类型
 * @returns {boolean}
 */
export function isBoolean(bool) {
    return getType(bool) === 'boolean'
}

/**
 * @desc 判断是否是对象
 * @returns {boolean}
 */
export function isObject(o) {
    return getType(o) === 'object'
}

/**
 * @desc 判断是否为undefined
 * @return {boolean}
 */
export function isUndefined(o) {
    return typeof o === 'undefined'
}

/**
 * @desc 判断是否是函数
 * @returns {boolean}
 */
export function isFunction(func) {
    return getType(func) === 'function'
}

/**
 * @desc 判断是否是【ArrayString】 类型
 * @returns {boolean} 判断类型
 */
export function isArrayString(o, flag = 'mid') {
    return checkHelp[flag](o, isArray, isString)
}

/**
 * @desc 判断是否是【arraynumber】 类型
 * @returns {boolean} 判断类型
 */
export function isArrayNumber(o, flag = 'mid') {
    return checkHelp[flag](o, isArray, isNumber)
}

/**
 * @desc 判断是否是【ArrayBoolean】 类型
 * @returns {boolean} 判断类型
 */
export function isArrayBoolean(o, flag = 'mid') {
    return checkHelp[flag](o, isArray, isBoolean)
}

/**
 * @desc 判断是否是【ArrayObject】 类型
 * @param o
 * @param flag
 * @return {boolean} 判断类型
 */
export function isArrayObject(o, flag = 'mid') {
    return checkHelp[flag](o, isArray, isObject)
}
