<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索:">
        <el-input
          placeholder="请输入搜索位务名称"
          v-model.trim="keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRoleLists()"> 搜索 </el-button>
        <el-button
          type="primary"
          @click="settingStore.refsh = !settingStore.refsh"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button
      type="primary"
      style="margin-bottom: 10px"
      icon="Plus"
      @click="addRole"
    >
      添加角色
    </el-button>
    <el-table border :data="roleList">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index" width="55"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            icon="user"
            @click="settingRole(row)"
            >分配权限</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="updateRole(row)"
            icon="edit"
          >
            编辑</el-button
          >
          <el-popconfirm title="你确定执行此操作?" @confirm="delRole(row)">
            <template #reference>
              <el-button size="small" type="danger" icon="delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 10]"
      :background="true"
      layout="prev, pager, next, jumper, ->,sizes,total"
      :total="total"
      @current-change="getRoleLists"
      @size-change="getRoleLists()"
    />
    <el-dialog v-model="dialogVisible" title="角色 | 新增/编辑" width="500">
      <el-form :model="RoleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input
            placeholder="请你输入职位名称"
            v-model.trim="RoleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer" title="角色权限分配">
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handlerSave"> 确定 </el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="Role">
import { ref, onMounted, reactive } from "vue";
import { useLayOutSettingStore } from "@/store/modules/setting";
import {
  getRoleList,
  reqSaveOrUpdateRole,
  getToAssign,
  reqDoAssign,
  reqRemoveRole,
} from "@/api/acl/role";
import {
  RoleResponseData,
  AssignResponseData,
  PermissionTree,
  PermissionNode,
} from "@/api/acl/role/type";
import { AllRoles, allRole } from "@/api/acl/user/type";
import type { FormRules, FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
const keyWord = ref<string>("");
const settingStore = useLayOutSettingStore();
const pageNo = ref<number>(1);
const pageSize = ref<number>(3);
const total = ref<number>(0);
const roleList = ref<AllRoles>([]);
const dialogVisible = ref<boolean>(false);
const drawer = ref<boolean>(false);
const RoleParams = reactive<allRole>({ roleName: "" });
const defaultProps = {
  children: "children",
  label: "name",
};
const menuArr = ref<PermissionTree>([]);
const defaultCheckedKeys = ref<number[]>([]);
const form = ref<FormInstance>();
const tree = ref();
interface RuleForm {
  roleName: string;
}
const rules = reactive<FormRules<RuleForm>>({
  roleName: [
    {
      required: true,
      min: 2,
      message: "职位名称至少两位",
      trigger: "change",
    },
  ],
});
const getRoleLists = async (pager = 1) => {
  pageNo.value = pager;
  const result: RoleResponseData = await getRoleList(
    pageNo.value,
    pageSize.value,
    keyWord.value
  );
  if (result.code === 200) {
    total.value = result.data.total;
    roleList.value = result.data.records;
  }
};
onMounted(() => {
  getRoleLists();
});
const addRole = () => {
  dialogVisible.value = true;
  form.value?.resetFields();
  Object.assign(RoleParams, { roleName: "", id: 0 });
};
const updateRole = (row: allRole) => {
  Object.assign(RoleParams, row);
  dialogVisible.value = true;
};
const save = async () => {
  await form.value?.validate();
  const result = await reqSaveOrUpdateRole(RoleParams);
  if (result.code == 200) {
    ElMessage.success("操作成功");
    dialogVisible.value = false;
    getRoleLists(RoleParams.id ? pageNo.value : 1);
  } else {
    ElMessage.error("操作失败");
  }
};
const settingRole = async (row: allRole) => {
  drawer.value = true;
  Object.assign(RoleParams, row);
  const result: AssignResponseData = await getToAssign(row.id as number);
  menuArr.value = result.data;
  defaultCheckedKeys.value = filterSelectArr(menuArr.value, []);
};
const filterSelectArr = (
  allData: PermissionTree,
  initArr: number[]
): number[] => {
  allData.forEach((v: PermissionNode) => {
    if (v.select && v.level == 4) {
      initArr.push(v.id);
    } else if (v.children && v.children.length > 0) {
      filterSelectArr(v.children as PermissionTree, initArr);
    }
  });
  return initArr;
};
const handlerSave = async () => {
  console.log("[ handlerSave ] >");
  const params = {
    roleId: RoleParams.id as number,
    permissionId: [
      ...tree.value.getCheckedKeys(),
      ...tree.value.getHalfCheckedKeys(),
    ].toString(),
  };
  console.log("[ params ] >", params);
  const result = await reqDoAssign(params);
  if (result.code === 200) {
    ElMessage.success("操作成功");
    drawer.value = false;
    window.location.reload();
  } else {
    ElMessage.error("操作失败");
  }
  console.log("[ result ] >", result);
};
const delRole = async (row: allRole) => {
  const result: any = await reqRemoveRole(row.id as number);
  console.log("[ result ] >", result);
  if (result.code === 200) {
    ElMessage.success("操作成功");
    getRoleLists(roleList.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage.error("操作失败");
  }
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
