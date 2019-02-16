import Vue from "vue";
import Router from "vue-router";

// views
import Home from "./views/Home.vue";
import Admin from "./views/Admin";

// components
import Login from "./components/Login.vue";
import Main from "./components/admin/Main";
import Products from "./components/admin/Products";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/",
      name: "home",
      component: Home
    },
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
          name: "Main",
          component: Main,
          meta: { requiresAuth: true }
        },
        {
          path: "products",
          name: "products",
          component: Products,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
});
