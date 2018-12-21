# jce-parser

基于javascript的jce编解码器。

> jce是一种协议描述语言，是Tencent内部私有的一种协议。

## 本工具箱提供以下工具。 对外暴露 cli & js export 两种形式。

### 基于Buffer/ArrayBuffer 的decode & encode 工具。

- 在浏览器环境，基于arrayBuffer实现jce stream的编解码。 input 一个ArrayBuffer， output一个js object
- 在node端，基于Buffer实现编解码。

### jce 2 json的协议描述工具

- jce本质是一种对于协议的描述文法，json则包含两种 协议的描述 & 协议的内容。 协议的内容，通过上述的编解码工具可以解决，协议的描述，则依赖本工具。输入一个jce文件，得到若干个等价的json描述结构体。

- jce本身的json描述结构。基于js实现的jce的AST输出。输入一个jce，得到一个描述该jce的以json为格式的AST
