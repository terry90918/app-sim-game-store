import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// axios
import axios from "axios";
import VueAxios from "vue-axios";
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

// fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// library.add(faUserSecret);
// Vue.component("font-awesome-icon", FontAwesomeIcon);
library.add(fab, far, fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);

// bootstrap
import "bootstrap";

// vue-loading
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
Vue.component("Loading", Loading);

// event bus
import "./bus";

// filters
import currencyFilter from "./filters/currency";
import dateFilter from "./filters/date";
Vue.filter("currency", currencyFilter);
Vue.filter("date", dateFilter);

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
      if (response.data.success) next();
      else next({ path: "/login" });
    });
  } else {
    next();
  }
});
