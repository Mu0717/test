import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* 初始化样式 */
import "./style/reset.css"
/* 引入ant-design-vue框架 */
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
/* 将dayjs设置为中文 */
import "dayjs/locale/zh-cn";
/* 引入全局注册组件 */
import globalComponents from "./components"
createApp(App).use(store).use(router).use(Antd).use(globalComponents).mount('#app')
