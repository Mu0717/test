<template>
  <a-watermark content="欢迎来到幕的博客">
    <a-config-provider :locale="zhCN">
      <router-view />
    </a-config-provider>
  </a-watermark>
</template>
<script lang="ts" setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
</script>
<style lang="less"></style>
