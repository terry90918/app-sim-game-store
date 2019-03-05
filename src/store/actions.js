import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  actions: {
    // 更新讀取效果
    updateLoading(context, payload) {
      context.commit("LOADING", payload);
    }
  }
});
