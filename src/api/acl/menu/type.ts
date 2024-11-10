// 数据类型定义
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}
// 菜单数据与按钮数的类型定义
export interface Permission {
  id: number,
  createTime: string,
  updateTime: string,
  pid: number,
  name: string,
  code: string,
  toCode: string,
  type: number,
  status: null,
  level: number,
  children?: PermissionList,
  select: Boolean
}
export type PermissionList = Array<Permission>

// 接口返回的数据类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}

// 添加 | 修改菜单数据类型
export interface MenuParams {
  id?: number,
  code: string,
  level: number,
  pid: number,
  name: string,
}