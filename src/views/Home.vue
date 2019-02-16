<template>
  <div class="home">
    <Status />
    <router-link to="login" class="btn btn-primary">登入</router-link>
  </div>
</template>

<script>
import Status from "@/components/Status.vue";

export default {
  name: "home",
  components: {
    Status
  }
};
</script>
