import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "" */ '@/components/common/Home.vue'),
    meta: { title: '自述文件' },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/components/page/Dashboard.vue'),
        meta: { permission: true, title: '系统首页' }
      },
      {
        path: "/accountManage",
        name: "accountManage",
        component: () => import(/* webpackChunkName: "accountManage" */ '@/components/page/authorityManage/accountManage.vue'),
        meta: { permission: false, title: '账号管理' }
      },
      {
        path: "/roleManage",
        name: "roleManage",
        component: () => import(/* webpackChunkName: "roleManage" */ '@/components/page/authorityManage/roleManage.vue'),
        meta: { permission: false, title: '角色管理' }
      },
      {
        path: "/resourcesManage",
        name: "resourcesManage",
        component: () => import(/* webpackChunkName: "resourcesManage" */ '@/components/page/authorityManage/resourcesManage.vue'),
        meta: { permission: false, title: '资源管理' }
      },
      {
        path: "/quotaManage",
        name: "quotaManage",
        component: () => import(/* webpackChunkName: "quotaManage" */ '@/components/page/quotaManage.vue'),
        meta: { permission: false, title: '额度管理' }
      },
      {
        path: "/billManage",
        name: "billManage",
        component: () => import(/* webpackChunkName: "billManage" */ '@/components/page/billManage.vue'),
        meta: { permission: false, title: '账单管理' }
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ '@/components/page/Login.vue'),
    meta: { permission: false, title: '登录' }
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/components/page/404.vue'),
    meta: { permission: false, title: '404 Not Found' }
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "403" */ '@/components/page/403.vue'),
    meta: { permission: false, title: '403' }
  }
];

const router = new VueRouter({
  routes
});

export default router;
