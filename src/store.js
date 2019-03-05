import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    categories: [],
    isLoading: false,
    pagination: {},
    products: []
  },
  mutations: {
    CATEGORIES(state, payload) {
      const categories = new Set();
      payload.forEach(item => {
        categories.add(item.category);
      });
      state.categories = Array.from(categories);
    },
    LOADING(state, payload) {
      state.isLoading = payload;
    },
    PAGINATION(state, payload) {
      state.pagination = payload;
    },
    PRODUCTS(state, payload) {
      state.products = payload;
    }
  },
  actions: {
    updateLoading(context, payload) {
      context.commit("LOADING", payload);
    },
    getProducts(context, payload) {
      let page = payload || 1;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/products?page=${page}`;

      context.commit("LOADING", true);
      axios.get(api).then(response => {
        context.commit("LOADING", false);
        if (response.data.success) {
          context.commit("CATEGORIES", response.data.products); // 分類
          context.commit("PAGINATION", response.data.pagination); // 分頁
          context.commit("PRODUCTS", response.data.products); // 產品
        }
      });
    }
  }
});
