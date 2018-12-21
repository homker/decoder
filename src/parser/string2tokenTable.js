import {
    filterEmpty
} from "../helper/tools";



/**
 * string 装换成token表。是一个二维数组。[[],[]]
 * 每一个token item {type:'keyword|common|type', content:'', cloumn:0, line:0 }
 * @param {string} str 字符串
 * @param {number} dimension 维数 1 or 2 如果是1维则返回一个一维数组，二维则按行划分
 */
export function getTokenTable(str, dimension = 1) {
    var lines = str.split("/n")
    let result = lines.map((line, lineNum) => {
        var cloumns = line.split(" ")
        return cloumns.map((cloumn) => {
            let base = {
                cloumn: cloumn.indexOf(line),
                line: lineNum
            }
            if (TOKEN[cloumn]) { // 如果是关键字，则标记为关键字
                return Object.assign({}, base, {
                    type: 'keyword',
                    content: TOKEN[cloumn]
                })
            } else if (cloumn) { //不是关键字 并且不是空格
                return Object.assign({}, base, {
                    type: 'common',
                    content: cloumn
                })
            }
        })
    })
    let resultArr = result.filter(filterEmpty)
    return dimension === 2 ? resultArr : resultArr.join()
}
/**
 * 获取从标记位之后的，所有内容
 * @param {array} jceArray 
 * @param {*} pos 从此位置之后返回
 */
export function getLastArray(jceArray, start, end) {
    return start ? jceArray.slice(start) : end ? jceArray.slice(start, end) : jceArray
}


/**
 * 根据输入的内容，返回从pos到内容位置的数组内容
 * @param {array} tokenArray 
 * @param {number} dimension 
 * @param {string} content
 * @param {number} pos
 * @param {number} line
 */
export function getArrayFromTokens(tokenArray, dimension, content, pos, line) {
    let result = []

    return result
}