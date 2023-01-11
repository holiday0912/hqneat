import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "" */ "@/components/common/Home.vue"),
    meta: { title: "自述文件" },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard.vue"),
        meta: { permission: true, title: "系统首页" }
      },
      {
        path: "/accountManage",
        name: "accountManage",
        component: () =>
          import(
            /* webpackChunkName: "accountManage" */ "@/views/authorityManage/accountManage.vue"
          ),
        meta: { permission: false, title: "账号管理" }
      },
      {
        path: "/roleManage",
        name: "roleManage",
        component: () =>
          import(
            /* webpackChunkName: "roleManage" */ "@/views/authorityManage/roleManage.vue"
          ),
        meta: { permission: false, title: "角色管理" }
      },
      {
        path: "/resourcesManage",
        name: "resourcesManage",
        component: () =>
          import(
            /* webpackChunkName: "resourcesManage" */ "@/views/authorityManage/resourcesManage.vue"
          ),
        meta: { permission: false, title: "资源管理" }
      },
      // {
      //   path: "/quotaManage",
      //   name: "quotaManage",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "quotaManage" */ "@/views/quotaManage.vue"
      //     ),
      //   meta: { permission: false, title: "额度管理" }
      // },
      // {
      //   path: "/billManage",
      //   name: "billManage",
      //   component: () =>
      //     import(/* webpackChunkName: "billManage" */ "@/views/billManage.vue"),
      //   meta: { permission: false, title: "账单管理" }
      // },
      // 消息推送
      {
        path: "/msgPush",
        name: "msgPush",
        component: () =>
          import(
            /* webpackChunkName: "msgPush" */ "@/views/msgPush/MsgPush.vue"
          ),
        meta: { permission: false, title: "消息推送" }
      },
      // 登陆日志
      {
        path: "/loginLog",
        name: "loginLog",
        component: () =>
          import(
            /* webpackChunkName: "loginLog" */ "@/views/loginLog/LoginLog.vue"
          ),
        meta: { permission: false, title: "app日志" }
      },
      // h5包管理
      {
        path: "/htmlPackage",
        name: "htmlPackage",
        component: () =>
          import(
            /* webpackChunkName: "htmlPackage" */ "@/views/htmlPackage/HtmlPackage.vue"
          ),
        meta: { permission: false, title: "h5包管理" }
      },
      // 热修复
      {
        path: "/hotRepair",
        name: "hotRepair",
        component: () =>
          import(
            /* webpackChunkName: "hotRepair" */ "@/views/hotRepair/HotRepair.vue"
          ),
        meta: { permission: false, title: "热修复" }
      },
      // 埋点数据管理
      {
        path: "/buryData",
        name: "buryData",
        component: () =>
          import(
            /* webpackChunkName: "buryData" */ "@/views/buryData/BuryData.vue"
          ),
        meta: { permission: false, title: "埋点数据管理" }
      },
      // 轮播图管理
      {
        path: "/carouselManage",
        name: "carouselManage",
        component: () =>
          import(
            /* webpackChunkName: "carouselManage" */ "@/views/carouselManage/CarouselManage.vue"
          ),
        meta: { permission: false, title: "轮播图管理" }
      },
      // toast样式管理
      {
        path: "/toastManage",
        name: "toastManage",
        component: () =>
          import(
            /* webpackChunkName: "toastManage" */ "@/views/toastManage/ToastManage.vue"
          ),
        meta: { permission: false, title: "提示配置" }
      },
      // 业务类型
      {
        path: "/serviceType",
        name: "serviceType",
        component: () =>
          import(
            /* webpackChunkName: "serviceType" */ "@/views/serviceType/ServiceType.vue"
          ),
        meta: { permission: false, title: "业务类型" }
      },
      // 导航栏管理
      {
        path: "/tabbarCon",
        name: "tabbarCon",
        component: () =>
          import(
            /* webpackChunkName: "tabbarCon" */ "@/views/tabbarCon/TabbarCon.vue"
          ),
        meta: { permission: false, title: "导航栏管理" }
      },
      // 待办事项
      {
        path: "/todoList",
        name: "todoList",
        component: () =>
          import(
            /* webpackChunkName: "todoList" */ "@/views/todoList/TodoList.vue"
          ),
        meta: { permission: false, title: "待办事项" }
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    meta: { permission: false, title: "登录" }
  },
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/404",
    component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
    meta: { permission: false, title: "404 Not Found" }
  },
  {
    path: "/403",
    component: () => import(/* webpackChunkName: "403" */ "@/views/403.vue"),
    meta: { permission: false, title: "403" }
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
