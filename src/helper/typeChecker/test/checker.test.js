const isString = require('../index').isString;
const isNumber = require('../index').isNumber;
const isObject = require('../index').isObject;
const isBoolean = require('../index').isBoolean;
const isArray = require('../index').isArray;
const isArrayObject = require('../index').isArrayObject;
const isArrayNumber = require('../index').isArrayNumber;
const isArrayBoolean = require('../index').isArrayBoolean;
const string = '';
const number = 0;
const object = {};
const boolean = false;
const array = [];
const arrayObject = [{a: 1}];
const arrayNumber = [0];
const arrayBoolean = [false];

describe('检查isString是否正常', () => {
    let checker = isString;
    test('检查isString是否能检查string', () => {
        expect(checker(string)).toBeTruthy();
    });
    test('检查isString是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isString是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isString是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isString是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isString是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeFalsy();
    });
    test('检查isString是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeFalsy();
    });
    test('检查isString是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeFalsy();
    });
});

describe('检查isNumber是否正常', () => {
    let checker = isNumber;
    test('检查isNumber是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isNumber是否能检查number', () => {
        expect(checker(number)).toBeTruthy();
    });
    test('检查isNumber是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isNumber是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isNumber是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isNumber是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeFalsy();
    });
    test('检查isNumber是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeFalsy();
    });
    test('检查isNumber是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeFalsy();
    });
});

describe('检查isObject是否正常', () => {
    let checker = isObject;
    test('检查isObject是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isObject是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isObject是否能检查object', () => {
        expect(checker(object)).toBeTruthy();
    });
    test('检查isObject是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isObject是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isObject是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeFalsy();
    });
    test('检查isObject是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeFalsy();
    });
    test('检查isObject是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeFalsy();
    });
});

describe('检查isBoolean是否正常', () => {
    let checker = isBoolean;
    test('检查isBoolean是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isBoolean是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isBoolean是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isBoolean是否能检查boolean', () => {
        expect(checker(boolean)).toBeTruthy();
    });
    test('检查isBoolean是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isBoolean是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeFalsy();
    });
    test('检查isBoolean是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeFalsy();
    });
    test('检查isBoolean是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeFalsy();
    });
});

describe('检查isArrayNumber是否正常', () => {
    let checker = isArrayNumber;
    test('检查isArrayNumber是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isArrayNumber是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isArrayNumber是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isArrayNumber是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isArrayNumber是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isArrayNumber是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeFalsy();
    });
    test('检查isArrayNumber是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeTruthy();
    });
    test('检查isArrayNumber是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeFalsy();
    });
});

describe('检查isArray是否正常', () => {
    let checker = isArray;
    test('检查isArray是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isArray是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isArray是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isArray是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isArray是否能检查array', () => {
        expect(checker(array)).toBeTruthy();
    });
    test('检查isArray是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeTruthy();
    });
    test('检查isArray是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeTruthy();
    });
    test('检查isArray是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeTruthy();
    });
});

describe('检查isArrayBoolean是否正常', () => {
    let checker = isArrayBoolean;
    test('检查isArrayBoolean是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeFalsy();
    });
    test('检查isArrayBoolean是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeTruthy();
    });
});

describe('检查isArrayObject是否正常', () => {
    let checker = isArrayObject;
    test('检查isArrayObject是否能检查string', () => {
        expect(checker(string)).toBeFalsy();
    });
    test('检查isArrayObject是否能检查number', () => {
        expect(checker(number)).toBeFalsy();
    });
    test('检查isArrayObject是否能检查object', () => {
        expect(checker(object)).toBeFalsy();
    });
    test('检查isArrayObject是否能检查boolean', () => {
        expect(checker(boolean)).toBeFalsy();
    });
    test('检查isArrayObject是否能检查array', () => {
        expect(checker(array)).toBeFalsy();
    });
    test('检查isArrayObject是否能检查arrayObject', () => {
        expect(checker(arrayObject)).toBeTruthy();
    });
    test('检查isArrayObject是否能检查arrayNumber', () => {
        expect(checker(arrayNumber)).toBeFalsy();
    });
    test('检查isArrayObject是否能检查arrayBoolean', () => {
        expect(checker(arrayBoolean)).toBeFalsy();
    });
});
