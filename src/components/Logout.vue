<template>
  <div class="p-2">
    <p>狀態: {{ status }}</p>
    <button @click="signout" class="btn btn-primary">登出</button>
  </div>
</template>

<script>
export default {
  name: "Logout",
  data() {
    return {
      res: null,
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
    },
    signout() {
      const api = `${process.env.VUE_APP_API}/logout`;
      const vm = this;
      this.axios.post(api).then(response => {
        vm.res = response.data;
        if (vm.res.success) {
          vm.$router.push("/");
        }
      });
    }
  }
};
</script>
