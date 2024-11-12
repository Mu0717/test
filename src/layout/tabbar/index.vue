<template>
  <nav>
    <a-row class="tabbar">
      <a-col v-bind="wrapperCol1" class="wrapperCol1">
        <a href="/">
          <div class="logo"></div>
          <div class="logo-title">幕</div>
        </a>
      </a-col>
      <a-col v-bind="wrapperCol2" class="wrapperCol2">
        <a href="/">首页</a>
        <a href="/">关于</a>
        <a href="/">标签</a>
        <a href="/">分类</a>
        <a href="/">联系站长</a>
      </a-col>
      <a-col v-bind="wrapperCol3" class="wrapperCol3">
        <component
          is="SearchOutlined"
          :style="{ fontSize: '24px' }"
        ></component>
      </a-col>
    </a-row>
  </nav>
</template>

<script setup lang="ts">
import { reactive } from "vue";
const wrapperCol1 = reactive({
  xs: {
    span: 8,
    // order: 1,
  },
  sm: {
    span: 8,
    // order: 1,
  },
  lg: {
    span: 8,
  },
});
const wrapperCol2 = reactive({
  xs: {
    span: 8,
    // order: 2,
  },
  sm: {
    span: 8,
    // order: 2,
  },
  lg: {
    span: 8,
    push: 3,
  },
});
const wrapperCol3 = reactive({
  xs: {
    span: 8,
  },
  sm: {
    span: 8,
  },
  lg: {
    span: 8,
  },
});
</script>
<script lang="ts">
export default {
  name: "tabbar",
};
</script>
<style lang="less" scoped>
nav {
  background-color: aqua;
}
.tabbar {
  width: 1200px;
  margin: 0 auto;
  background-color: yellowgreen;
  .wrapperCol1 {
    a {
      display: flex;
      align-items: center;
      .logo {
        width: 45px;
        height: 45px;
        background-color: red;
      }
      .logo-title {
        font-size: 24px;
        margin-left: 5px;
        color: white;
      }
    }
  }
  .wrapperCol2 {
    display: flex;
    line-height: 45px;
    a {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .wrapperCol3 {
    display: flex;
    align-items: center;
  }
}
</style>
