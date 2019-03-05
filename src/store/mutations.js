import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  mutations: {
    LOADING(state, payload) {
      state.isLoading = payload;
    }
  }
});
