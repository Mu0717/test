import request from '@/utils/request'
import type { RoleResponseData, AssignResponseData } from './type'
import type { allRole } from "../user/type"
enum API {
  role = '/admin/acl/role/',
  save = '/admin/acl/role/save',
  update = '/admin/acl/role/update',
  toAssign = '/admin/acl/permission/toAssign/',
  doAssign = '/admin/acl/permission/doAssign/',
  remove = '/admin/acl/role/remove/',
}
export const getRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(`${API.role}${page}/${limit}`, { params: { roleName } })
export const reqSaveOrUpdateRole = (params: allRole) => {
  if (params.id) {
    return request.put<any, any>(API.update, params)
  } else {
    return request.post<any, any>(API.save, params)
  }
}
export const getToAssign = (roleId: number) => request.get<any, AssignResponseData>(`${API.toAssign}${roleId}`)
export const reqDoAssign = (params: { roleId: number, permissionId: string }) => request.post<any, any>(`${API.doAssign}?roleId=${params.roleId}&permissionId=${params.permissionId}`) // 给角色分配权限

export const reqRemoveRole = (id: number) => request.delete<any, any>(API.remove + id) // 删除角色