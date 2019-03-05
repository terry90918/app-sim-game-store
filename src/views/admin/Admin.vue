<template>
  <div>
    <AlertMessage />
    <Loading :active.sync="isLoading" />
    <NavBar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4 pt-5">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import AlertMessage from "@/components/admin/AlertMessage";
import NavBar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

export default {
  name: "admin",
  components: {
    AlertMessage,
    NavBar,
    Sidebar
  },
  computed: {
    isLoading() {
      const vm = this;
      return vm.$store.state.isLoading;
    }
  }
};
</script>
