<template>
  <div>
    <button @click="signout" class="btn btn-primary">登出</button>
  </div>
</template>

<script>
export default {
  name: "logout",
  data() {
    return {
      res: null
    };
  },
  methods: {
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
