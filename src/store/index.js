import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import mutations from "./mutations";
import cartsModules from "./modules/carts";
import productsModules from "./modules/products";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false
  },
  getters: {
    isLoading: state => state.isLoading
  },
  mutations,
  actions,
  modules: {
    cartsModules,
    productsModules
  }
});
