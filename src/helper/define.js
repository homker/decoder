/**
 * @description 把所有的定义都在这个文件完成
 * @author homkerliu
 * @date 2018-11-17
 */

/**
 *           void    ：只能在函数的返回值表示
 l           bool    ：布尔类型，映射到taf::Bool
 l           byte    ：有符号字符，映射到 taf::Char
 l           short   ：有符号短整型，映射到 taf::Short
 l           int     ：有符号整型，映射到 taf::Int32
 l           long    ：有符号长整型，映射到 taf::Int64
 l           float   ：映射到taf::Float
 l           double  ：映射到taf::Double
 l           string  ：映射到 std::string，java:String
 l           unsigned byte ：无符号字符,c++映射到 unsigend char 其它版本taf::Short
 l           unsigned short：无符号短整形c++映射到 unsigned short其它版本 taf::Int32
 l           Unsigned int:无符号整形c++映射到 unsigned int其它版本 taf::Int64
 */

// 所有的关键字
export const MKEYTOKENS = "struct|interface|module".split('|'); //多行的内容，必须是以这些关键词开头
export const LKEYTOKENS = "key|routekey|out|enum|const|#include".split('|'); //单行的内容
export const TYPETOKENS = "void|bool|byte|short|int|long|float|double|string|unsigned byte|unsigned short|Unsigned int".split('|'); // 类型关键字，如果类型不在这个列表之列，要考虑include的内容 或者报错
export const OPTIONSTOKEN = "require|optional".split("|"); // 标记是否是必须
export const LINECOMMENTTOKENS = "\/\/"; // 单行注释
export const MCOMMENTTOKEN = "\/*"; // 多行注释

// 统一换行符
export const WRAP = "\n"; // 换行

// tokenTable 中的token item 所有类型
export const LINE_COMMENT = 'lineComment';
export const MULTI_COMMENT = 'multiComment';
export const OPTION = 'option';
export const LKEY = 'lineKey';
export const MKEY = 'multiKey';
export const TYPE = 'type';
