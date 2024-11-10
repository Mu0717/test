<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>你好</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="login_btn"
              @click="login"
              :loading="btnLoading"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
// 引入用户相关小仓库
import useUserStore from "@/store/modules/user";
import { ElNotification } from "element-plus";
import { getTime } from "@/utils/time";
const useStore = useUserStore();
const $router = useRouter();
const $route = useRoute();
// 收集账号与密码的数据
const loginForm = reactive({
  username: "admin",
  password: "111111",
});
// 获取表单组件
const loginForms = ref();
// 登录按钮的loading状态
const btnLoading = ref(false);
const login = async () => {
  console.log(loginForms, "===loginForms");
  await loginForms.value.validate();
  // 点击登录按钮以后干什么?
  // 通知仓库发登录请去
  // 请求成功
  btnLoading.value = true;
  useStore
    .userLogin(loginForm)
    .then((res: string) => {
      console.log(res, "===res");
      if (res == "ok") {
        // 登录的时候判断路由当中是否有query参数，如果有就往query参数跳转,没有跳转到首页
        const redirect: string = $route.query.redirect as string;
        $router.push(redirect || "/");
        ElNotification.success({
          title: getTime(),
          message: "欢迎回来",
          showClose: false,
        });
      } else {
        ElNotification.error({
          message: res,
          showClose: false,
        });
      }
    })
    .finally(() => {
      btnLoading.value = false;
    });
};
// 自定义校验规则需要的函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  /* rule:为校验对象
    value:为校验的值
    callback:回调函数 必选调用不然无法触发校验规则
  */
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error("账号用户名至少为五位"));
  }
  // console.log(rule, value);
};
const validatorPassWord = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error("密码至少为六位数"));
  }
};
// 表单校验需要配置的对象
const rules = {
  username: [
    /* {
      required: true,
      min: 5,
      max: 10,
      message: "账号用户名至少为五位",
      trigger: "change",
    } */
    { validator: validatorUserName, trigger: "change" },
  ],
  password: [
    /* {
      required: true,
      min: 6,
      max: 15,
      message: "账号用户名至少为五位",
      trigger: "change",
    } */
    { validator: validatorPassWord, trigger: "change" },
  ],
};
console.log(import.meta.env.VITE_APP_NODE_ENV);
</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 50px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
