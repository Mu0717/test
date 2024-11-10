import { ResponseData, SkuData } from "../spu/type.ts"
// 获取sku列表数据类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[],
    total: number,
    size: number,
    current: number,
    orders: Array<any>,
    optimizeCountSql: Boolean,
    hitCount: Boolean,
    countId: null,
    maxLimit: null,
    searchCount: Boolean,
    pages: number
  }
}
// 获取sku详情数据类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}