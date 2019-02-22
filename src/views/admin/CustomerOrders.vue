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
            <p class="card-text">{{ item.content.slice(0, 50) + "..." }}</p>
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
              @click="addToCart(item.id)"
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
            <select class="form-control mt-3" v-model="product.num">
              <option v-for="num in 10" :key="num" :value="num">
                選購 {{ num }} {{ product.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, product.num)"
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
    <hr />
    <div class="my-5 row justify-content-center">
      <div class="col-6">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody v-if="cart.carts">
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="align-middle">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)"
                >
                  <font-awesome-icon icon="trash-alt" />
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td class="align-middle">
                {{ item.qty }}/{{ item.product.unit }}
              </td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input
            type="text"
            class="form-control"
            v-model="coupon_code"
            placeholder="請輸入優惠碼"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="addCouponCode"
            >
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input
            id="useremail"
            class="form-control"
            type="email"
            name="email"
            placeholder="請輸入 Email"
            :class="{ 'is-invalid': errors.has('email') }"
            v-model="form.user.email"
            v-validate="'required|email'"
          />
          <span class="text-danger" v-if="errors.has('email')">
            {{ errors.first("email") }}
          </span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input
            id="username"
            class="form-control"
            type="text"
            name="name"
            placeholder="輸入姓名"
            :class="{ 'is-invalid': errors.has('name') }"
            v-model="form.user.name"
            v-validate="'required'"
          />
          <span class="text-danger" v-if="errors.has('name')">
            姓名必須輸入
          </span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input
            type="tel"
            class="form-control"
            id="usertel"
            v-model="form.user.tel"
            placeholder="請輸入電話"
          />
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input
            type="address"
            class="form-control"
            name="address"
            :class="{ 'is-invalid': errors.has('address') }"
            id="useraddress"
            v-model="form.user.address"
            v-validate="'required'"
            placeholder="請輸入地址"
          />
          <span class="text-danger" v-if="errors.has('address')">
            地址欄位不得留空
          </span>
        </div>

        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea
            name=""
            id=""
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "customer-orders",
  data() {
    return {
      cart: {},
      coupon_code: "",
      form: {
        message: "",
        user: {
          address: "",
          email: "",
          name: "",
          tel: ""
        }
      },
      isLoading: false,
      product: {},
      products: [],
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
    // 套用優惠券
    addCouponCode() {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/coupon`;
      const coupon = {
        code: vm.coupon_code
      };

      vm.isLoading = true;
      vm.axios.post(api, { data: coupon }).then(response => {
        vm.isLoading = false;
        if (response.data.success) {
          vm.$bus.$emit("message:push", response.data.message, "success");
          vm.getCart();
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    // 加入購物車
    addToCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart`;
      const cart = { product_id: id, qty };

      vm.status.loadingItem = id;
      vm.axios.post(api, { data: cart }).then(response => {
        vm.status.loadingItem = "";
        if (response.data.success) {
          vm.$bus.$emit("message:push", response.data.message, "success");
          $("#modal-edit").modal("hide");
          vm.getCart();
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    // 結帳頁面
    // 建立訂單後會把所選的購物車資訊刪除, message 欄位為必填, user 物件為必要
    createOrder() {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/order`;
      const order = vm.form;

      vm.isLoading = true;
      vm.$validator.validate().then(result => {
        if (result) {
          vm.axios.post(api, { data: order }).then(response => {
            vm.isLoading = false;
            if (response.data.success) {
              vm.$bus.$emit("message:push", "訂單已建立", "success");
            } else {
              vm.$bus.$emit("message:push", response.data.message, "danger");
            }
          });
        } else {
          vm.$bus.$emit("message:push", "欄位不完整", "danger");
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
          vm.$bus.$emit("message:push", response.data.message, "success");
          vm.cart = response.data.data;
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
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
          vm.$bus.$emit("message:push", response.data.message, "success");
          $("#modal-edit").modal("show");
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
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
          vm.$bus.$emit("message:push", response.data.message, "success");
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    // 刪除某一筆購物車資料
    removeCartItem(id) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart/${id}`;

      vm.isLoading = true;
      vm.axios.delete(api).then(response => {
        vm.isLoading = false;
        if (response.data.success) {
          vm.$bus.$emit("message:push", response.data.message, "success");
          vm.getCart();
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    }
  }
};
</script>
