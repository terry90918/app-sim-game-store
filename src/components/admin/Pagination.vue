<template>
  <!-- 分頁 -->
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !pagination.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="getProducts(pagination.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <li
        class="page-item"
        v-for="page in pagination.total_pages"
        :key="page"
        :class="{ active: pagination.current_page === page }"
      >
        <a class="page-link" href="#" @click.prevent="getProducts(page)">
          {{ page }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: !pagination.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="getProducts(pagination.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "pagination",
  props: {
    pagination: {
      type: Object,
      default: function() {
        return {
          total_pages: 1,
          current_page: 1,
          has_pre: false,
          has_next: false,
          category: null
        };
      }
    }
  },
  methods: {
    getProducts(number) {
      this.$emit("update:pagination", number);
    }
  }
};
</script>
