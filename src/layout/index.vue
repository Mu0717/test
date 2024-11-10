<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: SettingStore.fold }">
      <Logo></Logo>
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          backgroundColor="#001529"
          textColor="white"
          :default-active="$route.path"
          :collapse="SettingStore.fold"
        >
          <!-- 动态生成菜单路由 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: SettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 中间内容 -->
    <div class="layout_main" :class="{ fold: SettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts" name="layout">
// 获取路由对象
import { useRoute } from "vue-router";
import Logo from "./logo/index.vue";
import Menu from "./menu/index.vue";
import Main from "./main/index.vue";
import Tabbar from "./tabbar/index.vue";
// 获取用户相关的小仓库
import useUserStore from "@/store/modules/user";
import { useLayOutSettingStore } from "@/store/modules/setting";
// 获取路由对象
const $route = useRoute();
let userStore = useUserStore();
const SettingStore = useLayOutSettingStore();
// console.log($route.path,$route,'===$router');
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  background: red;

  .layout_slider {
    width: $base-menu-width;
    background: $base-menu-background;
    height: 100%;
    color: white;
    transition: all 0.3s;

    .scrollbar {
      color: white;
      height: calc(100vh - $base-tabbar-height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: green;
    position: fixed;
    left: $base-menu-width;
    top: 0;
    background: white;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    width: calc(100% - $base-menu-width);
    position: absolute;
    height: calc(100% - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    background: white;
    padding: 20px;
    transition: all 0.3s;
    overflow-y: auto;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
