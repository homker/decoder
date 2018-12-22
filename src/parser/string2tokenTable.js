import {
    filterEmpty
} from "../helper/tools";


/**
 * string 装换成token表。是一个二维数组。[[],[]]
 * 每一个token item {type:'keyword|common|type', content:'', column:0, line:0 }
 * @param {string} str 字符串
 * @param {number} dimension 维数 1 or 2 如果是1维则返回一个一维数组，二维则按行划分
 */
export function getTokenTable(str, dimension = 1) {
    let lines = str.split("/n");
    let result = lines.map((line, lineNum) => {
        // TODO 在行号的最后，我们把回车符号以token对象的形式加回去，column为当前行数的最后一个
        let columns = line.split(" ");
        return columns.map((column, columnNum) => {
            let base = {
                column: columnNum, // 列号
                line: lineNum // 行号
            };
            // TODO 生成TOKEN大对象，里面要包含所有的关键字和标志字符
            if (TOKEN[column]) { // 如果是关键字，则标记为关键字
                return Object.assign({}, base, {
                    type: 'keyword',
                    content: TOKEN[column]
                })
            } else if (column) { //不是关键字 并且不是空格
                return Object.assign({}, base, {
                    type: 'normal',
                    content: column
                })
            }
        })
    });
    let resultArr = result.filter(filterEmpty);
    return dimension === 2 ? resultArr : resultArr.join()
}

/**
 * 获取从标记位之后的，所有内容
 * @param {array} jceArray
 * @param start
 * @param end
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
    let result = [];
    return result
}