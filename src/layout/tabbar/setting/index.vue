<template>
  <el-button
    type="primary"
    size="small"
    icon="Refresh"
    circle
    @click="SettingStore.refsh = !SettingStore.refsh"
  ></el-button>
  <el-button
    type="primary"
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button type="primary" size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    alt=""
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Setting">
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
// 获取用户相关的小仓库
import useUserStore from "@/store/modules/user";
// 获取骨架的小仓库
import { useLayOutSettingStore } from "@/store/modules/setting";
const SettingStore = useLayOutSettingStore();
const userStore = useUserStore();
const $router = useRouter();
const $route = useRoute();
const fullScreen = () => {
  // DOM对象的一个属性:可以用来判断当前是不是全屏模式 全屏:true
  const full = document.fullscreenElement;
  if (!full) {
    // 切换为全屏模式
    document.documentElement.requestFullscreen();
  } else {
    // 退出全屏模式
    document.exitFullscreen();
  }
};
// 退出登录
const logout = () => {
  // 第一件事情:需要向服务器告发送请求退出登录
  // 第二件事情:清除用户相关信息
  // 第三件事情:跳转到登录页面
  userStore.userLogout().then((res: string) => {
    if (res == "ok") {
      ElMessage({
        message: "退出成功",
        type: "success",
      });
      $router.push({
        path: "/login",
        query: {
          redirect: $route.path,
        },
      });
    } else {
      ElMessage.error(res);
    }
  });
  // 跳转到登录页
};
</script>
<style scoped></style>
