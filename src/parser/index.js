import {
    KEY,
    LINE_COMMENT,
    MULTI_COMMENT,
    OPTION,
    TOP,
    TOP_KEY,
    TYPE
} from "../helper/define";
import {
    arr2obj,
    filterEmpty,
    getId,
    trim
} from "../helper/tools";
import {
    isString
} from '../helper/typeChecker'
import {
    getTokenTable
} from "./string2tokenTable";



let tokenMap = null

/**
 * 获取token映射表
 * @returns {*}
 */
function getTOKENMap() {
    if (tokenMap) {
        return tokenMap
    }
    tokenMap = {
        [LINE_COMMENT]: arr2obj([LINECOMMENTTOKENS]),
        [MULTI_COMMENT]: arr2obj([MCOMMENTTOKEN]),
        [OPTION]: arr2obj(OPTIONSTOKEN),
        [TOP_KEY]: arr2obj(TOPKEYTOKEN),
        [KEY]: arr2obj(KEYTOKENS),
        [TYPE]: arr2obj(TYPETOKENS),
        [TOP]: arr2obj(TOPTOKENS)
    }
    return tokenMap
}




/**
 * @desc 根据输入的jce string
 * @param string
 */
function parserJce(string) {
    if (isString(string)) {
        // 把回车换行统一,把所有的分号去掉
        return lexClassifier(string.replace(/(?:[\r\n]\s*)+/g, WRAP).replace(new RegExp(';', 'g'), '')) 
    }
    throw new TypeError('输入内容不是字符串')
}


/**
 * @desc 词法分析器 输入字符串，根据对应的规则，将字符串分类成各种标准的结构体
 * @param {string} jceString 输入jce的字符串
 * @returns {array} 分类结果
 * 一个标准的分类结果应该是
 *[
 * {
 *     id: 0 // 节点的id
 *     tag: 'lineComment', // 节点的类型
 *     type: '',// 节点的类型  其中如果是module/struct这种统称为struct类型
 *     content: '这是一段注释', // 节点的内容
 *     lineNum: 1, // 行数
 *     columnNum:1, // 列数
 *     children: [ // 子节点
 *          id, id, id
 *     ]
 * }
 * ]
 *
 * 
 * 分类器的过程如下：
 * 
 * 先处理字符串，把它变成带有行号，列号的词法表格。
 * 
 * 过滤掉空行和空格
 * 
 * 根据符号表对词法表格的匹配，进行分组
 * 
 * 分组的内容的得到的是简单语法树，然后对语法树做进一步的分析处理，得到完整的语法树
 * 
 */
function lexClassifier(jceString) {

    // 先构建校验用的对象
    let tokens = getObjByKey(getTOKENMap(), [LINE_COMMENT, MULTI_COMMENT, TOP_KEY, TOP])


    let pos = 0
    let length = jceString.length

    while (pos < length) {
        let line = getLine(jceString, pos)

    }


    // let lexTokensLines = jceString.split('\n').map(trim).filter(filterEmpty) //过滤掉空行
    // lexTokensLines.forEach((line, lineNum) => {
    //     let lexToken = line.split(' ').map(trim).filter(filterEmpty) //过滤空格
    //     lexToken.forEach((item, columnNum) => {
    //         for (let key in tokens) {
    //             if (tokens.hasOwnProperty(key)) {
    //                 if (tokens[key][item]) { // 如果属于关键字中的一种，进入到关键字的处理逻辑
    //                     // 关键的字的处理逻辑分三种，1是注释，如果是// 匹配1行，如果是/*匹配到*/ 2是一般性的闭合标记，从｛匹配到｝ 3是如果是include，处理一整行
    //                     switch (tokens[key]) {
    //                         case LINE_COMMENT: // 单行注释
    //                             addResultItem(LINE_COMMENT, line.slice(columnNum), lineNum, columnNum)
    //                             break
    //                         case MULTI_COMMENT:
    //                             matchMultiComment()
    //                             break
    //                         case TOP_KEY:
    //                             matchKey()
    //                             break
    //                         case TOP:
    //                             matchTop()
    //                             break
    //                     }
    //                 }
    //             }
    //         }
    //     })
    // })
}


function getLine(string, pos) {
    let end = string.indexOf(WRAP, pos);
    return end < 0 ? string.slice(pos) : string.slice(pos, end)
}


function matchLineComment(token, line, ) {

}

/**
 * 语义分析，判断语义内容是否合法
 * 
 * @param {array} tokenTable 
 */
function semanticAnalyzer(tokenTable){

}