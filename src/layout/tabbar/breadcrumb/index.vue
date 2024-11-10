<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <!-- <Fold /> -->
    <component :is="SettingStore.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="item in $route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="vertical-align: middle; margin-right: 5px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import { useRoute } from "vue-router";
import { useLayOutSettingStore } from "@/store/modules/setting";
const SettingStore = useLayOutSettingStore();
// console.log(SettingStore.fold);
const $route = useRoute();
const changeIcon = () => {
  SettingStore.fold = !SettingStore.fold;
};
</script>

<style scoped></style>
