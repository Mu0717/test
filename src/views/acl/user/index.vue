<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input
          placeholder="请输入搜索用户名"
          v-model.trim="keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList()"> 搜索 </el-button>
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
    <el-button type="primary" @click="addUser"> 添加用户 </el-button>
    <el-button
      type="primary"
      @click="batchDelUser"
      :disabled="selectIds.length === 0"
    >
      批量删除
    </el-button>
    <el-table border :data="userArr" @selection-change="selectChang">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index" width="55"></el-table-column>
      <el-table-column label="用户ID" prop="id"></el-table-column>
      <el-table-column
        label="用户名称"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px">
        <template #default="{ row }">
          <el-button
            type="primary"
            icon="user"
            size="small"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            icon="edit"
            size="small"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm title="确定执行此操作?" @confirm="delUser(row)">
            <template #reference>
              <el-button type="primary" icon="delete" size="small">
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
      @current-change="getUserList"
      @size-change="getUserList()"
    />
    <!-- 新增/编辑 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>用户信息新增/编辑</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="form">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请输入用户姓名"
              v-model.trim="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请输入用户昵称"
              v-model.trim="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请输入用户密码"
              v-model.trim="userParams.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-drawer>
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input
              placeholder="请输入用户姓名"
              v-model.trim="userParams.username"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="userRoles"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="v in allRoles" :key="v.id" :label="v">
                {{ v.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="save1">确定</el-button>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="user">
import { ref, onMounted, reactive } from "vue";
import {
  getUser,
  SaveOrUpdateUser,
  getToAssign,
  setAssignRole,
  removeUser,
  batchRemoveUser,
} from "@/api/acl/user";
import {
  UserResponseData,
  Records,
  User,
  AllRolesResponseData,
  AllRoles,
  allRole,
} from "@/api/acl/user/type";
import { ElMessage, FormRules, FormInstance } from "element-plus";
import { useLayOutSettingStore } from "@/store/modules/setting";
const settingStore = useLayOutSettingStore();
const pageNo = ref<number>(1);
const pageSize = ref<number>(5);
const total = ref<number>(0);
const userArr = ref<Records>([]);
const drawer = ref<boolean>(false);
const drawer1 = ref<boolean>(false);
const userParams = reactive<User>({
  username: "",
  name: "",
  password: "",
});
const checkAll = ref<boolean>(false);
const isIndeterminate = ref<boolean>(false);
const allRoles = ref<AllRoles>([]); // 当前用户可设置角色
const userRoles = ref<AllRoles>([]); // 存储当前用户已有角色
const selectIds = ref<number[]>([]);
const keyWord = ref<string>("");
const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (value.length < 5) {
    callback(new Error("用户名不能少于5位"));
  } else {
    callback();
  }
};
const validatorName = (_rule: any, value: any, callback: any) => {
  if (value.length < 5) {
    callback(new Error("用户昵称不能少于5位"));
  } else {
    callback();
  }
};
const validatorPassWord = (_rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    callback(new Error("用户密码不能少于6位"));
  } else {
    callback();
  }
};
const form = ref<FormInstance>();
const rules = reactive<FormRules<User>>({
  username: [{ required: true, trigger: "blur", validator: validatorUserName }],
  name: [{ required: true, trigger: "blur", validator: validatorName }],
  password: [{ required: true, trigger: "blur", validator: validatorPassWord }],
});
const getUserList = async (pager = 1) => {
  pageNo.value = pager;
  const result: UserResponseData = await getUser(
    pageNo.value,
    pageSize.value,
    keyWord.value
  );
  total.value = result.data.total;
  userArr.value = result.data.records;
};
const addUser = () => {
  form.value?.clearValidate();
  Object.assign(userParams, {
    username: "",
    name: "",
    password: "",
    id: "",
  });
  drawer.value = true;
};
const updateUser = (row: User) => {
  form.value?.clearValidate();
  Object.assign(userParams, row);
  drawer.value = true;
};
const save = async () => {
  await form.value?.validate();
  const result: any = await SaveOrUpdateUser(userParams);
  if (result.code == 200) {
    drawer.value = false;
    getUserList(userParams.id ? 1 : pageNo.value);
    ElMessage.success(userParams.id ? "更新成功" : "添加成功");
    userParams.id && window.location.reload();
  } else {
    ElMessage.error("操作失败");
  }
};
const setRole = async (row: User) => {
  Object.assign(userParams, row);
  const result: AllRolesResponseData = await getToAssign(
    userParams.id as number
  );
  if (result.code == 200) {
    allRoles.value = result.data.allRolesList;
    userRoles.value = result.data.assignRoles;
    handleCheckedCitiesChange(userRoles.value);
    drawer1.value = true;
  }
};
const handleCheckAllChange = (val: boolean) => {
  userRoles.value = val ? allRoles.value : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: AllRoles) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === allRoles.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length;
};
const save1 = async () => {
  const params = {
    userId: userParams.id as number,
    roleIdList: userRoles.value.map((v: allRole) => v.id) as Array<number>,
  };
  const result: any = await setAssignRole(params);
  if (result.code == 200) {
    getUserList(pageNo.value);
    ElMessage.success("操作成功");
    drawer1.value = false;
  } else {
    ElMessage.error("操作失败");
  }
};
const delUser = async (row: User) => {
  const result: any = await removeUser(row.id as number);
  if (result.code == 200) {
    getUserList(pageNo.value);
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
};
const selectChang = <T extends User>(selection: T[]) => {
  selectIds.value = selection.map((v: T) => v.id) as Array<number>;
};
const batchDelUser = async () => {
  const result: any = await batchRemoveUser(selectIds.value);
  if (result.code == 200) {
    getUserList(pageNo.value);
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
};
onMounted(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
