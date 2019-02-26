<template>
  <div>
    <div class="container main-content mb-3">
      <Loading :active.sync="isLoading"></Loading>
      <div class="row">
        <div class="col-md-3">
          <!-- 左側選單 (List group) -->
          <div class="list-group sticky-top">
            <a
              class="list-group-item list-group-item-action"
              href="#"
              @click.prevent="searchText = item"
              :class="{ active: item === searchText }"
              v-for="item in categories"
              :key="item"
            >
              <i class="fa fa-street-view" aria-hidden="true"></i>
              <span>{{ item }}</span>
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action"
              @click.prevent="searchText = ''"
              :class="{ active: searchText === '' }"
            >
              全部顯示
            </a>
          </div>
        </div>

        <!-- 子頁面 -->
        <div class="col-md-9">
          <div class="d-flex mb-4">
            <!-- Search bar -->
            <form class="form-inline my-3 my-lg-0">
              <div class="input-group">
                <input
                  class="form-control"
                  type="text"
                  v-model="searchText"
                  placeholder="Search"
                  aria-label="Search"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="searchText = ''"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </form>
            <button
              class="btn btn-outline-primary ml-auto"
              type="button"
              @click="getProducts"
            >
              重新取得資料
            </button>
          </div>
          <!-- content -->
          <div class="tab-pane" id="list-gift">
            <div class="row align-items-stretch">
              <!-- 禮品 -->
              <div
                class="col-md-4 mb-4"
                v-for="item in filterData"
                :key="item.id"
              >
                <div class="card border-0 box-shadow text-center h-100">
                  <img
                    class="card-img-top"
                    :src="item.imageUrl"
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h4 class="card-title">{{ item.title }}</h4>
                    <p class="card-text text-left">
                      {{ item.content.slice(0, 50) + "..." }}
                    </p>
                  </div>
                  <div class="card-footer border-top-0 bg-white">
                    <button
                      class="btn btn-outline-secondary btn-block btn-sm"
                      @click="addtoCart(item.id)"
                    >
                      <i class="fa fa-cart-plus" aria-hidden="true"></i>
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from "jquery";
// import Pagination from "@/components/admin/Pagination";

export default {
  name: "home",
  // components: {
  //   Pagination
  // },
  data() {
    return {
      categories: [],
      isLoading: false,
      pagination: {},
      products: [],
      searchText: ""
    };
  },
  computed: {
    filterData() {
      const vm = this;
      if (vm.searchText) {
        return vm.products.filter(item => {
          const data = item.title
            .toLowerCase()
            .includes(vm.searchText.toLowerCase());
          return data;
        });
      }
      return vm.products;
    }
  },
  mounted() {
    const vm = this;
    vm.getProducts();
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/products?page=${page}`;

      vm.isLoading = true;
      vm.axios.get(api).then(response => {
        vm.isLoading = false;
        if (response.data.success) {
          vm.pagination = response.data.pagination; // 分頁
          vm.products = response.data.products; // 產品
          vm.getUnique();
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/cart`;
      const item = {
        product_id: id,
        qty
      };
      vm.isLoading = true;
      vm.axios.post(api, { data: item }).then(() => {
        vm.isLoading = false;
      });
    },
    getUnique() {
      const vm = this;
      const categories = new Set();
      vm.products.forEach(item => {
        categories.add(item.category);
      });
      vm.categories = Array.from(categories);
    }
  }
};
</script>
