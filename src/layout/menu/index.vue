<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.meta.hidden">
      <el-menu-item v-if="!item.children" :index="item.path" @click="goRoute">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span></template
        >
      </el-menu-item>
    </template>
    <!-- 有子路由并且只有一个 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title
          ><span>{{ item.children[0].meta.title }}</span></template
        >
      </el-menu-item>
    </template>

    <!-- 有子路由并且有多个 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon> <component :is="item.meta.icon"></component> </el-icon
        ><span>{{ item.meta.title }}</span></template
      >
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts" name="Menu">
// 获取父组件传递过来的路由数据
defineProps(["menuList"]);
import { useRouter } from "vue-router";
const $router = useRouter();
// 点击菜单的回调
const goRoute = (vc: any) => {
  // console.log(vc, $router, "===goRoute");
  $router.push(vc.index);
};
</script>
<style scoped></style>
