<template>
  <div>
    <p>狀態: {{ status }}</p>
  </div>
</template>

<script>
export default {
  name: "Status",
  data() {
    return {
      status: ""
    };
  },
  mounted() {
    this.userCheck();
  },
  methods: {
    userCheck() {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/user/check`;
      vm.axios.post(api).then(response => {
        if (response.data.success) {
          vm.status = "已登入";
        } else {
          vm.status = "未登入";
        }
      });
    }
  }
};
</script>
