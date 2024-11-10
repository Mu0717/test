// 属性管理模块接口
import request from "@/utils/request";
// 数据类型
import type { CategoryResponseData, AttrResponseData, Attr } from "./type";
// 属性管理模块接口地址
enum API {
  C1_URL = "/admin/product/getCategory1", // 一级分类接口地址
  C2_URL = "/admin/product/getCategory2", // 二级分类接口地址
  C3_URL = "/admin/product/getCategory3", // 三级分类接口地址
  ATTR_URL = "/admin/product/attrInfoList", // 获取对应分类下的属性接口
  ADDORUPDATEATTR_URL = "/admin/product/saveAttrInfo", // 属性添加/修改接口
  DELETEATTR_URL = "/admin/product/deleteAttr/", // 属性删除接口
}

// 获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);
// 获取二级分类的接口方法
export const reqC2 = (pid: number | string) =>
  request.get<any, CategoryResponseData>(`${API.C2_URL}/${pid}`);
// 获取三级分类的接口方法
export const reqC3 = (pid: number | string) =>
  request.get<any, CategoryResponseData>(`${API.C3_URL}/${pid}`);
//  获取对应分类下的属性
export const reqAttr = (
  c1id: number | string,
  c2id: number | string,
  c3id: number | string,
) =>
  request.get<any, AttrResponseData>(`${API.ATTR_URL}/${c1id}/${c2id}/${c3id}`);
// 属性新增或修改接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data);
// 属性删除接口
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId);
