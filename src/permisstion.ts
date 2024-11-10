// 路由鉴权,项目当中路由能不能访问的权限设置
import router from "@/router";
import * as nprogress from "nprogress";
import "nprogress/nprogress.css";
import setting from "./setting.ts";
// 在组件外部是无法使用小仓库，需要先将大仓库引入
import pinia from "./store";
// 获取用户相关小仓库中的token，用于判断是否登录成功
import useUserStore from "./store/modules/user";
const userStore = useUserStore(pinia);
// 全局守卫:项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach((to: any, _from: any, next: any) => {
  document.title = `${setting.title} | ${to.meta.title}`;
  // to:你将要访问的那个路由
  // from:你从那个路由来
  // next:路由放行函数
  // console.log(to,from,next);
  nprogress.start();
  // 通过token来判断用户是否登录
  const token = userStore.token;
  // 获取用户名称
  const username = userStore.username;
  if (token) {
    // 用户登录
    if (to.path == "/login") {
      // next({ path: from.path })
      next({ path: "/" });
    } else {
      // 有用户信息放行
      if (username) {
        next();
      } else {
        // 没有用户信息择则去获取用户信息
        userStore.userInfo().then(async (res: string) => {
          console.log(res);
          if (res == "ok") {
            next();
          } else {
            // 获取用户信息失败则跳转登录页
            // 1.先将用户相关数据清空
            await userStore.userLogout();
            // 2.跳转登录页
            next({ path: "/login", query: { redirect: to.path } });
          }
        });
      }
    }
  } else {
    // 用户未登录
    if (to.path == "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
});
// 全局后置守卫
router.afterEach(() => {
  nprogress.done();
});

// 第一个问题:人员路由切换实习进度条业务 ---nprogress
// 第二个问题:路由鉴权(路由访问权限设置)
// 全部路由:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

// 用户未登录只可以访问登录页，其余路由不可以访问(跳转登录页)
// 用户登录成功后不可访问登录页，访问登录页跳转首页，其余都可访问
