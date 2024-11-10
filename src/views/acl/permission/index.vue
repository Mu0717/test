<template>
  <el-table :data="PermissionArr" style="width: 100%" row-key="id" border>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="primary" size="small" :disabled="row.level == 4" @click="addPermission(row)">
          {{ row.level == 3 ? '添加功能' : '添加菜单'
          }}
        </el-button>
        <el-button type="primary" size="small" :disabled="row.level == 1" @click="updatePermission(row)">编辑</el-button>
        <el-popconfirm title="确定执行此操作?" @confirm="removePermission(row)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1">
              删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件 -->
  <el-dialog v-model="dialogVisible" title="添加/编辑" width="500">
    <el-form label-width="60" :model="menuData" :rules="rules" ref="ruleFormRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入内容" v-model="menuData.name" />
      </el-form-item>
      <el-form-item label="权限" prop="code">
        <el-input placeholder="请输入内容" v-model="menuData.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="permission">
import { onMounted, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getPermission, AddOrUpdateMenu, removeMenu } from "@/api/acl/menu"
import type { PermissionResponseData, PermissionList, Permission, MenuParams } from "@/api/acl/menu/type"
const PermissionArr = ref<PermissionList>([])
const dialogVisible = ref<boolean>(false)
const ruleFormRef = ref<any>()
const menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  pid: 0,
  name: '',
})
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限', trigger: 'blur' }],
})
onMounted(() => {
  getHasPermission()
})
const getHasPermission = async () => {
  const result: PermissionResponseData = await getPermission()
  if (result.code !== 200) return
  const { data } = result
  PermissionArr.value = data
}
const addPermission = (row: Permission) => {
  ruleFormRef.value?.resetFields()
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    pid: 0,
    name: '',
  })
  menuData.level = row.level + 1
  menuData.pid = row.id
  dialogVisible.value = true
}
const updatePermission = (row: Permission) => {
  ruleFormRef.value?.resetFields()
  Object.assign(menuData, row)
  dialogVisible.value = true
}
const save = async () => {
  await ruleFormRef.value?.validate()
  const result: any = await AddOrUpdateMenu(menuData)
  if (result.code !== 200) return
  ElMessage.success(result.message)
  dialogVisible.value = false
  getHasPermission()
}
const removePermission = async (row: Permission) => {
  const result: any = await removeMenu(row.id)
  if (result.code !== 200) return
  ElMessage.success(result.message)
  getHasPermission()
}
</script>

<style lang="scss" scoped></style>
