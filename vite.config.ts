import { defineConfig, loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
// 引入svg图标需要用到的插件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// 组件设置name插件
import VueSetupExtend from "vite-plugin-vue-setup-extend";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下对应的变量
  const env = loadEnv(mode, process.cwd());
  return {
    base: "/",
    plugins: [
      vue(),
      vueJsx(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        localEnabled: command === "serve",
      }),
      VueSetupExtend(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // scss全局变量文件
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨越
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, // 获取数据的服务器地址
          changeOrigin: true, // 是否开启跨域
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''), // 路径重写
        },
      },
    },
  };
});
