import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import axios from "axios";
import VueAxios from "vue-axios";
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 導航守衛
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    axios.post(api).then(response => {
      if (response.data.success) {
        next();
      } else {
        next({
          path: "/login"
        });
      }
    });
  } else {
    next();
  }
});
