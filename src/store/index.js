import Vue from "vue";
import Vuex from "vuex";

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
  modules: {
    cartsModules,
    productsModules
  }
});
