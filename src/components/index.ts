// 引入项目中需要注册的全局组件
import SvgIcon from "./SvgIcon/index.vue";
import Category from "./Category/index.vue";
const allGlobalComponents: any = { SvgIcon, Category };
// 引入element-plus图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// console.log(allGlobalComponents);
// console.log(SvgIcon,'==SvgIcon');
// console.log(ElementPlusIconsVue, '===ElementPlusIconsVue');

// 对外暴露插件对象
export default {
  // 务必叫做install对象
  install(app: any) {
    // console.log(app, '==app');
    // 注册项目中全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key]);
    });
    // 注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
