import Vue from "vue";
import Router from "vue-router";

// views
import Home from "./views/Home.vue";
import Admin from "./views/Admin";

// components
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "login"
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/admin",
      component: Admin,
      children: [
        {
          path: "",
          name: "dashboard",
          component: Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "products",
          name: "products",
          component: Products,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
});
