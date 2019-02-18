import Vue from "vue";
import Router from "vue-router";

import Admin from "./views/admin/Admin.vue";
import Coupons from "./views/admin/Coupons.vue";
import CustomerOrder from "./views/admin/CustomerOrders";
// import Home from "./views/Home.vue";
import Login from "./views/auth/Login.vue";
import DashboardMain from "./views/admin/DashboardMain.vue";
import Orders from "./views/admin/Orders.vue";
import Products from "./views/admin/Products.vue";

Vue.use(Router);

export default new Router({
  linkActiveClass: "active",
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    // {
    //   path: "/",
    //   name: "home",
    //   component: Home
    // },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/admin",
      // name: "admin",
      component: Admin,
      children: [
        {
          path: "",
          name: "dashboard-main",
          component: DashboardMain,
          meta: { requiresAuth: true }
        },
        {
          path: "coupons",
          name: "coupons",
          component: Coupons,
          meta: { requiresAuth: true }
        },
        {
          path: "orders",
          name: "orders",
          component: Orders,
          meta: { requiresAuth: true }
        },
        {
          path: "products",
          name: "products",
          component: Products,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: "/",
      name: "Admin",
      component: Admin,
      children: [
        {
          path: "customer-order",
          name: "customer-order",
          component: CustomerOrder
        }
      ]
    }
  ]
});
