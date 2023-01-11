import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import 'lib-flexible/flexible'
// import VueI18n from 'vue-i18n';
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
// import "./assets/css/theme-green/index.css"; // 浅绿色主题
import "./assets/css/icon.css";
import "./utils/dialog";
import NProgress from "nprogress"; // 进度条；进度指示器
import "nprogress/nprogress.css"; // 进度条；进度指示器 样式
import BasePagination from "@/components/BasePagination";
import BaseTable from "@/components/BaseTable.vue";
import { day } from "@/common/toolFunc";
// import './utils/rem'
import axios from "axios";

Vue.prototype.$axios = axios;
Vue.prototype.$dayjs = day;
Vue.prototype.$nodata = "——";

Vue.component("BasePagination", BasePagination);
Vue.component("BaseTable", BaseTable);

Vue.config.productionTip = false;
// Vue.use(VueI18n);
// const i18n = new VueI18n({
//   locale: 'zh',
//   messages
// });

Vue.use(ElementUI, {
  size: "small"
});

NProgress.inc(0.2);
NProgress.configure({
  easing: "ease",
  speed: 1000,
  trickleSpeed: 200,
  showSpinner: false
});

//使用钩子函数对路由进行权限跳转。
router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem("tk");
  if (!role && to.name !== "login") {
    NProgress.start();
    next({ name: "login" });
  } else if (to.name === "login") {
    next();
  } else {
    if (to.meta.permission) {
      next();
    } else {
      const router = JSON.parse(sessionStorage.getItem("userLoginContext"));
      const temp1 = router.map(i => {
        if (i.resources) {
          return i.resources.map(i => i.router);
        }
        return i.router;
      });
      const routes = temp1.flat();
      if (to.path === "/404" || to.path === "/403") {
        next();
      } else if (routes.includes(to.name)) {
        NProgress.start();
        next();
      } else {
        next({ path: "/404" });
      }
    }
  }
});

router.afterEach(to => {
  NProgress.done();
});

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

// 数据字典删选
Vue.prototype.filterFlag = function(data, val) {
  let list = {};
  if (val && this[data] && this[data].length > 0) {
    this[data].forEach(item => {
      if (val === item.code) {
        list = item;
      }
    });
    return `${list.code} - ${list.name} `;
  }
};

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
