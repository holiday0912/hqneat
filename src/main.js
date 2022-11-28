import '@babel/polyfill'
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import 'lib-flexible/flexible'
// import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './utils/dialog'
import NProgress from "nprogress"; // 进度条；进度指示器
import "nprogress/nprogress.css"; // 进度条；进度指示器 样式
// import './utils/rem'
import axios from "axios";
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;
// Vue.use(VueI18n);
// const i18n = new VueI18n({
//   locale: 'zh',
//   messages
// });
Vue.use(ElementUI, {
  size: 'small'
});
NProgress.inc(0.2);
NProgress.configure({
  easing: "ease",
  speed: 1000,
  trickleSpeed: 200,
  showSpinner: false
});
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('token');
  if (!role && to.path !== '/login') {
    next('/login');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
})
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
})

// 数据字典删选
Vue.prototype.filterFlag = function (data, val) { 
  let list = {}
  if (val && this[data] && this[data].length > 0) {
    this[data].forEach((item) => {
      if (val === item.code) {
        list = item
      }
    })
    return `${list.code} - ${list.name} `
  }
}

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");