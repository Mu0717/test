// 品牌管理模块接口
import request from "@/utils/request";
// 品牌管理模块接口地址
enum API {
  // 获取品牌接口
  TRADEMARK_URL = "/admin/product/baseTrademark",
  // 添加品牌接口
  ADDTRADEMARK_URL = "/admin/product/baseTrademark/save",
  // 修改品牌接口
  UPDATETRADEMARK_URL = "/admin/product/baseTrademark/update",
  // 删除品牌接口
  DELETETRADEMARK_URL = "/admin/product/baseTrademark/remove",
}
import type { TradMarkResponseData, TradMark } from "./type";
// 获取品牌接口函数
/**
 * @param page 获取第几页 --默认第一页
 * @param limit 一页返回多少数据
 */ // 第一个泛型表示url传参,第二个后端返回值类型
export const reqHasTrademark = (page: number, limit: number) => {
  return request.get<string, TradMarkResponseData>(
    `${API.TRADEMARK_URL}/${page}/${limit}`,
  );
};

// 添加与修改已有品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradMark) => {
  // 判断是否携带ID，如果有ID则修改数据
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data);
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data);
  }
};
// 删除品牌接口
export const reqDeleteOrUpdateTrademark = (id: number) =>
  request.delete<string, any>(`${API.DELETETRADEMARK_URL}/${id}`);
