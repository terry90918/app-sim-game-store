<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <router-link class="navbar-brand" to="/">
        <font-awesome-icon icon="gamepad" class="text-info" />
        Sim Games Store
      </router-link>
      <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
      <div class="dropdown ml-auto">
        <button
          class="btn btn-sm btn-cart"
          data-toggle="dropdown"
          data-flip="false"
        >
          <font-awesome-icon icon="shopping-cart" size="2x" class="text-dark" />
          <span class="badge badge-pill badge-danger">
            {{ cart.carts.length }}
          </span>
          <span class="sr-only">unread messages</span>
        </button>
        <div
          class="dropdown-menu dropdown-menu-right p-3"
          style="min-width: 300px"
          data-offset="400"
        >
          <h6>已選擇商品</h6>
          <table class="table table-sm" v-if="cart.carts.length > 0">
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle text-center">
                  <a
                    href="#"
                    class="text-muted"
                    @click.prevent="removeCart(item.id)"
                  >
                    <font-awesome-icon icon="trash-alt" />
                  </a>
                </td>
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">
                  {{ item.qty }}{{ item.product.unit }}
                </td>
                <td class="align-middle text-right">{{ item.total }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary btn-block">
            <font-awesome-icon icon="cart-plus" /> 結帳去
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "nav-bar",
  computed: {
    ...mapGetters(["cart"])
  },
  mounted() {
    const vm = this;
    vm.getCart();
  },
  methods: {
    ...mapActions(["getCart", "removeCart"])
  }
};
</script>

<style></style>
