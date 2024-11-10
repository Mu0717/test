<template>
  <!-- 路由组件出库的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div :key="$route.path">
        <!-- 渲染layout一级路由的子路由 -->
        <component :is="Component" v-if="flag" />
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import { useLayOutSettingStore } from "@/store/modules/setting";
const SettingStore = useLayOutSettingStore();
// 控制当前组件是否重建
const flag = ref(true);
// 监听仓库内部数据是否发生变化
watch(
  () => SettingStore.refsh,
  () => {
    // 将flag设置为false，将当前组件销毁
    flag.value = false;
    // 将flag设置为true，将当前组件重建
    nextTick(() => {
      flag.value = true;
    });
  },
);
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
}
</style>
