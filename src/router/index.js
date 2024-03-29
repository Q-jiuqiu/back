/*
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-20 22:48:01
 * @Description: file content
 * @FilePath: \vue-admin-template\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    meta: { title: "小程序管理后台", icon: "dashboard" },
    redirect: "/portal",
    children: [
      {
        path: "portal",
        name: "Portal",
        component: () => import("@/views/portal/index"),
        meta: { title: "美食", icon: "dashboard" }
      },
      {
        path: "scape",
        name: "scape",
        component: () => import("@/views/scape/scape"),
        meta: { title: "景点", icon: "el-icon-s-order" }
      },
      {
        path: "visitStore",
        name: "visitStore",
        component: () => import("@/views/visitStore/visitStore"),
        meta: { title: "探店字典表", icon: "dashboard" }
      },
      {
        path: "dictionary",
        name: "dictionary",
        component: () => import("@/views/dictionary/dictionary"),
        meta: { title: "一级分类", icon: "el-icon-s-finance" }
      },
      {
        path: "twoDictionary",
        name: "twoDictionary",
        component: () => import("@/views/dictionary/twoDictionary"),
        meta: { title: "二级分类", icon: "el-icon-s-finance" }
      },
      {
        path: "cityManagement",
        name: "cityManagement",
        component: () => import("@/views/cityManagement/cityManagement"),
        meta: { title: "城市", icon: "el-icon-s-shop" }
      },
      {
        path: "message",
        name: "message",
        component: () => import("@/views/message/message"),
        meta: { title: "留言", icon: "el-icon-s-cooperation" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    mode: "hash",
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
