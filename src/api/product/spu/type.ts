// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
// spu数据类型
export interface SpuData {
  id?: number;
  spuName: string;
  description: string;
  category3Id: string | number;
  tmId: number | string;
  spuSaleAttrList: null | SaleAttr[];
  spuImageList: null | Array<SpuImg>;
}
// 数组:元素都是已有SPU数据类型
export type Records = Array<SpuData>;
// 定义获取已有的spu接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    searchCount: boolean;
    pages: number;
  };
}

// 品牌数据的Ts类型
export interface Trademark {
  id: number;
  tmName: string;
  logoUrl: string;
}
// 品牌接口返回的数据类型
export interface AllTradMark extends ResponseData {
  data: Trademark[];
}
// 商品图片的ts类型
export interface SpuImg {
  id?: number;
  createTime?: string;
  updateTime?: string;
  spuId?: number;
  imgName?: string;
  imgUrl?: string;
  name?: string;
  url?: string;
}
// 图片接口返回的数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[];
}
// 已有销售属性的数据类型
export interface SaleAttrValue {
  id?: number;
  createTime?: null;
  updateTime?: null;
  spuId?: number;
  baseSaleAttrId: number | string;
  saleAttrValueName: string;
  saleAttrName?: string;
  isChecked?: null;
}
// 存储已有销售属性数组类型
export type spuSaleAttrValueList = SaleAttrValue[];
// 销售属性对象的ts类型
export interface SaleAttr {
  id?: number;
  createTime?: null;
  updateTime?: null;
  spuId?: number;
  baseSaleAttrId: number | string;
  saleAttrName: string;
  spuSaleAttrValueList: spuSaleAttrValueList;
  flag?: Boolean,
  saleAttrValue?: string,
  saleIdAndValueId?: string
}
// spu已有的销售属性接口返回的ts数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[];
}

// 销售属性Ts数据类型
export interface HasSaleAttr {
  id: number;
  name: string;
}
// 销售属性接口返回的Ts数据类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[];
}

export interface Attr {
  id?:number,
  valueName?:string,
  attrId: number | string,
  valueId: number | string,
}

export interface saleAttr {
  id?:number,
  saleAttrValueName?:string,
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}
export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  id?: number,
  skuAttrValueList?: Attr[],
  skuDefaultImg: string,
  skuSaleAttrValueList?: saleAttr[],
  isSale?:number,
}

// 获取sku数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
