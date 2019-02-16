<template>
  <div>
    <AlertMessage />
    <NavBar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <router-view></router-view>
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
  }
};
</script>
