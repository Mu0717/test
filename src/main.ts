import { createApp } from "vue";
import App from "./App.vue";
// 引入ElementPlus插件与样式
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// svg需要配置代码
import "virtual:svg-icons-register";
// 引入ElementPlus国际化包
//@ts-ignore (忽略当前文件ts类型的检测否则有红色提示(打包会失败))
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// 引入自定义插件对象
import globalComponents from "@/components";
// 引入模板全局样式
import "@/styles/index.scss";
// 引入路由
import router from "./router";
// 引入pinia
import pinia from "./store/index.ts";
// 引入路由鉴权
import "./permisstion.ts";
const app = createApp(App);
// 安装自定义插件
app.use(globalComponents);
/* 将ElementPlus配置为中文 */
app.use(ElementPlus, {
  locale: zhCn,
});
// 注册模板路由
app.use(router);
// 安装pinia
app.use(pinia);
// 将应用挂载到节点上
app.mount("#app");
