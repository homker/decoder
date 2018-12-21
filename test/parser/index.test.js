const parser = require('../../src/parser/index')
const fileReader = require('../../src/reader/fileReader')


describle('检查parser逻辑是否正常', () => {
    let path = './test.jce'
    test('fileReader是否正常', () => {
        let ast = parser(fileReader(path))
    })
})