import Vue from "vue";
import Vuex from "vuex";

import cartsModules from "./carts";
import productsModules from "./products";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false
  },
  getters: {
    isLoading: state => state.isLoading
  },
  mutations: {
    LOADING(state, payload) {
      state.isLoading = payload;
    }
  },
  actions: {
    // 更新讀取效果
    updateLoading(context, payload) {
      context.commit("LOADING", payload);
    }
  },
  modules: {
    cartsModules,
    productsModules
  }
});
