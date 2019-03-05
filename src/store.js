import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    cart: {
      carts: []
    },
    categories: [],
    isLoading: false,
    pagination: {},
    products: []
  },
  mutations: {
    CART(state, payload) {
      state.cart = payload;
    },
    CATEGORIES(state, payload) {
      // 排除重複分類
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
    // 加入購物車
    addtoCart(context, payload) {
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart`;
      const item = {
        product_id: payload.id,
        qty: payload.qty
      };

      context.commit("LOADING", true);
      axios.post(api, { data: item }).then(response => {
        context.commit("LOADING", false);
        if (response.data.success) {
          context.dispatch("getCart");
        }
      });
    },
    // 取得購物車
    getCart(context) {
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart`;

      context.commit("LOADING", true);
      axios.get(api).then(response => {
        context.commit("LOADING", false);
        if (response.data.data.carts) {
          context.commit("CART", response.data.data);
        }
      });
    },
    // 取得商品列表
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
    },
    // 刪除購物車項目
    removeCart(context, payload) {
      let id = payload.id;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart/${id}`;

      context.commit("LOADING", true);
      axios.delete(api).then(response => {
        context.commit("LOADING", false);
        if (response.data.success) {
          context.dispatch("getCart");
        }
      });
    },
    // 更新讀取效果
    updateLoading(context, payload) {
      context.commit("LOADING", payload);
    }
  },
  getters: {
    cart: state => state.cart,
    categories: state => state.categories,
    isLoading: state => state.isLoading,
    pagination: state => state.pagination,
    products: state => state.products
  }
});
