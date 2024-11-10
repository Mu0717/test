// 账号信息ts类型
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean,
}
// 账号信息ts类型
export interface User {
  id?: number,
  createTime?: string,
  updateTime?: string,
  username: string,
  password: string,
  name: string,
  phone?: null,
  roleName?: string
}
export type Records = User[]
export interface UserResponseData extends ResponseData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    pages: number
  }
}
// 用户角色数据类型
export interface allRole {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark?: null | string
}
export type AllRoles = allRole[]
export interface AllRolesResponseData extends ResponseData {
  data: {
    assignRoles: AllRoles,
    allRolesList: AllRoles,
  }
}
// 给用户设置角色接口数据类型
export interface SetRoleData {
  roleIdList: Array<number>,
  userId: number
}