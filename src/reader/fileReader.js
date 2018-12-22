import Path from 'path'
import file from 'fs'

/**
 * @desc 根据路径来获取jce的string
 * @param path jce的绝对路径
 * @returns {string}
 */
export function fileReader(path) {
    if (Path.isAbsolute(path)) {
        return getFileStringByPath(path)
    }
    throw new Error(`[file reader error] ${path} , 路径必须为绝对路径`)
}


function getFileStringByPath(path) {
    if (file.existsSync(path)) {
        return file.readFileSync(path, 'utf8')
    }
    throw new Error(`[file reader error] ${path} ,file is not exist`)
}