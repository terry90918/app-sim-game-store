<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <img
            :src="item.imageUrl"
            class="card-img-top"
            :alt="item.title + ' - 圖片'"
          />
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">
              {{ item.category }}
            </span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">
                {{ item.origin_price }} 元
              </div>
              <del class="h6" v-if="item.price">
                原價 {{ item.origin_price }} 元
              </del>
              <div class="h5" v-if="item.price">
                現在只要 {{ item.price }} 元
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <font-awesome-icon
                icon="spinner"
                spin
                v-if="item.id === status.loadingItem"
              />
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addtoCart(item.id)"
            >
              <font-awesome-icon
                icon="spinner"
                spin
                v-if="item.id === status.loadingItem"
              />
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="modal-edit"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-label">{{ product.title }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.image" class="img-fluid" alt="" />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">
                {{ product.description }}
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">
                {{ product.origin_price }} 元
              </div>
              <del class="h6" v-if="product.price">
                原價 {{ product.origin_price }} 元
              </del>
              <div class="h4" v-if="product.price">
                現在只要 {{ product.price }} 元
              </div>
            </div>
            <select class="form-control mt-3" v-model="selected">
              <option disabled value="">請選擇</option>
              <option v-for="num in 10" :key="num" :value="num">
                選購 {{ num }} {{ product.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ selected * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(product.id, selected)"
            >
              <font-awesome-icon
                icon="spinner"
                spin
                v-if="product.id === status.loadingItem"
              />
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "customer-orders",
  data() {
    return {
      isLoading: false,
      product: {},
      products: [],
      selected: "",
      status: {
        loadingItem: ""
      }
    };
  },
  mounted() {
    this.getCart();
    this.getProducts();
  },
  methods: {
    // 加入購物車
    addtoCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart`;
      const cart = { product_id: id, qty };

      vm.status.loadingItem = id;
      vm.axios.post(api, { data: cart }).then(response => {
        vm.selected = "";
        vm.status.loadingItem = "";
        if (response.data.success) {
          vm.getCart();
          $("#modal-edit").modal("hide");
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    },
    // 取得購物車列表
    getCart() {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart`;

      vm.isLoading = true;
      vm.axios.get(api).then(response => {
        vm.isLoading = false;
        if (response.data.success) {
          vm.products = response.data.products;
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    },
    // 單一商品細節
    getProduct(id) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/product/${id}`;

      vm.status.loadingItem = id;
      vm.axios.get(api).then(response => {
        vm.status.loadingItem = "";
        if (response.data.success) {
          vm.product = response.data.product;
          $("#modal-edit").modal("show");
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    },
    // 取得商品列表
    getProducts() {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/products`;

      vm.isLoading = true;
      vm.axios.get(api).then(response => {
        vm.isLoading = false;
        if (response.data.success) {
          vm.products = response.data.products;
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    }
  }
};
</script>
