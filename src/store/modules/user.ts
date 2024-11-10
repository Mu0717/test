// 创建用户相关的小仓库
import { defineStore } from "pinia";
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
// 引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from "@/api/user/type.ts";
import type { UserState } from "./types/type";
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";
// 引入路由(常量路由)
import { constantRoute } from "@/router/routes";
const useUserStore = defineStore("User", {
  //存储数据:state
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识
      menuRoutes: constantRoute, // 仓库存储路由菜单
      username: "", // 用户名称
      avatar: "", // 用户头像
    };
  },
  //异步|逻辑的地方
  actions: {
    async userLogin(data: loginFormData) {
      //登录请求
      const result: loginResponseData = await reqLogin(data);
      console.log(result, "==result");
      //登录请求:成功200->token
      //登录请求:失败201->登录失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia|vuex存储数据其实利用js对象
        this.token = result.data as string;
        //本地存储持久化存储一份
        SET_TOKEN(result.data as string);
        //能保证当前async函数返回一个成功的promise
        return "ok";
      } else {
        return result.data;
      }
    },
    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息进行存储仓库当中
      const result: userInfoResponseData = await reqUserInfo();
      // console.log(result, "===result");
      // 如果获取用户信息成功，则存储
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        return "ok";
      } else {
        // 获取用户信息失败
        return result.message;
      }
    },
    // 退出登录
    async userLogout() {
      // console.log("===userLogout");
      // 退出登录请求
      const result: any = await reqLogout();
      // console.log(result,'===userLogout');
      if (result.code == 200) {
        this.token = "";
        this.username = "";
        this.avatar = "";
        REMOVE_TOKEN();
        return "ok";
      } else {
        return result.message;
      }
    },
  },
  getters: {},
});
export default useUserStore;
