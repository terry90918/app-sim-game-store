import axios from "axios";

export default {
  namespaced: true,
  state: {
    cart: {
      carts: []
    }
  },
  getters: {
    cart: state => state.cart
  },
  mutations: {
    CART(state, payload) {
      state.cart = payload;
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

      context.commit("LOADING", true, { root: true });
      axios.post(api, { data: item }).then(response => {
        context.commit("LOADING", false, { root: true });
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

      context.commit("LOADING", true, { root: true });
      axios.get(api).then(response => {
        context.commit("LOADING", false, { root: true });
        if (response.data.data.carts) {
          context.commit("CART", response.data.data);
        }
      });
    },
    // 刪除購物車項目
    removeCart(context, payload) {
      let id = payload.id;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart/${id}`;

      context.commit("LOADING", true, { root: true });
      axios.delete(api).then(response => {
        context.commit("LOADING", false, { root: true });
        if (response.data.success) {
          context.dispatch("getCart");
        }
      });
    }
  }
};
