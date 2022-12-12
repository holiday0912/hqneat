/**
 * 封装axios请求拦截器
 * @param url
 * @param data
 * @returns {Promise}
 */
import axios from "axios";
import router from "@/router";
import { Loading, Message } from "element-ui";
import Vue from "vue";
import { baseUrl } from "@/config/setting";
// import { smSign, smEncryption, smDecrypt, smSignTrue } from '../utils/sm2'; // 需要sm2加密在打开

export const http = axios.create({
  baseURL: baseUrl
});

// request 拦截器
const options = { text: "拼命加载中", fullscreen: true };
let loadingRequestCount = 0;
let loadingInstance;
const showLoading = () => {
  if (loadingRequestCount === 0) {
    // element的服务方式 target 我这边取的是表格 项目是后台系统 每个页面都有表格 类似整个表格loading
    loadingInstance = Loading.service(options);
  }
  loadingRequestCount++;
};
const hideLoading = () => {
  if (loadingRequestCount <= 0) return;
  loadingRequestCount--;
  if (loadingRequestCount === 0) {
    Vue.nextTick(() => {
      // 以服务的方式调用的 Loading 需要异步关闭
      if (loadingInstance) {
        loadingInstance.close();
      }
    });
  }
};
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  config => {
    // 加签
    // let sign = smSign(config)
    // config.headers.sign = sign
    if (config.method == "post") {
      config.params = {};
    } else if (config.method == "get") {
      // console.log(config)
      // config.params = config.data
    }
    config.url = `${baseUrl}${config.url}`;
    config.headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: sessionStorage.getItem("token")
    };
    showLoading();
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    setTimeout(() => {
      hideLoading();
    }, 200);
    if (response.status == 200) {
      let res = response.data;
      if (res.code.slice(-5) === "00000") {
        // 验签
        // let obj = smSignTrue(response)
        // if (obj.flag) {
        // res.data = JSON.parse(obj.datas).data
        //     return res;
        // } else {
        // Message.error('验签失败');
        //     return false;
        // }
        return res;
      } else if (res.code.slice(-5) === "50001") {
        // token失效，跳转登入页
        router.push({ path: "/login" });
      } else {
        Message.error(res.message);
        return false;
      }
    }
  },
  error => {
    setTimeout(() => {
      hideLoading();
    }, 200);
    if (error && error.response) {
      if (error.response.status == 500) {
        Message.error("服务器内部错误，请联系管理人员");
      } else if (error.response.status == 502) {
        Message.error("服务器正在更新版本，请稍后重试");
      } else if (error.response.status == 401) {
        Message.error("登录状态失效，请重新登录");
      }
    }
    return Promise.reject(error);
  }
);
export default axios;
