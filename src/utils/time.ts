// 获取当前时间状态函数
export const getTime = () => {
  // 通过内置构造函数Date
  const hours = new Date().getHours();
  console.log(hours, "==hours");
  if (hours <= 9) {
    return "早上好";
  } else if (hours <= 12) {
    return "上午好";
  } else if (hours <= 18) {
    return "下午好";
  } else {
    return "晚上好";
  }
};
