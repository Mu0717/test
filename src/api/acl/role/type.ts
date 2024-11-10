import type { ResponseData, AllRoles } from "../user/type"
export interface RoleResponseData extends ResponseData {
  data: {
    records: AllRoles,
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}
export interface PermissionNode {
  id: number;
  createTime: string;
  updateTime: string;
  pid: number;
  name: string;
  code: string | null;
  toCode: string | null;
  type: number;
  status: null | any; // 如果status有确定的类型或枚举值，请替换any
  level: number;
  children?: PermissionTree;
  select: boolean;
}
export type PermissionTree = PermissionNode[];

export interface AssignResponseData extends ResponseData {
  data: PermissionTree
}
