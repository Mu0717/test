<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          @change="handler"
          :disabled="scene == 1"
        >
          <el-option
            v-for="c in categoryStore.c1Arr"
            :key="c.id"
            :value="c.id"
            :label="c.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          @change="handler2"
          :disabled="scene == 1"
        >
          <el-option
            v-for="c in categoryStore.c2Arr"
            :key="c.id"
            :value="c.id"
            :label="c.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene == 1">
          <el-option
            v-for="c in categoryStore.c3Arr"
            :key="c.id"
            :value="c.id"
            :label="c.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="Category">
import { onMounted } from "vue";
import useCategoryStore from "@/store/modules/category";
const categoryStore = useCategoryStore();
onMounted(() => {
  getC1();
});
const getC1 = async () => {
  categoryStore.getC1();
};
// 一级下拉菜单change事件
const handler = () => {
  /* 一级分类数据发生改变时将二级&&三级数据清空 */
  categoryStore.c2Id = "";
  categoryStore.c3Id = "";
  categoryStore.c3Arr = [];
  categoryStore.getC2();
};
// 二级下拉菜单change事件
const handler2 = () => {
  /* 二级分类数据发生改变时将三级数据清空 */
  categoryStore.c3Id = "";
  categoryStore.getC3();
};
// 接收父组件传递过来的值
defineProps({
  scene: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped></style>
