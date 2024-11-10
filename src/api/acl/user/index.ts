// 用户管理模块接口
import request from '@/utils/request'
import { UserResponseData, User, AllRolesResponseData, SetRoleData } from "./type.ts"
enum API {
  GET_USER = '/admin/acl/user/', // 获取用户信息
  USER_SAVE = '/admin/acl/user/save', // 新增用户信息
  UPDATE_SAVE = '/admin/acl/user/update', // 修改用户信息
  ToAssign = '/admin/acl/user/toAssign/', // 获取用户角色数据
  doAssignRole = '/admin/acl/user/doAssignRole', // 给用户分配角色
  Remove = '/admin/acl/user/remove/', // 删除用户
  BatchRemove = '/admin/acl/user/batchRemove', // 批量删除用户
}
export const getUser = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.GET_USER + `${page}/${limit}`, { params: { username } })
export const SaveOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_SAVE, data)
  } else {
    return request.post<any, any>(API.USER_SAVE, data)
  }
}
// export const SaveOrUpdateUser = (data: User) => request[data.id ? 'put' : 'post']<any,any>(API.UPDATE_SAVE, data)
export const getToAssign = (id: number) => request.get<any, AllRolesResponseData>(API.ToAssign + `${id}`)
export const setAssignRole = (data: SetRoleData) => request.post<any, any>(API.doAssignRole, data)
export const removeUser = (id: number) => request.delete<any, any>(API.Remove + `${id}`)
export const batchRemoveUser = (idList: number[]) => request.delete<any, any>(API.BatchRemove, { data: idList })