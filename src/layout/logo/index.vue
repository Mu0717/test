<template>
  <div class="logo">
    <img :src="setting.logo" alt="" v-if="setting.logoHidden" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts" name="logo">
// 引入设置标题与logo配置文件
import setting from "@/setting";
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    margin-left: 10px;
  }

  p {
    font-size: $base-menu-title-fontSize;
    margin-left: 10px;
  }
}
</style>
