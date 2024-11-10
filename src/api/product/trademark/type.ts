export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
/* 已有品牌的ts数据类型 */
export interface TradMark {
  id?: number;
  tmName: string;
  logoUrl: string;
}
/**包含全部品牌的ts类型 */
export type Records = TradMark[];

// 获取已有全部品牌的数据ts类型
export interface TradMarkResponseData extends ResponseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    searchCount: Boolean;
    pages: number;
  };
}
