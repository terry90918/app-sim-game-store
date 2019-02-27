<template>
  <div class="message-alert">
    <div
      class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, i) in messages"
      :key="i"
    >
      {{ item.message }}
      <button
        type="button"
        class="close"
        @click="removeMessage(i)"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "alert-message",
  data() {
    return {
      messages: []
    };
  },
  methods: {
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({
        message,
        status,
        timestamp
      });
      this.removeMessageWithTiming(timestamp);
    },
    removeMessage(num) {
      this.messages.splice(num, 1);
    },
    removeMessageWithTiming(timestamp) {
      const vm = this;
      setTimeout(() => {
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    }
  },
  created() {
    const vm = this;
    /**
     * Alert Message
     * messsage:push
     * message(String): default = 提示訊息
     * status(String): default = warning, Bootstrap4 Aler Style
     */
    // $on 註冊
    vm.$bus.$on("message:push", (message = "提示訊息", status = "warning") => {
      vm.updateMessage(message, status);
    });
    // $emit 呼叫
    // vm.$bus.$emit("message:push", message, status);
  }
};
</script>

<style lang="scss" scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>
