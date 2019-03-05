import axios from "axios";

export default {
  namespaced: true,
  state: {
    categories: [],
    pagination: {},
    products: []
  },
  getters: {
    categories: state => state.categories,
    isLoading: state => state.isLoading,
    pagination: state => state.pagination,
    products: state => state.products
  },
  mutations: {
    CATEGORIES(state, payload) {
      // 排除重複分類
      const categories = new Set();
      payload.forEach(item => {
        categories.add(item.category);
      });
      state.categories = Array.from(categories);
    },
    PAGINATION(state, payload) {
      state.pagination = payload;
    },
    PRODUCTS(state, payload) {
      state.products = payload;
    }
  },
  actions: {
    // 取得商品列表
    getProducts(context, payload) {
      let page = payload || 1;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/products?page=${page}`;

      context.commit("LOADING", true, { root: true });
      axios.get(api).then(response => {
        context.commit("LOADING", false, { root: true });
        if (response.data.success) {
          context.commit("CATEGORIES", response.data.products); // 分類
          context.commit("PAGINATION", response.data.pagination); // 分頁
          context.commit("PRODUCTS", response.data.products); // 產品
        }
      });
    }
  }
};
