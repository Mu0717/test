// 进行axios二次封装:使用请求与响应拦截器
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
// 引入用户相关的仓库
import useUserStore from "@/store/modules/user";
let loading: any = null
// 第一步:利用axios对象的create方法,去创建axios实例(其他配置:基础路径,超时时间)
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径上会携带/api
  timeout: 5000, // 请求超时时间
});
// 第二步:request实例添加请去与响应拦截器
request.interceptors.request.use((config) => {
  // 获取用户仓库
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  // config配置对象,headers属性请求头,经常给服务器端携带公共参数
  // 返回配置对象
  return config;
});
// 第三步:响应拦截器
request.interceptors.response.use(
  (response) => {
    loading.close()
    // 成功回调
    // 简化数据
    return response.data;
  },
  (error) => {
    // 失败的回调:处理http网络的错误
    // 定义一个变量:存储网络错误的信息
    let message: string = "";
    // http状态码
    let status = error.response.status;
    switch (status) {
      case 401:
        message = "登录过期请重新登录";
        break;
      case 403:
        message = "无权访问";
        break;
      case 404:
        message = "地址不存在";
        break;
      case 500:
        message = "请求地址错误";
        break;
      default:
        message = "无网络";
        break;
    }
    ElMessage({
      type: "error",
      message: message,
    });
    loading.close()
    return Promise.reject(error);
  },
);
// 对外暴露
export default request;
