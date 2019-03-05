<template>
  <div>
    <AlertMessage />
    <Loading :active.sync="isLoading" />
    <NavBar />
    <div class="jumbotron jumbotron-fluid jumbotron-bg d-flex align-items-end">
      <div class="container">
        <div class="p-3 bg-lighter">
          <h1 class="display-3 font-weight-bold">輕鬆玩遊戲</h1>
          <p class="lead">最後出清！買到剁手手！</p>
        </div>
      </div>
    </div>
    <div class="container main-content mb-3">
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
              <font-awesome-icon icon="street-view" />
              <span class="ml-1">{{ item }}</span>
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action"
              @click.prevent="searchText = ''"
              :class="{ active: searchText === '' }"
            >
              <span>全部顯示</span>
            </a>
          </div>
        </div>

        <!-- 子頁面 -->
        <div class="col-md-9">
          <div class="d-flex mb-4">
            <!-- Search bar -->
            <form class="form-inline my-lg-0">
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
                    <font-awesome-icon icon="times" />
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
                class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"
                v-for="item in filterData"
                :key="item.id"
              >
                <div class="card box-shadow h-100">
                  <img
                    class="card-img-top"
                    :src="item.imageUrl"
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h4 class="card-title">
                      {{
                        item.title.length > 10
                          ? item.title.slice(0, 10) + "..."
                          : item.title
                      }}
                    </h4>
                    <p class="card-text text-left">
                      {{
                        item.content.length > 25
                          ? item.content.slice(0, 25) + "..."
                          : item.content
                      }}
                    </p>
                  </div>
                  <div class="card-footer border-top-0 bg-white">
                    <button
                      class="btn btn-outline-secondary btn-block btn-sm"
                      @click="addtoCart(item.id)"
                    >
                      <font-awesome-icon icon="cart-plus" />
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            @update:pagination="getProducts"
            :pagination="pagination"
          />
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import $ from "jquery";
import AlertMessage from "@/components/home/AlertMessage";
import FooterBar from "@/components/home/FooterBar";
import NavBar from "@/components/home/NavBar";
import Pagination from "@/components/home/Pagination";

export default {
  name: "home",
  components: {
    AlertMessage,
    FooterBar,
    NavBar,
    Pagination
  },
  data() {
    return {
      searchText: ""
    };
  },
  computed: {
    filterData() {
      const vm = this;
      if (vm.searchText) {
        return vm.products.filter(item => {
          const data = item.category
            .toLowerCase()
            .includes(vm.searchText.toLowerCase());
          return data;
        });
      }
      return vm.products;
    },
    ...mapGetters(["categories", "isLoading", "pagination", "products"])
  },
  mounted() {
    const vm = this;
    vm.getProducts();
  },
  methods: {
    ...mapActions(["addtoCart", "getProducts"])
  }
};
</script>

<style lang="scss" scoped>
.jumbotron-bg {
  /* banners.png */
  // Photo by Pawel Kadysz on Unsplash
  background-image: url(~@/assets/image/lum3n-250309-unsplash.jpg);
  background-size: cover;
  background-position: center center;
  min-height: 400px;
}
/* 半透明背景 */
.bg-lighter {
  background-color: rgba(255, 255, 255, 0.45);
}
/* 購物車按鈕 */
.btn-cart {
  background-color: transparent;
  position: relative;
  /* 購物車按鈕定位 */
  .badge {
    position: absolute;
    top: 1px;
    right: 1px;
  }
}
.main-content {
  min-height: calc(100vh - 56px - 176px);
}
.box-shadow {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  transition: 0.3s linear;
  &:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
  }
}
.dropdown-menu-right {
  right: 0;
  left: auto;
}
.alert-rounded {
  border-radius: 50px;
}
</style>
