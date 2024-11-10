import request from "@/utils/request";
import {
  HasSpuResponseData,
  AllTradMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData
} from "./type.ts";
enum API {
  HASSPU_URL = "/admin/product", // 获取spu数据
  ALLTRADEMARK_URL = "/admin/product/baseTrademark/getTrademarkList", // 获取全部品牌数据
  IMAGE_URL = "/admin/product/spuImageList", // 获取某个SPU下的全部的售卖商品的图片数据
  SPUHASSALEATTR_URL = "/admin/product/spuSaleAttrList", // 获取SPU下的销售属性接口
  baseSaleAttrList = "/admin/product/baseSaleAttrList", // 获取整个项目的销售属性
  save = "/admin/product/saveSpuInfo", // SPU保存接口
  update = "/admin/product/updateSpuInfo", // SPU保存接口
  saveSkuInfo = "/admin/product/saveSkuInfo", // sku保存接口
  updateSkuInfo = "/admin/product/updateSkuInfo", // sku更新接口
  findBySpuId = '/admin/product/findBySpuId/', // 查看sku列表接口
  deleteSpu = '/admin/product/deleteSpu/' // spu删除
}
// 获取spu数据
export const reqHassSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `/${page}/${limit}?category3Id=${category3Id}`,
  );
// 获取全部的SPU的品牌数据
export const reqAllTradeMark = () =>
  request.get<any, AllTradMark>(API.ALLTRADEMARK_URL);
// 获取某一个SPU下全部的图片地址
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + `/${spuId}`);
// 获取SPU下的销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + `/${spuId}`);
// 获取全部的额销售属性
export const reqBaseSaleAttrList = () =>
  request.get<any, HasSaleAttrResponseData>(API.baseSaleAttrList);

// SPU保存或更新
export const spuSaveOrUpdate = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.update, data);
  } else {
    return request.post<any, any>(API.save, data);
  }
};

// 添加/修改sku
export const skuSaveOrUpdate = (data: SkuData) => {
  if (data.id) {
    return request.post<any, any>(API.updateSkuInfo, data);
  } else {
    return request.post<any, any>(API.saveSkuInfo, data);
  }
}

// 查看sku列表接口
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.findBySpuId + spuId);

// spu删除接口
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.deleteSpu + spuId);