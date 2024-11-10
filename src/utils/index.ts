/**
 * 小驼峰转大驼峰 例如:size-change -> onSizeChange
 * @param key 
 * @returns 
 */
export const GreatHump = (key: string): string => {
  return (
    "on" +
    (key.match(/[a-z]+/gi) as string[]) // 匹配所有单词
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
      ) // 首字母大写，其余小写
      .join("")
  ); // 将处理过的单词重新拼接成字符串
};