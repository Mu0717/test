<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        icon="Plus"
        type="primary"
        :disabled="!categoryStore.c3Id"
        @click="addAttr"
      >
        添加属性
      </el-button>
      <el-table border :data="attrArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="属性名称"
          width="120px"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <template #default="{ row }">
            <el-tag
              v-for="item in row.attrValueList"
              :key="item.id"
              style="margin: 5px"
              >{{ item.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              circle
              @click="updateAttr(row)"
            />
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="Delete"
              icon-color="red"
              title="确定执行?"
              @confirm="deleteAttr(row.id)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete" circle />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="scene == 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input
            placeholder="请你输入属性名称"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        icon="Plus"
        type="primary"
        :disabled="!attrParams.attrName"
        @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-button @click="cancel">取消</el-button>
      <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <template #default="{ row, $index }">
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              placeholder="请你输入属性值名称"
              v-model.trim="row.valueName"
              v-if="row.flag"
              @blur="toLook(row, $index)"
              size="small"
            />
            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="属性值操作">
          <template #default="{ $index }">
            <el-button
              type="danger"
              icon="Delete"
              circle
              size="small"
              @click="attrParams.attrValueList.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="Plus" type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="attr">
// 引入watch侦听器
import { ref, watch, reactive, nextTick, onBeforeUnmount } from "vue";
// 获取已有属性接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from "@/api/product/attr";
import {
  AttrResponseData,
  Attr,
  AttrList,
  AttrValue,
} from "@/api/product/attr/type";
// 获取分类的仓库
import useCategoryStore from "@/store/modules/category";
import { ElMessage, ElInput } from "element-plus";

const categoryStore = useCategoryStore();
const attrArr = ref<AttrList>([]);
// 定义card组件内容切换变量
const scene = ref<number>(0); // 0:显示table 1:显示属于添加结构
// 准备一个存储input实际组件数组
let inputArr = ref<Array<InstanceType<typeof ElInput> | null>>([]); // 为组件模板引用标注类型
// 收集新增的属性数据
const attrParams = reactive<Attr>({
  attrName: "", // 新增的属性名字
  attrValueList: [], // 新增的属性值数组
  categoryId: "", // 三级分类ID
  categoryLevel: 3, // 代表的值是三级分类
});
// 监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  (newVal) => {
    // 清空上一次查询的数据
    attrArr.value = [];
    if (!newVal) return;
    // 获取分类的ID
    getAttr();
  },
);
// 获取已有属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
};
// 添加属性按钮的回调
const addAttr = () => {
  /* attrParams.attrName = ''
  attrParams.attrValueList = [] */
  Object.assign(attrParams, {
    attrName: "", // 新增的属性名字
    attrValueList: [], // 新增的属性值数组
    categoryId: categoryStore.c3Id, // 三级分类ID
    categoryLevel: 3, // 代表的值是三级分类
  });
  delete attrParams.id;
  scene.value = 1; // 切换为添加修改属性结构
};

// 编辑
const updateAttr = (row: Attr) => {
  console.log(row);
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
  scene.value = 1; // 切换为添加修改属性结构
};
// 取消
const cancel = () => {
  scene.value = 0; // 切换为添加修改属性结构
};
// 添加属性按钮回调
const addAttrValue = () => {
  // 点击按钮往数组添加属性值对象
  attrParams.attrValueList.push({
    valueName: "", // 属性值名称
    flag: true, // 控制是否显示输入框
  });
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1]?.focus();
  });
};
// 保存按钮
const save = async () => {
  console.log(attrParams, "====attrParams");
  const result: any = await reqAddOrUpdateAttr(attrParams);
  console.log(result, "===result");
  if (result.code == 200) {
    scene.value = 0;
    ElMessage.success(attrParams.id ? "修改成功" : "添加成功");
    // 表格刷新
    getAttr();
  } else {
    ElMessage.error(attrParams.id ? "修改失败" : "添加失败");
  }
};
// 输入框失焦事件
const toLook = (row: AttrValue, index: number) => {
  if (row.valueName == "") {
    attrParams.attrValueList.splice(index, 1);
    // 提示信息
    ElMessage.error("属性值不能为空");
    return;
  }
  // 属性名称不能相同
  const item = attrParams.attrValueList.find((v) => {
    if (v != row) {
      return v.valueName == row.valueName;
    }
  });
  if (item) {
    attrParams.attrValueList.splice(index, 1);
    // 提示信息
    ElMessage.error("属性值不能重复");
    return;
  }
  // 将相应的属性值对象flag改为false
  row.flag = false;
};
const toEdit = (row: AttrValue, index: number) => {
  // 将相应的属性值对象flag改为true
  row.flag = true;
  nextTick(() => {
    inputArr.value[index]?.focus();
  });
};
// 属性删除
const deleteAttr = async (attrId: number) => {
  const result = await reqRemoveAttr(attrId);
  if (result.code == 200) {
    ElMessage.success("删除成功");
    getAttr();
  } else {
    ElMessage.error("删除失败");
  }
};
// 当组件销毁的时候，把分类数据清空
onBeforeUnmount(() => {
  // 清空分类仓库数据
  categoryStore.$reset();
});
</script>

<style scoped></style>
