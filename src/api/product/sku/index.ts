import request from "@/utils/request";
import { SkuResponseData, SkuInfoData } from "./type";
enum API {
  SKU_LIST = '/admin/product/list/', // sku列表
  onSale = '/admin/product/onSale/', // 商品上架接口
  cancelSale = '/admin/product/cancelSale/', // 商品下架接口
  getSkuInfo = '/admin/product/getSkuInfo/', // sku详情获取接口
  deleteSku = '/admin/product/deleteSku/', // sku删除接口
}
// 获取sku列表请去
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_LIST + `${page}/${limit}`)
// 商品上架
export const reqOnSale = (skuId: number) => request.get<any, any>(API.onSale + skuId)
// 商品下架
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.cancelSale + skuId)
// 获取sku详情
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.getSkuInfo + skuId)
// sku删除接口
export const reqDeleteSku = (skuId: number) => request.delete<any, any>(API.deleteSku + skuId)