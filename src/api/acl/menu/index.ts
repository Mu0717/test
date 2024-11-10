import request from "@/utils/request";
import { PermissionResponseData, MenuParams } from "./type.ts"
// 枚举地址
enum API {
  // 获取全部菜单与按钮的标识数据
  permission = '/admin/acl/permission',
  save = '/admin/acl/permission/save',
  update = '/admin/acl/permission/update',
  remove = '/admin/acl/permission/remove/'
}
export const getPermission = () => request.get<any, PermissionResponseData>(API.permission)
export const AddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.update, data)
  } else {
    return request.post<any, any>(API.save, data)
  }
}
export const removeMenu = (id: number) => request.delete<any, any>(API.remove + id)